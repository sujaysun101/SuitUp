"""
Shared models and data structures for Resume Tailor
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class ExperienceLevel(Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    EXECUTIVE = "executive"

class JobType(Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    TEMPORARY = "temporary"

class SuggestionType(Enum):
    ADD = "add"
    MODIFY = "modify"
    REMOVE = "remove"

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4
    URGENT = 5

@dataclass
class PersonalInfo:
    """Personal contact information"""
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    address: str = ""

@dataclass
class ExperienceEntry:
    """Work experience entry"""
    title: str
    company: str
    duration: str
    description: str
    achievements: List[str] = field(default_factory=list)
    technologies: List[str] = field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False

@dataclass
class EducationEntry:
    """Education entry"""
    degree: str
    institution: str
    year: str
    field: str = ""
    gpa: str = ""
    honors: List[str] = field(default_factory=list)

@dataclass
class ProjectEntry:
    """Project entry"""
    name: str
    description: str
    technologies: List[str] = field(default_factory=list)
    url: str = ""
    duration: str = ""
    achievements: List[str] = field(default_factory=list)

@dataclass
class ResumeData:
    """Complete resume data structure"""
    personal_info: PersonalInfo = field(default_factory=PersonalInfo)
    summary: str = ""
    experience: List[ExperienceEntry] = field(default_factory=list)
    education: List[EducationEntry] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    certifications: List[str] = field(default_factory=list)
    projects: List[ProjectEntry] = field(default_factory=list)
    languages: List[str] = field(default_factory=list)
    raw_text: str = ""
    file_name: str = ""
    last_updated: datetime = field(default_factory=datetime.now)

@dataclass
class JobPosting:
    """Job posting data structure"""
    title: str
    company: str
    description: str
    location: str = ""
    url: str = ""
    job_type: JobType = JobType.FULL_TIME
    experience_level: ExperienceLevel = ExperienceLevel.MID
    salary_range: str = ""
    posted_date: Optional[datetime] = None
    expires_date: Optional[datetime] = None
    remote_friendly: bool = False
    required_skills: List[str] = field(default_factory=list)
    preferred_skills: List[str] = field(default_factory=list)
    benefits: List[str] = field(default_factory=list)
    industry: str = ""
    company_size: str = ""

@dataclass
class TailoringSuggestion:
    """Individual tailoring suggestion"""
    section: str
    suggestion_type: SuggestionType
    original_text: str = ""
    suggested_text: str = ""
    reason: str = ""
    priority: Priority = Priority.MEDIUM
    keywords_added: List[str] = field(default_factory=list)
    confidence_score: float = 0.0

@dataclass
class MatchAnalysis:
    """Job match analysis results"""
    overall_score: float
    skills_match: float
    keywords_match: float
    experience_match: float
    industry_match: float
    missing_skills: List[str] = field(default_factory=list)
    missing_keywords: List[str] = field(default_factory=list)
    strengths: List[str] = field(default_factory=list)
    weaknesses: List[str] = field(default_factory=list)

@dataclass
class TailoringResults:
    """Complete tailoring analysis results"""
    job_posting: JobPosting
    resume_data: ResumeData
    match_analysis: MatchAnalysis
    suggestions: List[TailoringSuggestion] = field(default_factory=list)
    ats_score: float = 0.0
    generated_at: datetime = field(default_factory=datetime.now)
    processing_time: float = 0.0

@dataclass
class UserPreferences:
    """User preferences and settings"""
    preferred_ai_provider: str = "openai"  # "openai" or "anthropic"
    ai_creativity_level: float = 0.3  # 0.0 to 1.0
    auto_analyze_jobs: bool = True
    save_job_history: bool = True
    preferred_industries: List[str] = field(default_factory=list)
    excluded_keywords: List[str] = field(default_factory=list)
    dark_mode: bool = True
    notification_preferences: Dict[str, bool] = field(default_factory=dict)

@dataclass
class APIResponse:
    """Standard API response structure"""
    success: bool
    data: Any = None
    error: str = ""
    message: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    processing_time: float = 0.0

# Utility functions for data conversion
def dict_to_resume_data(data: Dict[str, Any]) -> ResumeData:
    """Convert dictionary to ResumeData object"""
    personal_info = PersonalInfo(**data.get('personal_info', {}))
    
    experience = [
        ExperienceEntry(**exp) for exp in data.get('experience', [])
    ]
    
    education = [
        EducationEntry(**edu) for edu in data.get('education', [])
    ]
    
    projects = [
        ProjectEntry(**proj) for proj in data.get('projects', [])
    ]
    
    return ResumeData(
        personal_info=personal_info,
        summary=data.get('summary', ''),
        experience=experience,
        education=education,
        skills=data.get('skills', []),
        certifications=data.get('certifications', []),
        projects=projects,
        languages=data.get('languages', []),
        raw_text=data.get('raw_text', ''),
        file_name=data.get('file_name', '')
    )

def resume_data_to_dict(resume: ResumeData) -> Dict[str, Any]:
    """Convert ResumeData object to dictionary"""
    return {
        'personal_info': {
            'name': resume.personal_info.name,
            'email': resume.personal_info.email,
            'phone': resume.personal_info.phone,
            'linkedin': resume.personal_info.linkedin,
            'github': resume.personal_info.github,
            'portfolio': resume.personal_info.portfolio,
            'address': resume.personal_info.address
        },
        'summary': resume.summary,
        'experience': [
            {
                'title': exp.title,
                'company': exp.company,
                'duration': exp.duration,
                'description': exp.description,
                'achievements': exp.achievements,
                'technologies': exp.technologies,
                'start_date': exp.start_date,
                'end_date': exp.end_date,
                'is_current': exp.is_current
            }
            for exp in resume.experience
        ],
        'education': [
            {
                'degree': edu.degree,
                'institution': edu.institution,
                'year': edu.year,
                'field': edu.field,
                'gpa': edu.gpa,
                'honors': edu.honors
            }
            for edu in resume.education
        ],
        'skills': resume.skills,
        'certifications': resume.certifications,
        'projects': [
            {
                'name': proj.name,
                'description': proj.description,
                'technologies': proj.technologies,
                'url': proj.url,
                'duration': proj.duration,
                'achievements': proj.achievements
            }
            for proj in resume.projects
        ],
        'languages': resume.languages,
        'raw_text': resume.raw_text,
        'file_name': resume.file_name,
        'last_updated': resume.last_updated.isoformat()
    }
