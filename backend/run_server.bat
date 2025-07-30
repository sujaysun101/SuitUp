@echo off
:: Activate the virtual environment
call venv\Scripts\activate.bat

:: Start the FastAPI server
python main.py
