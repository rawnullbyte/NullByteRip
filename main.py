import http.server
import socketserver
import threading
import json
from pathlib import Path
from fastapi import FastAPI, Response, Request
from fastapi.responses import HTMLResponse, FileResponse

# Constants
HOST = "0.0.0.0"
PORT = 443
COUNT_FILE = "count.json"

# FastAPI instance
app = FastAPI()

# Load count and IPs from file
def load_count():
    if Path(COUNT_FILE).exists():
        with open(COUNT_FILE, "r") as f:
            data = json.load(f)
            return data.get("count", 0), set(data.get("ips", []))
    return 0, set()

# Save count and IPs to file
def save_count(count, ips):
    with open(COUNT_FILE, "w") as f:
        json.dump({"count": count, "ips": list(ips)}, f)

# Initialize count and IPs set
count, viewed_ips = load_count()

# API Endpoint to return request count
@app.get("/api/views")
def get_count(request: Request):
    global count, viewed_ips
    client_ip = request.client.host
    if client_ip not in viewed_ips:
        count += 1
        viewed_ips.add(client_ip)
        save_count(count, viewed_ips)
    return {"total_requests": count}

@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/home")
def read_root():
    return FileResponse("home.html")

# Serve other static files
@app.get("/{file_path:path}")
def read_file(file_path: str):
    if Path(file_path).exists():
        return FileResponse(file_path)
    return Response(status_code=404)

# Start FastAPI
if __name__ == "__main__":
    import uvicorn
    print(f"Starting server on http://{HOST}:{PORT}")
    uvicorn.run(app, host=HOST, port=PORT)