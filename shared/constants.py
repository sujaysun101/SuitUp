"""
Constants used across the Resume Tailor application
"""

# API Configuration
API_BASE_URL = "http://localhost:8000"
API_VERSION = "v1"

# File Upload Limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_FILE_TYPES = ['.pdf', '.docx', '.doc']

# Resume Section Types
RESUME_SECTIONS = {
    'PERSONAL_INFO': 'personal_info',
    'SUMMARY': 'summary',
    'EXPERIENCE': 'experience',
    'EDUCATION': 'education',
    'SKILLS': 'skills',
    'CERTIFICATIONS': 'certifications',
    'PROJECTS': 'projects'
}

# Job Analysis Categories
JOB_CATEGORIES = {
    'TECHNOLOGY': 'technology',
    'FINANCE': 'finance',
    'HEALTHCARE': 'healthcare',
    'CONSULTING': 'consulting',
    'RETAIL': 'retail',
    'EDUCATION': 'education',
    'MARKETING': 'marketing',
    'SALES': 'sales',
    'OTHER': 'other'
}

# Experience Levels
EXPERIENCE_LEVELS = {
    'ENTRY': 'entry',
    'MID': 'mid',
    'SENIOR': 'senior',
    'EXECUTIVE': 'executive'
}

# Priority Levels for Suggestions
PRIORITY_LEVELS = {
    'LOW': 1,
    'MEDIUM': 2,
    'HIGH': 3,
    'CRITICAL': 4,
    'URGENT': 5
}

# Common Job Sites
SUPPORTED_JOB_SITES = [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'careerbuilder.com',
    'dice.com',
    'stackoverflow.com/jobs',
    'github.com/jobs',
    'angel.co',
    'wellfound.com'
]

# Chrome Extension Configuration
EXTENSION_CONFIG = {
    'POPUP_WIDTH': 400,
    'POPUP_HEIGHT': 600,
    'CONTENT_SCRIPT_DELAY': 1000,  # ms
    'API_TIMEOUT': 30000,  # ms
    'STORAGE_KEYS': {
        'SAVED_RESUMES': 'savedResumes',
        'USER_PREFERENCES': 'userPreferences',
        'JOB_HISTORY': 'jobHistory',
        'API_KEY': 'apiKey'
    }
}

# AI Service Configuration
AI_CONFIG = {
    'OPENAI_MODEL': 'gpt-4-turbo-preview',
    'MAX_TOKENS': 2000,
    'TEMPERATURE': 0.3,
    'ANTHROPIC_MODEL': 'claude-3-sonnet-20240229'
}

# Scoring Weights
MATCH_SCORE_WEIGHTS = {
    'SKILLS': 0.4,      # 40%
    'KEYWORDS': 0.3,    # 30%
    'EXPERIENCE': 0.2,  # 20%
    'INDUSTRY': 0.1     # 10%
}

# Common Skills Database
SKILL_SYNONYMS = {
    'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
    'typescript': ['ts'],
    'python': ['py'],
    'react': ['reactjs', 'react.js'],
    'angular': ['angularjs', 'angular.js'],
    'vue': ['vuejs', 'vue.js'],
    'node.js': ['nodejs', 'node'],
    'postgresql': ['postgres', 'pg'],
    'mongodb': ['mongo'],
    'aws': ['amazon web services'],
    'gcp': ['google cloud platform', 'google cloud'],
    'machine learning': ['ml', 'artificial intelligence', 'ai'],
    'continuous integration': ['ci', 'ci/cd'],
    'user experience': ['ux', 'user interface', 'ui'],
    'search engine optimization': ['seo'],
    'customer relationship management': ['crm']
}

# ATS Optimization Keywords
ATS_FRIENDLY_TERMS = [
    # Technical skills
    'programming', 'development', 'software', 'application', 'system',
    'database', 'server', 'network', 'security', 'testing', 'debugging',
    
    # Soft skills
    'leadership', 'communication', 'collaboration', 'problem-solving',
    'analytical', 'creative', 'organized', 'detail-oriented', 'adaptable',
    
    # Business terms
    'project management', 'team leadership', 'client relations', 'process improvement',
    'cost reduction', 'revenue growth', 'efficiency', 'optimization',
    
    # Action verbs
    'achieved', 'implemented', 'developed', 'created', 'managed', 'led',
    'improved', 'increased', 'reduced', 'streamlined', 'optimized'
]

# Error Messages
ERROR_MESSAGES = {
    'FILE_TOO_LARGE': f'File size exceeds {MAX_FILE_SIZE // (1024*1024)}MB limit',
    'INVALID_FILE_TYPE': f'Only {", ".join(ALLOWED_FILE_TYPES)} files are supported',
    'PARSING_FAILED': 'Failed to parse resume file',
    'API_UNAVAILABLE': 'AI service is currently unavailable',
    'NETWORK_ERROR': 'Network connection error',
    'INVALID_JOB_URL': 'Invalid or unsupported job posting URL'
}

# Success Messages
SUCCESS_MESSAGES = {
    'RESUME_PARSED': 'Resume parsed successfully',
    'JOB_ANALYZED': 'Job posting analyzed successfully',
    'SUGGESTIONS_GENERATED': 'Tailoring suggestions generated',
    'RESUME_SAVED': 'Resume saved to history'
}
