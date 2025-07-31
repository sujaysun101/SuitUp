from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Any

router = APIRouter()

class AnalyzeRequest(BaseModel):
    job_id: str
    doc_id: str

@router.post("/api/llm/analyze")
async def analyze_resume(data: AnalyzeRequest):
    # Call OpenAI API and return analysis
    return {"analysis": {"score": 90, "suggestions": ["Add more keywords"]}}

class ChatRequest(BaseModel):
    message: str
    context: Any

@router.post("/api/llm/chat")
async def chat_with_llm(data: ChatRequest):
    # Call OpenAI API and return chat response
    return {"response": "Here's how you can improve your resume..."}
