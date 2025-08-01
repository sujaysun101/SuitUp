import sys
import os

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Now import and run the main app
if __name__ == "__main__":
    from main import app
    import uvicorn
    
    print("Starting FastAPI server on http://localhost:8000")
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
