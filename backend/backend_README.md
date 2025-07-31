# Resume Tailor Backend

A FastAPI-based backend service for AI-powered resume tailoring and job analysis.

## Features

- 📄 **Resume Parsing**: Parse PDF and DOCX resumes using `pdfplumber` and `python-docx`
- 🤖 **AI Analysis**: OpenAI GPT-4 powered resume optimization and job matching
- 🔍 **Keyword Extraction**: spaCy-based NLP for skill and keyword extraction
- 📊 **Job Analysis**: Intelligent job posting analysis and requirements extraction
- 🎯 **ATS Optimization**: Applicant Tracking System friendly suggestions
- 🚀 **Fast API**: High-performance async REST API with automatic documentation

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Run the setup script** (recommended):
   ```bash
   python setup.py
   ```

2. **Manual setup** (alternative):
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Download spaCy model
   python -m spacy download en_core_web_sm
   ```

### Configuration

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your API keys:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here  # Optional
   ```

### Running the Server

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start the development server
python main.py
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Core Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /api/parse-resume` - Parse resume file
- `POST /api/analyze-job` - Analyze job posting
- `POST /api/extract-keywords` - Extract keywords from job
- `POST /api/tailor-resume` - Generate tailoring suggestions
- `POST /api/optimize-resume-text` - Optimize specific text sections

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── setup.py               # Setup script
├── .env.example           # Environment variables template
├── models/
│   ├── __init__.py
│   └── schemas.py         # Pydantic models
└── services/
    ├── __init__.py
    ├── resume_parser.py   # Resume parsing service
    ├── job_analyzer.py    # Job analysis service
    ├── ai_service.py      # AI/OpenAI integration
    └── keyword_extractor.py # NLP keyword extraction
```

## Services Overview

- **ResumeParser**: PDF/DOCX parsing and data extraction
- **JobAnalyzer**: Job posting analysis and classification  
- **AIService**: OpenAI integration for suggestions
- **KeywordExtractor**: NLP-based skill and keyword extraction

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
flake8 .
```

## License

MIT License
