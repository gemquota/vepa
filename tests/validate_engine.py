import re
import subprocess
import os
import sys

def test_js_syntax():
    print("[TEST] Checking JavaScript Syntax...")
    with open('index.html', 'r') as f:
        html = f.read()
    
    js_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
    if not js_match:
        print("FAILED: No <script> tag found.")
        return False
    
    js_code = js_match.group(1)
    with open('tmp_test.js', 'w') as f:
        f.write(js_code)
    
    # Use node --check to validate syntax without executing
    result = subprocess.run(['node', '--check', 'tmp_test.js'], capture_output=True, text=True)
    os.remove('tmp_test.js')
    
    if result.returncode != 0:
        print(f"FAILED: JS Syntax Error:\n{result.stderr}")
        return False
    print("PASSED: JS Syntax is valid.")
    return True

def test_ssot_alignment():
    print("[TEST] Verifying SSoT Parameter Alignment...")
    with open('ENGINE_SSOT.md', 'r') as f:
        ssot = f.read()
    with open('index.html', 'r') as f:
        html = f.read()

    # Extract all bullet points from sections 1 and 2 of SSoT
    # This regex looks for names like "**Force:**"
    params = re.findall(r'\*   \*\*(.*?):\*\*', ssot)
    
    missing = []
    for p in params:
        # Check if the parameter name exists in the HTML (UI or Logic)
        # We look for the literal name in the metadata or IDs
        if p not in html:
            missing.append(p)
    
    if missing:
        print(f"FAILED: Missing SSoT parameters in index.html: {', '.join(missing)}")
        return False
    
    print(f"PASSED: All {len(params)} SSoT parameters accounted for.")
    return True

def test_ui_integrity():
    print("[TEST] Checking UI Element Integrity...")
    with open('index.html', 'r') as f:
        html = f.read()
    
    required_ids = [
        'header-controls', 'simple-interface', 'main-interface',
        'dna-sliders', 'birth-sliders', 'death-sliders', 'eco-sliders', 'phys-sliders',
        'chaos-menu', 'modal-overlay', 'sim-canvas'
    ]
    
    missing = [rid for rid in required_ids if f'id="{rid}"' not in html]
    
    if missing:
        print(f"FAILED: Missing critical UI IDs: {', '.join(missing)}")
        return False
    
    print("PASSED: All critical UI elements present.")
    return True

if __name__ == "__main__":
    results = [
        test_js_syntax(),
        test_ssot_alignment(),
        test_ui_integrity()
    ]
    
    if all(results):
        print("\n--- ALL TESTS PASSED: VEPA ENGINE IS HEALTHY ---")
        sys.exit(0)
    else:
        print("\n--- TESTS FAILED: ENGINE HAS REGRESSIONS ---")
        sys.exit(1)
