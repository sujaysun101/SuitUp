@echo off
cd /d "C:\Users\sujay\resume-tailor-extension\backend"
"C:\Users\sujay\resume-tailor-extension\backend\venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
