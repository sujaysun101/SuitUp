from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Resume Tailor API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI setup
openai.api_key = os.getenv("OPENAI_API_KEY")

class JobAnalysisRequest(BaseModel):
    jobData: Dict[str, Any]
    currentJob: Optional[Dict[str, Any]] = None

class ChatMessage(BaseModel):
    message: str
    jobAnalysis: Optional[Dict[str, Any]] = None
    resumeContent: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Resume Tailor API is running"}

@app.post("/api/mark-onboarding-complete")
async def mark_onboarding_complete():
    return {"status": "success", "message": "Onboarding marked as complete"}

@app.post("/api/analyze-job")
async def analyze_job(request: JobAnalysisRequest):
    try:
        job_data = request.jobData
        
        # Create prompt for job analysis
        prompt = f"""
        Analyze this job posting and extract key information for resume tailoring:
        
        Job Title: {job_data.get('title', 'Not specified')}
        Company: {job_data.get('company', 'Not specified')}
        Description: {job_data.get('description', job_data.get('fullContent', 'Not specified'))}
        
        Please provide:
        1. Key skills and requirements
        2. Important keywords to include in resume
        3. Company culture insights
        4. Specific requirements to highlight
        5. Technical skills mentioned
        6. Soft skills mentioned
        
        Format as JSON with clear sections.
        """
        
        if openai.api_key:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional resume advisor that analyzes job postings."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            analysis_result = response.choices[0].message.content
        else:
            # Fallback analysis without OpenAI
            analysis_result = {
                "keySkills": ["Extracted from job description"],
                "keywords": ["Based on job posting"],
                "companyCulture": "Analysis based on job posting",
                "requirements": ["Key requirements identified"],
                "technicalSkills": ["Technical skills found"],
                "softSkills": ["Soft skills mentioned"]
            }
        
        return {
            "status": "success",
            "analysis": analysis_result,
            "jobData": job_data,
            "timestamp": int(os.times().elapsed * 1000)
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/chat-llm")
async def chat_with_llm(request: ChatMessage):
    try:
        prompt = f"""
        User message: {request.message}
        
        Context:
        - Job Analysis: {request.jobAnalysis or 'Not provided'}
        - Resume Content: {request.resumeContent or 'Not provided'}
        
        Please provide helpful advice for tailoring the resume to match the job requirements.
        Be specific and actionable.
        """
        
        if openai.api_key:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional resume advisor helping users tailor their resumes for specific jobs."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
        else:
            ai_response = "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables."
        
        return {
            "status": "success", 
            "response": ai_response,
            "timestamp": int(os.times().elapsed * 1000)
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "simple_server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
