import os
import re
from pathlib import Path

ROOT = Path("src")
EVENT_IMPORT = 'import { bus } from "./core/eventBus.js";\n'
EMIT_BLOCK = """
bus.emit("physics:update", { particles, time: performance.now?.() ?? Date.now(), frame });
"""
FRAME_COUNTER_PATTERN = "frame = frame + 1"

# ----------------------------
# PATTERNS
# ----------------------------
IMPORT_CHECK = "eventBus"
PARTICLE_PATTERNS = [
    re.compile(r'\bparticles\s*=\s*e\.data\.particles\b'),
    re.compile(r'\bconst\s+particles\s*=\s*e\.data\.particles\b'),
    re.compile(r'\blet\s+particles\s*=\s*e\.data\.particles\b'),
    re.compile(r'\bparticles\s*=\s*engine\.getParticles\(\)'),
    re.compile(r'\bconst\s+particles\s*=\s*engine\.getParticles\(\)'),
]
LOOP_PATTERNS = [
    re.compile(r'worker\.onmessage\s*=\s*\(.*\)\s*=>\s*{', re.I),
    re.compile(r'function\s+(update|loop|tick)\s*\(', re.I),
    re.compile(r'requestAnimationFrame\s*\(', re.I),
]

def is_js(p: Path):
    return p.suffix in [".js", ".ts", ".jsx", ".tsx"]

def already_patched(text: str):
    return "physics:update" in text

def ensure_import(text: str):
    if IMPORT_CHECK in text:
        return text
    lines = text.splitlines(keepends=True)
    for i, line in enumerate(lines):
        if line.strip().startswith("import "):
            lines.insert(i + 1, EVENT_IMPORT)
            return "".join(lines)
    return EVENT_IMPORT + "".join(lines)

def inject_frame_counter(lines):
    """ Ensures a `frame` variable exists in loop scope """
    for i, line in enumerate(lines):
        if re.search(r'(function\s+(update|loop|tick)|requestAnimationFrame|onmessage)', line):
            # try insert frame init shortly after
            indent = re.match(r'\s*', line).group(0)
            snippet = f"{indent}let frame = 0;\n"
            if "let frame" not in "".join(lines[max(0,i-5):i+10]):
                lines.insert(i+1, snippet)
            return lines
    return lines

def inject_emit(lines):
    injected = False
    for i, line in enumerate(lines):
        # 1. direct particle assignment hook (best case)
        for pat in PARTICLE_PATTERNS:
            if pat.search(line):
                indent = re.match(r'\s*', line).group(0)
                snippet = indent + EMIT_BLOCK.lstrip()
                if "physics:update" not in lines[i+1:i+4]:
                    lines.insert(i+1, snippet)
                injected = True
                break
        if injected: break
        
    # 2. fallback: loop-level injection
    if not injected:
        for i, line in enumerate(lines):
            if any(p.search(line) for p in LOOP_PATTERNS):
                # avoid duplicates
                window = "".join(lines[max(0,i-5):min(len(lines),i+10)])
                if "physics:update" in window:
                    return lines, True
                    
                indent = re.match(r'\s*', line).group(0) + "    "
                snippet = (
                    indent + "// injected physics observer\n" +
                    indent + EMIT_BLOCK.replace("\n", "\n" + indent).strip() + "\n"
                )
                lines.insert(i+1, snippet)
                injected = True
                break
    return lines, injected

def process_file(path: Path):
    text = path.read_text(encoding="utf-8")
    if already_patched(text):
        return False, "already patched"
    
    lines = text.splitlines(keepends=True)
    lines = inject_frame_counter(lines)
    lines, ok = inject_emit(lines)
    
    if not ok:
        return False, "no injection point found"
        
    new_text = "".join(lines)
    new_text = ensure_import(new_text)
    path.write_text(new_text, encoding="utf-8")
    return True, "patched"

def main():
    patched = 0
    skipped = 0
    for p in ROOT.rglob("*"):
        if not is_js(p):
            continue
        ok, msg = process_file(p)
        if ok:
            print(f"✔ {p}")
            patched += 1
        else:
            print(f"• {p} ({msg})")
            skipped += 1
            
    print("\nDone.")
    print("Patched:", patched)
    print("Skipped:", skipped)

if __name__ == "__main__":
    main()
