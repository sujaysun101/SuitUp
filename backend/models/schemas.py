from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class JobPostingRequest(BaseModel):
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    description: str = Field(..., description="Job description text")
    location: Optional[str] = Field(None, description="Job location")
    url: Optional[str] = Field(None, description="Original job posting URL")
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)

class ResumeSection(BaseModel):
    type: str = Field(..., description="Section type (summary, experience, education, skills)")
    content: str = Field(..., description="Section content")
    suggestions: Optional[List[str]] = Field(default=[], description="Improvement suggestions")

class JobAnalysis(BaseModel):
    required_skills: List[str] = Field(default=[], description="Required technical skills")
    preferred_skills: List[str] = Field(default=[], description="Preferred/nice-to-have skills")
    experience_level: str = Field(..., description="Required experience level")
    key_responsibilities: List[str] = Field(default=[], description="Main job responsibilities")
    company_culture: Optional[str] = Field(None, description="Company culture keywords")
    industry: Optional[str] = Field(None, description="Industry classification")
    job_type: str = Field(default="full-time", description="Job type (full-time, contract, etc.)")

class ResumeAnalysisResponse(BaseModel):
    success: bool
    analysis: JobAnalysis
    processing_time: Optional[float] = None

class KeywordExtractionResponse(BaseModel):
    success: bool
    keywords: List[str] = Field(default=[], description="Extracted keywords")
    skills: List[str] = Field(default=[], description="Technical skills found")
    job_title: str
    confidence_scores: Optional[Dict[str, float]] = Field(default={})

class TailoringSuggestion(BaseModel):
    section: str = Field(..., description="Resume section to modify")
    type: str = Field(..., description="Type of change (add, modify, remove)")
    original_text: Optional[str] = Field(None, description="Original text")
    suggested_text: str = Field(..., description="Suggested replacement text")
    reason: str = Field(..., description="Explanation for the suggestion")
    priority: int = Field(..., description="Priority level (1-5, 5 being highest)")

class TailoringSuggestionsResponse(BaseModel):
    success: bool
    suggestions: List[TailoringSuggestion] = Field(default=[])
    job_match_score: float = Field(..., description="Overall job match percentage")
    priority_changes: List[TailoringSuggestion] = Field(default=[])
    ats_score: Optional[float] = Field(None, description="ATS friendliness score")
    missing_keywords: Optional[List[str]] = Field(default=[])

class ParsedResume(BaseModel):
    personal_info: Dict[str, Any] = Field(default={})
    summary: Optional[str] = None
    experience: List[Dict[str, Any]] = Field(default=[])
    education: List[Dict[str, Any]] = Field(default=[])
    skills: List[str] = Field(default=[])
    certifications: List[str] = Field(default=[])
    projects: List[Dict[str, Any]] = Field(default=[])
    raw_text: str = Field(..., description="Full extracted text")
    sections: List[ResumeSection] = Field(default=[])

class AIOptimizationRequest(BaseModel):
    text: str = Field(..., description="Text to optimize")
    section_type: str = Field(..., description="Type of section (summary, experience, etc.)")
    job_context: Dict[str, Any] = Field(default={}, description="Job posting context")
    tone: Optional[str] = Field("professional", description="Desired tone")

class AIOptimizationResponse(BaseModel):
    success: bool
    original_text: str
    optimized_text: str
    improvements: List[str] = Field(default=[], description="List of improvements made")
    keywords_added: List[str] = Field(default=[], description="Keywords incorporated")
