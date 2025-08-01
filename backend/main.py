from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our custom modules
from services.resume_parser import ResumeParser
from services.job_analyzer import JobAnalyzer
from services.ai_service import AIService
from services.keyword_extractor import KeywordExtractor
from models.schemas import (
    JobPostingRequest,
    ResumeAnalysisResponse,
    TailoringSuggestionsResponse,
    KeywordExtractionResponse
)



from routes_job import router as job_router
from routes_google import router as google_router
from routes_llm import router as llm_router
from routes_docs import router as docs_router
from routes.onboarding import router as onboarding_router

app = FastAPI(
    title="Resume Tailor API",
    description="AI-powered resume tailoring and job analysis API",
    version="1.0.0"
)

# CORS middleware for Chrome extension and webapp
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "chrome-extension://*", 
        "moz-extension://*",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(job_router)
app.include_router(google_router)
app.include_router(llm_router)
app.include_router(docs_router)
app.include_router(onboarding_router)
# Initialize services
resume_parser = ResumeParser()
job_analyzer = JobAnalyzer()
ai_service = AIService()
keyword_extractor = KeywordExtractor()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Resume Tailor API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "resume_parser": "active",
            "job_analyzer": "active",
            "ai_service": "active",
            "keyword_extractor": "active"
        }
    }

@app.post("/api/parse-resume", response_model=Dict[str, Any])
async def parse_resume(file: UploadFile = File(...)):
    """Parse uploaded resume file (PDF, DOCX)"""
    try:
        if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
        # Read file content
        content = await file.read()
        
        # Parse resume
        parsed_data = await resume_parser.parse_resume(content, file.filename)
        
        return {
            "success": True,
            "data": parsed_data,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")

@app.post("/api/analyze-job", response_model=ResumeAnalysisResponse)
async def analyze_job_posting(request: JobPostingRequest):
    """Analyze job posting and extract key requirements"""
    try:
        analysis = await job_analyzer.analyze_job_posting(
            title=request.title,
            company=request.company,
            description=request.description,
            location=request.location
        )
        
        return ResumeAnalysisResponse(
            success=True,
            analysis=analysis
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job analysis failed: {str(e)}")

@app.post("/api/extract-keywords", response_model=KeywordExtractionResponse)
async def extract_keywords(request: JobPostingRequest):
    """Extract keywords and skills from job posting"""
    try:
        keywords = await keyword_extractor.extract_keywords(request.description)
        skills = await keyword_extractor.extract_skills(request.description)
        
        return KeywordExtractionResponse(
            success=True,
            keywords=keywords,
            skills=skills,
            job_title=request.title
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword extraction failed: {str(e)}")

@app.post("/api/tailor-resume", response_model=TailoringSuggestionsResponse)
async def tailor_resume(
    job_request: JobPostingRequest,
    resume_file: UploadFile = File(...)
):
    """Generate AI-powered resume tailoring suggestions"""
    try:
        # Parse resume
        resume_content = await file.read()
        parsed_resume = await resume_parser.parse_resume(resume_content, resume_file.filename)
        
        # Analyze job
        job_analysis = await job_analyzer.analyze_job_posting(
            title=job_request.title,
            company=job_request.company,
            description=job_request.description,
            location=job_request.location
        )
        
        # Generate AI suggestions
        suggestions = await ai_service.generate_tailoring_suggestions(
            resume_data=parsed_resume,
            job_analysis=job_analysis
        )
        
        return TailoringSuggestionsResponse(
            success=True,
            suggestions=suggestions,
            job_match_score=suggestions.get("match_score", 0),
            priority_changes=suggestions.get("priority_changes", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume tailoring failed: {str(e)}")

@app.post("/api/optimize-resume-text")
async def optimize_resume_text(request: Dict[str, Any]):
    """Optimize specific resume text sections using AI"""
    try:
        section_type = request.get("section_type")  # e.g., "summary", "experience", "skills"
        original_text = request.get("text")
        job_context = request.get("job_context", {})
        
        optimized_text = await ai_service.optimize_text_section(
            text=original_text,
            section_type=section_type,
            job_context=job_context
        )
        
        return {
            "success": True,
            "original_text": original_text,
            "optimized_text": optimized_text,
            "section_type": section_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text optimization failed: {str(e)}")

@app.get("/api/supported-formats")
async def get_supported_formats():
    """Get list of supported resume file formats"""
    return {
        "formats": [
            {"extension": "pdf", "description": "Portable Document Format"},
            {"extension": "docx", "description": "Microsoft Word Document"},
            {"extension": "doc", "description": "Microsoft Word Document (Legacy)"}
        ],
        "max_file_size": "10MB"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
