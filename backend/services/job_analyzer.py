from typing import Dict, Any, List
import re
import logging
from services.keyword_extractor import KeywordExtractor

logger = logging.getLogger(__name__)

class JobAnalyzer:
    """Service for analyzing job postings and extracting structured information"""
    
    def __init__(self):
        self.keyword_extractor = KeywordExtractor()
        
        # Industry classification keywords
        self.industry_keywords = {
            'technology': [
                'software', 'tech', 'it', 'computer', 'digital', 'startup',
                'saas', 'platform', 'development', 'engineering'
            ],
            'finance': [
                'bank', 'financial', 'investment', 'trading', 'fintech',
                'insurance', 'credit', 'loans', 'payments'
            ],
            'healthcare': [
                'health', 'medical', 'hospital', 'pharmaceutical', 'biotech',
                'clinical', 'patient', 'healthcare'
            ],
            'consulting': [
                'consulting', 'advisory', 'strategy', 'transformation',
                'implementation', 'analysis'
            ],
            'retail': [
                'retail', 'ecommerce', 'shopping', 'consumer', 'brand',
                'merchandise', 'sales'
            ],
            'education': [
                'education', 'university', 'school', 'learning', 'academic',
                'training', 'curriculum'
            ]
        }
    
    async def analyze_job_posting(
        self, 
        title: str, 
        company: str, 
        description: str, 
        location: str = None
    ) -> Dict[str, Any]:
        """Analyze a job posting and extract structured information"""
        try:
            analysis = {
                'job_title': title,
                'company': company,
                'location': location,
                'industry': await self._classify_industry(description, company),
                'experience_level': await self.keyword_extractor.extract_experience_level(description),
                'job_type': self._extract_job_type(description),
                'remote_friendly': self._check_remote_options(description),
                'required_skills': await self.keyword_extractor.extract_skills(description),
                'keywords': await self.keyword_extractor.extract_keywords(description),
                'requirements': await self.keyword_extractor.extract_job_requirements(description),
                'company_size': self._estimate_company_size(description),
                'salary_info': self._extract_salary_info(description),
                'benefits': self._extract_benefits(description)
            }
            
            # Add job match factors
            analysis['match_factors'] = self._identify_match_factors(analysis)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing job posting: {str(e)}")
            raise
    
    async def _classify_industry(self, description: str, company: str) -> str:
        """Classify the industry based on job description and company"""
        text = (description + " " + company).lower()
        
        industry_scores = {}
        for industry, keywords in self.industry_keywords.items():
            score = 0
            for keyword in keywords:
                score += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text))
            industry_scores[industry] = score
        
        # Return industry with highest score, or 'other' if no clear match
        if max(industry_scores.values()) > 0:
            return max(industry_scores.items(), key=lambda x: x[1])[0]
        return 'other'
    
    def _extract_job_type(self, description: str) -> str:
        """Extract job type (full-time, part-time, contract, etc.)"""
        text = description.lower()
        
        type_patterns = {
            'full-time': [r'full.?time', r'permanent', r'salary'],
            'part-time': [r'part.?time'],
            'contract': [r'contract', r'contractor', r'freelance', r'consulting'],
            'internship': [r'intern', r'internship', r'co.?op'],
            'temporary': [r'temporary', r'temp', r'seasonal']
        }
        
        for job_type, patterns in type_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return job_type
        
        return 'full-time'  # Default assumption
    
    def _check_remote_options(self, description: str) -> Dict[str, bool]:
        """Check for remote work options"""
        text = description.lower()
        
        remote_patterns = [
            r'remote', r'work from home', r'wfh', r'distributed team',
            r'anywhere', r'location independent'
        ]
        
        hybrid_patterns = [
            r'hybrid', r'flexible', r'some remote', r'occasionally remote'
        ]
        
        onsite_patterns = [
            r'on.?site', r'in.?office', r'no remote', r'must be local'
        ]
        
        return {
            'fully_remote': any(re.search(pattern, text) for pattern in remote_patterns),
            'hybrid': any(re.search(pattern, text) for pattern in hybrid_patterns),
            'onsite_only': any(re.search(pattern, text) for pattern in onsite_patterns)
        }
    
    def _estimate_company_size(self, description: str) -> str:
        """Estimate company size based on description"""
        text = description.lower()
        
        size_indicators = {
            'startup': [
                r'startup', r'early stage', r'seed', r'series [a-c]',
                r'small team', r'growing team'
            ],
            'small': [
                r'small company', r'boutique', r'family.owned',
                r'under \d+ employees'
            ],
            'medium': [
                r'mid.size', r'growing company', r'established',
                r'regional'
            ],
            'large': [
                r'fortune \d+', r'global', r'international',
                r'enterprise', r'multinational', r'thousands of employees'
            ]
        }
        
        for size, patterns in size_indicators.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return size
        
        return 'unknown'
    
    def _extract_salary_info(self, description: str) -> Dict[str, Any]:
        """Extract salary information if mentioned"""
        salary_info = {
            'mentioned': False,
            'range': None,
            'currency': None,
            'period': None
        }
        
        # Common salary patterns
        salary_patterns = [
            r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:-|to)\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            r'(\d{1,3}(?:,\d{3})*)\s*(?:-|to)\s*(\d{1,3}(?:,\d{3})*)\s*(?:USD|dollars?)',
        ]
        
        for pattern in salary_patterns:
            match = re.search(pattern, description, re.IGNORECASE)
            if match:
                salary_info['mentioned'] = True
                # Extract more details based on context
                break
        
        return salary_info
    
    def _extract_benefits(self, description: str) -> List[str]:
        """Extract mentioned benefits and perks"""
        benefits = []
        text = description.lower()
        
        benefit_keywords = [
            'health insurance', 'dental', 'vision', '401k', 'retirement',
            'pto', 'vacation', 'sick leave', 'parental leave',
            'flexible hours', 'work life balance', 'professional development',
            'training', 'conference', 'stock options', 'equity',
            'bonus', 'commission', 'gym', 'wellness', 'free lunch',
            'catered meals', 'unlimited pto'
        ]
        
        for benefit in benefit_keywords:
            if benefit in text:
                benefits.append(benefit)
        
        return benefits
    
    def _identify_match_factors(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Identify key factors for job matching"""
        return {
            'technical_skills_count': len(analysis['required_skills']),
            'experience_level': analysis['experience_level'],
            'remote_options': analysis['remote_friendly'],
            'industry': analysis['industry'],
            'company_size': analysis['company_size'],
            'benefits_count': len(analysis['benefits'])
        }
