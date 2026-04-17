import sys
import subprocess
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class RestartHandler(FileSystemEventHandler):
    """Restarts a subprocess when files are modified."""
    def __init__(self, command):
        self.command = command
        self.process = None
        self.last_restart = 0
        self.debounce_seconds = 0.5
        self.start_server()

    def start_server(self):
        if self.process:
            print("\n[RESTART] Changes detected. Restarting server...")
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
        else:
            print(f"[START] Starting server with command: {' '.join(self.command)}")
        
        # Start the server as a new process
        self.process = subprocess.Popen(self.command)
        self.last_restart = time.time()

    def on_any_event(self, event):
        # Ignore directory events and temporary files
        if event.is_directory or event.src_path.endswith(('.tmp', '.swp', '~')):
            return
        
        # Only watch for relevant web/python files
        if event.src_path.endswith(('.html', '.js', '.css', '.py', '.json', 'VERSION')):
            current_time = time.time()
            if current_time - self.last_restart > self.debounce_seconds:
                self.start_server()

if __name__ == "__main__":
    # Configuration
    port = "8000"
    path = "."
    command = [sys.executable, "-m", "http.server", port]
    
    print(f"--- VEPA Development Server ---")
    print(f"Watching directory: {os.path.abspath(path)}")
    print(f"Serving on: http://localhost:{port}")
    print(f"Press Ctrl+C to stop.")
    print(f"-------------------------------")

    event_handler = RestartHandler(command)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[STOP] Stopping observer...")
        observer.stop()
        if event_handler.process:
            print("[STOP] Killing server process...")
            event_handler.process.terminate()
    
    observer.join()
    print("[EXIT] Server stopped.")
