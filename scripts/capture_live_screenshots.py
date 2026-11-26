import subprocess
import time
import os
import signal
import urllib.request

def wait_for_server(url, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                if response.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(0.5)
    return False

def capture_all():
    print("Starting Next.js production server on port 3000...")
    env = os.environ.copy()
    env["PORT"] = "3000"
    
    server_process = subprocess.Popen(
        ["npm", "run", "start", "--", "-p", "3000"],
        cwd=r"D:\SkillProject",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=True
    )
    
    try:
        print("Waiting for server to become ready...")
        if not wait_for_server("http://127.0.0.1:3000"):
            print("ERROR: Server failed to start within timeout.")
            return False
            
        print("Server is ready at http://127.0.0.1:3000!")
        
        chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        user_data_dir = r"C:\Users\Lenovo\AppData\Local\Temp\chrome_capture_tmp"
        os.makedirs(user_data_dir, exist_ok=True)
        
        pages = [
            ("01_dashboard_overview.png", "http://127.0.0.1:3000/dashboard"),
            ("02_document_repository.png", "http://127.0.0.1:3000/documents"),
            ("03_document_studio_extraction.png", "http://127.0.0.1:3000/documents/doc-inv-1024"),
            ("04_workflow_dag_canvas.png", "http://127.0.0.1:3000/workflows"),
            ("05_approval_management.png", "http://127.0.0.1:3000/approvals"),
            ("06_payment_disbursement.png", "http://127.0.0.1:3000/payments"),
            ("07_rag_ai_assistant.png", "http://127.0.0.1:3000/assistant"),
            ("08_analytics_telemetry.png", "http://127.0.0.1:3000/analytics"),
            ("09_twocolumn_spatial_ocr.png", "http://127.0.0.1:3000/audit-logs"),
        ]
        
        out_dir = r"D:\SkillProject\report_assets"
        os.makedirs(out_dir, exist_ok=True)
        
        # Give React hydration 2 seconds
        time.sleep(2)
        
        for filename, url in pages:
            out_path = os.path.join(out_dir, filename)
            cmd = [
                chrome,
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                f"--user-data-dir={user_data_dir}",
                f"--screenshot={out_path}",
                "--window-size=1280,800",
                "--hide-scrollbars",
                url
            ]
            print(f"Capturing {filename} from {url}...")
            res = subprocess.run(cmd, capture_output=True, text=True)
            if os.path.exists(out_path):
                print(f"  -> SUCCESS: {filename} ({os.path.getsize(out_path):,} bytes)")
            else:
                print(f"  -> FAILED: {filename} (code {res.returncode})")
                
        print("All screenshots captured successfully!")
        return True
    finally:
        print("Stopping Next.js server...")
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_process.pid)], capture_output=True)
        # also kill any stray node processes on port 3000
        subprocess.run("Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force", shell=True)

if __name__ == "__main__":
    capture_all()
