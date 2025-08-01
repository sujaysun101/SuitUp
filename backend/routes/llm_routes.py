from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import openai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/llm", tags=["LLM"])

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class JobAnalysisRequest(BaseModel):
    job_description: str
    job_title: str
    company: str
    job_url: Optional[str] = None

class ResumeAnalysisRequest(BaseModel):
    resume_content: str
    job_description: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    resume_content: Optional[str] = None
    job_description: Optional[str] = None

class DocumentEditRequest(BaseModel):
    document_id: str
    suggested_changes: List[Dict[str, Any]]
    user_approval: bool

@router.post("/analyze-job")
async def analyze_job(request: JobAnalysisRequest):
    """Analyze a job posting and extract key requirements"""
    try:
        prompt = f"""
        Analyze this job posting and extract key information:
        
        Job Title: {request.job_title}
        Company: {request.company}
        Job Description: {request.job_description}
        
        Please provide:
        1. Key skills and qualifications required
        2. Important keywords for ATS optimization
        3. Company culture and values mentioned
        4. Experience level required
        5. Technical requirements
        6. Soft skills emphasized
        
        Format the response as structured JSON with these categories.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert resume and job analysis assistant. Provide detailed, actionable insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        return {
            "status": "success", 
            "analysis": response.choices[0].message.content,
            "job_info": {
                "title": request.job_title,
                "company": request.company,
                "url": request.job_url
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job analysis failed: {str(e)}")

@router.post("/analyze-resume-match")
async def analyze_resume_match(request: ResumeAnalysisRequest):
    """Analyze how well a resume matches a job posting"""
    try:
        prompt = f"""
        Compare this resume against the job requirements and provide detailed feedback:
        
        JOB DESCRIPTION:
        {request.job_description}
        
        RESUME CONTENT:
        {request.resume_content}
        
        Please provide:
        1. Match percentage (0-100%)
        2. Strengths that align with the job
        3. Gaps or missing elements
        4. Specific suggestions for improvement
        5. Keywords to add for ATS optimization
        6. Sections that need enhancement
        7. Recommended changes with specific text suggestions
        
        Format as structured JSON with actionable recommendations.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert resume coach and ATS optimization specialist. Provide specific, actionable feedback."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return {
            "status": "success",
            "analysis": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

@router.post("/chat")
async def chat_with_llm(request: ChatRequest):
    """Interactive chat for resume tailoring assistance"""
    try:
        # Build context for the conversation
        context_parts = []
        
        if request.job_description:
            context_parts.append(f"JOB DESCRIPTION:\n{request.job_description}")
        
        if request.resume_content:
            context_parts.append(f"CURRENT RESUME:\n{request.resume_content}")
        
        if request.context:
            context_parts.append(f"PREVIOUS CONTEXT:\n{request.context}")
        
        context_str = "\n\n".join(context_parts)
        
        system_prompt = """You are an expert resume coach and career advisor. You help users tailor their resumes for specific job applications. 

Guidelines:
- Provide specific, actionable advice
- Suggest exact text improvements when possible
- Focus on ATS optimization and keyword matching
- Help with formatting and structure
- Be encouraging but honest about areas for improvement
- When making edit suggestions, be very specific about what to change and where"""
        
        user_prompt = f"""
        {context_str}
        
        USER QUESTION: {request.message}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        return {
            "status": "success",
            "response": response.choices[0].message.content,
            "usage": response.usage.total_tokens
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/suggest-edits")
async def suggest_document_edits(request: ResumeAnalysisRequest):
    """Generate specific edit suggestions for a resume based on job requirements"""
    try:
        prompt = f"""
        Based on this job posting, provide specific edit suggestions for the resume:
        
        JOB POSTING:
        {request.job_description}
        
        CURRENT RESUME:
        {request.resume_content}
        
        Provide specific, actionable edit suggestions in this JSON format:
        {{
            "edits": [
                {{
                    "section": "Professional Summary",
                    "action": "replace",
                    "current_text": "exact text to replace",
                    "suggested_text": "new improved text",
                    "reason": "why this change helps"
                }},
                {{
                    "section": "Skills",
                    "action": "add",
                    "suggested_text": "new skill to add",
                    "reason": "matches job requirement"
                }}
            ]
        }}
        
        Focus on:
        - Adding missing keywords
        - Improving achievement statements
        - Quantifying results where possible
        - Aligning language with job posting
        - Optimizing for ATS
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert resume editor. Provide specific, implementable edit suggestions in the exact JSON format requested."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return {
            "status": "success",
            "suggestions": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Edit suggestions failed: {str(e)}")
