import os

def extract_file(filename, start_marker, end_marker):
    with open('combined.txt', 'r') as f:
        lines = f.readlines()
    
    start_idx = -1
    end_idx = -1
    
    marker = f"File: {filename}"
    for i, line in enumerate(lines):
        if marker in line:
            # Found the file header
            # The actual content starts after the ==== line
            start_idx = i + 3
            break
    
    if start_idx == -1:
        print(f"File {filename} not found in combined.txt")
        return
    
    for i in range(start_idx, len(lines)):
        if "================================================================================" in lines[i]:
            end_idx = i - 1
            break
    
    if end_idx == -1:
        end_idx = len(lines)
        
    content = "".join(lines[start_idx:end_idx])
    with open(filename + '.restored', 'w') as f:
        f.write(content)
    print(f"Restored {filename} to {filename}.restored")

extract_file('src/constants.js', None, None)
extract_file('src/ui.js', None, None)
extract_file('src/worker/physics.worker.js', None, None)
extract_file('src/main.js', None, None)
extract_file('codex/entries.json', None, None)
