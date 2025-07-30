"""
Shared utilities for Resume Tailor
Contains common functions used by both backend and extension
"""

import re
from typing import List, Dict, Any, Optional
from datetime import datetime

class TextProcessor:
    """Common text processing utilities"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere with parsing
        text = re.sub(r'[^\w\s\-\.\,\(\)]', '', text)
        
        return text.strip()
    
    @staticmethod
    def extract_email(text: str) -> Optional[str]:
        """Extract email from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group() if match else None
    
    @staticmethod
    def extract_phone(text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b'
        ]
        
        for pattern in phone_patterns:
            match = re.search(pattern, text)
            if match:
                return ''.join(match.groups()) if match.groups() else match.group()
        
        return None
    
    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """Extract URLs from text"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return re.findall(url_pattern, text)

class SkillsMatcher:
    """Utilities for matching and categorizing skills"""
    
    # Comprehensive skills database
    SKILL_CATEGORIES = {
        'programming_languages': [
            'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'typescript', 'go', 'rust', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
            'powershell', 'sql', 'html', 'css', 'dart', 'julia', 'groovy', 'lua'
        ],
        'web_frameworks': [
            'react', 'angular', 'vue', 'svelte', 'ember', 'backbone', 'jquery',
            'express', 'fastify', 'koa', 'django', 'flask', 'fastapi', 'spring',
            'asp.net', 'laravel', 'symfony', 'rails', 'sinatra'
        ],
        'databases': [
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle',
            'sql server', 'sqlite', 'cassandra', 'dynamodb', 'firestore', 'couchdb',
            'neo4j', 'influxdb', 'mariadb'
        ],
        'cloud_platforms': [
            'aws', 'azure', 'google cloud', 'gcp', 'heroku', 'digitalocean',
            'linode', 'vultr', 'cloudflare', 'netlify', 'vercel'
        ],
        'devops_tools': [
            'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab ci',
            'github actions', 'circleci', 'travis ci', 'helm', 'vagrant', 'packer'
        ],
        'data_science': [
            'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
            'jupyter', 'tableau', 'power bi', 'matplotlib', 'seaborn', 'plotly',
            'apache spark', 'hadoop', 'kafka'
        ],
        'mobile_development': [
            'react native', 'flutter', 'ionic', 'xamarin', 'cordova', 'phonegap',
            'android studio', 'xcode', 'swift ui', 'kotlin multiplatform'
        ],
        'design_tools': [
            'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'indesign',
            'canva', 'invision', 'zeplin', 'principle'
        ],
        'project_management': [
            'jira', 'confluence', 'trello', 'asana', 'monday', 'notion', 'slack',
            'microsoft teams', 'basecamp', 'clickup'
        ],
        'testing_tools': [
            'jest', 'mocha', 'chai', 'pytest', 'junit', 'selenium', 'cypress',
            'playwright', 'postman', 'insomnia', 'soap ui'
        ]
    }
    
    @classmethod
    def categorize_skill(cls, skill: str) -> Optional[str]:
        """Categorize a skill into its appropriate category"""
        skill_lower = skill.lower().strip()
        
        for category, skills in cls.SKILL_CATEGORIES.items():
            if skill_lower in skills:
                return category
        
        return None
    
    @classmethod
    def find_related_skills(cls, skill: str, limit: int = 5) -> List[str]:
        """Find related skills in the same category"""
        category = cls.categorize_skill(skill)
        if not category:
            return []
        
        related = cls.SKILL_CATEGORIES[category].copy()
        skill_lower = skill.lower().strip()
        
        # Remove the original skill
        if skill_lower in related:
            related.remove(skill_lower)
        
        return related[:limit]
    
    @classmethod
    def calculate_skill_match_score(cls, resume_skills: List[str], job_skills: List[str]) -> float:
        """Calculate skill match percentage"""
        if not job_skills:
            return 100.0
        
        resume_skills_lower = [skill.lower().strip() for skill in resume_skills]
        job_skills_lower = [skill.lower().strip() for skill in job_skills]
        
        matches = len(set(resume_skills_lower) & set(job_skills_lower))
        return (matches / len(job_skills_lower)) * 100

class ResumeFormatter:
    """Utilities for formatting resume content"""
    
    @staticmethod
    def format_experience_entry(
        title: str,
        company: str,
        duration: str,
        description: str,
        achievements: List[str] = None
    ) -> Dict[str, Any]:
        """Format an experience entry"""
        return {
            "title": title.strip(),
            "company": company.strip(),
            "duration": duration.strip(),
            "description": description.strip(),
            "achievements": achievements or [],
            "formatted_text": f"{title} at {company} ({duration})"
        }
    
    @staticmethod
    def format_education_entry(
        degree: str,
        institution: str,
        year: str,
        gpa: str = None
    ) -> Dict[str, Any]:
        """Format an education entry"""
        entry = {
            "degree": degree.strip(),
            "institution": institution.strip(),
            "year": year.strip(),
            "formatted_text": f"{degree} from {institution} ({year})"
        }
        
        if gpa:
            entry["gpa"] = gpa.strip()
            entry["formatted_text"] += f" - GPA: {gpa}"
        
        return entry
    
    @staticmethod
    def optimize_bullet_points(bullet_points: List[str]) -> List[str]:
        """Optimize bullet points for ATS and readability"""
        optimized = []
        
        action_verbs = [
            'achieved', 'implemented', 'developed', 'created', 'managed', 'led',
            'improved', 'increased', 'reduced', 'streamlined', 'optimized',
            'collaborated', 'designed', 'analyzed', 'executed', 'delivered'
        ]
        
        for point in bullet_points:
            point = point.strip()
            if not point:
                continue
            
            # Ensure bullet point starts with action verb
            first_word = point.split()[0].lower()
            if first_word not in action_verbs:
                # Try to find a suitable action verb based on context
                if 'built' in point.lower() or 'created' in point.lower():
                    point = f"Developed {point.lower()}"
                elif 'worked' in point.lower():
                    point = f"Collaborated {point.lower().replace('worked', '')}"
                else:
                    point = f"Executed {point.lower()}"
            
            # Capitalize first letter
            point = point[0].upper() + point[1:] if len(point) > 1 else point.upper()
            
            optimized.append(point)
        
        return optimized

class KeywordAnalyzer:
    """Utilities for keyword analysis and optimization"""
    
    # Common industry keywords
    INDUSTRY_KEYWORDS = {
        'technology': [
            'software development', 'agile', 'scrum', 'devops', 'ci/cd', 'api',
            'microservices', 'cloud computing', 'machine learning', 'artificial intelligence'
        ],
        'finance': [
            'financial analysis', 'risk management', 'compliance', 'trading',
            'portfolio management', 'financial modeling', 'regulations'
        ],
        'marketing': [
            'digital marketing', 'seo', 'sem', 'content marketing', 'social media',
            'brand management', 'campaign management', 'analytics'
        ],
        'sales': [
            'lead generation', 'relationship building', 'negotiation', 'crm',
            'sales funnel', 'revenue growth', 'client acquisition'
        ]
    }
    
    @classmethod
    def extract_action_verbs(cls, text: str) -> List[str]:
        """Extract action verbs from text"""
        action_verbs = [
            'achieved', 'implemented', 'developed', 'created', 'managed', 'led',
            'improved', 'increased', 'reduced', 'streamlined', 'optimized',
            'collaborated', 'designed', 'analyzed', 'executed', 'delivered',
            'built', 'established', 'coordinated', 'supervised', 'trained'
        ]
        
        found_verbs = []
        text_lower = text.lower()
        
        for verb in action_verbs:
            if verb in text_lower:
                found_verbs.append(verb)
        
        return list(set(found_verbs))
    
    @classmethod
    def suggest_keywords_for_industry(cls, industry: str) -> List[str]:
        """Suggest relevant keywords for an industry"""
        return cls.INDUSTRY_KEYWORDS.get(industry.lower(), [])
    
    @classmethod
    def calculate_keyword_density(cls, text: str, keywords: List[str]) -> Dict[str, float]:
        """Calculate keyword density in text"""
        text_lower = text.lower()
        word_count = len(text_lower.split())
        
        densities = {}
        for keyword in keywords:
            keyword_lower = keyword.lower()
            count = text_lower.count(keyword_lower)
            density = (count / word_count) * 100 if word_count > 0 else 0
            densities[keyword] = density
        
        return densities

class DateTimeUtils:
    """Date and time utilities"""
    
    @staticmethod
    def format_timestamp(timestamp: float = None) -> str:
        """Format timestamp for display"""
        if timestamp is None:
            timestamp = datetime.now().timestamp()
        
        dt = datetime.fromtimestamp(timestamp)
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    
    @staticmethod
    def parse_date_range(date_str: str) -> Dict[str, Optional[str]]:
        """Parse date range from text (e.g., 'Jan 2020 - Present')"""
        # Common date patterns
        patterns = [
            r'(\w+\s+\d{4})\s*-\s*(\w+\s+\d{4})',
            r'(\d{4})\s*-\s*(\d{4})',
            r'(\w+\s+\d{4})\s*-\s*(present|current)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, date_str, re.IGNORECASE)
            if match:
                start_date = match.group(1)
                end_date = match.group(2) if match.group(2).lower() not in ['present', 'current'] else 'Present'
                return {"start": start_date, "end": end_date}
        
        return {"start": None, "end": None}

# Export main classes
__all__ = [
    'TextProcessor',
    'SkillsMatcher', 
    'ResumeFormatter',
    'KeywordAnalyzer',
    'DateTimeUtils'
]
