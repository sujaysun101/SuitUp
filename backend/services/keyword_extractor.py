import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from textblob import TextBlob
from typing import List, Dict, Any
import re
from collections import Counter
import logging

logger = logging.getLogger(__name__)

class KeywordExtractor:
    """Service for extracting keywords and skills from job postings using NLTK"""
    
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
            nltk.download('wordnet', quiet=True)
            
            self.stop_words = set(stopwords.words('english'))
            self.lemmatizer = WordNetLemmatizer()
            self.nltk_available = True
        except Exception as e:
            logger.warning(f"NLTK setup failed: {e}. Using fallback methods.")
            self.stop_words = set()
            self.lemmatizer = None
            self.nltk_available = False
        
        # Common technical skills and tools
        self.tech_skills = {
            'programming_languages': [
                'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
                'typescript', 'go', 'rust', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash'
            ],
            'web_technologies': [
                'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
                'flask', 'spring', 'asp.net', 'bootstrap', 'jquery', 'webpack', 'sass'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle',
                'sql server', 'sqlite', 'cassandra', 'dynamodb', 'firestore'
            ],
            'cloud_platforms': [
                'aws', 'azure', 'google cloud', 'gcp', 'heroku', 'digitalocean',
                'kubernetes', 'docker', 'terraform', 'cloudformation'
            ],
            'tools': [
                'git', 'jenkins', 'gitlab', 'github', 'jira', 'confluence', 'slack',
                'trello', 'asana', 'figma', 'sketch', 'adobe', 'postman', 'swagger'
            ],
            'methodologies': [
                'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd',
                'microservices', 'rest', 'graphql', 'api', 'mvc'
            ]
        }
        
        # Flatten skills for easier searching
        self.all_tech_skills = []
        for category, skills in self.tech_skills.items():
            self.all_tech_skills.extend(skills)
    
    async def extract_keywords(self, text: str, max_keywords: int = 20) -> List[str]:
        """Extract important keywords from job posting text using NLTK"""
        try:
            if not self.nltk_available:
                return self._extract_keywords_fallback(text, max_keywords)
            
            # Tokenize and process text
            tokens = word_tokenize(text.lower())
            
            # Remove stop words and punctuation
            filtered_tokens = [
                token for token in tokens 
                if token.isalpha() and token not in self.stop_words and len(token) > 2
            ]
            
            # POS tagging to get meaningful words (nouns, adjectives, verbs)
            pos_tags = pos_tag(filtered_tokens)
            meaningful_words = [
                word for word, pos in pos_tags 
                if pos.startswith(('NN', 'JJ', 'VB'))  # Nouns, adjectives, verbs
            ]
            
            # Lemmatize words
            if self.lemmatizer:
                lemmatized_words = [self.lemmatizer.lemmatize(word) for word in meaningful_words]
            else:
                lemmatized_words = meaningful_words
            
            # Count frequency and return top keywords
            keyword_counts = Counter(lemmatized_words)
            return [word for word, count in keyword_counts.most_common(max_keywords)]
            
        except Exception as e:
            logger.error(f"Error extracting keywords: {str(e)}")
            return self._extract_keywords_fallback(text, max_keywords)
    
    def _extract_keywords_fallback(self, text: str, max_keywords: int) -> List[str]:
        """Fallback keyword extraction without spaCy"""
        # Simple word frequency approach
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Common stop words to filter out
        stop_words = {
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
            'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
            'see', 'two', 'who', 'boy', 'did', 'does', 'let', 'own', 'say', 'she', 'too', 'use', 'will',
            'with', 'have', 'this', 'that', 'they', 'would', 'been', 'their', 'said', 'each', 'which',
            'work', 'team', 'company', 'role', 'position', 'job', 'candidate', 'experience', 'years'
        }
        
        filtered_words = [word for word in words if word not in stop_words and len(word) > 2]
        word_counts = Counter(filtered_words)
        
        return [word for word, count in word_counts.most_common(max_keywords)]
    
    async def extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from job posting"""
        text_lower = text.lower()
        found_skills = []
        
        # Look for each technical skill in the text
        for skill in self.all_tech_skills:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        # Also look for variations and common abbreviations
        skill_variations = {
            'javascript': ['js', 'javascript', 'java script'],
            'typescript': ['ts', 'typescript'],
            'c++': ['cpp', 'c plus plus'],
            'c#': ['csharp', 'c sharp'],
            'node.js': ['nodejs', 'node'],
            'react.js': ['reactjs', 'react'],
            'vue.js': ['vuejs', 'vue'],
            'angular.js': ['angularjs', 'angular'],
            'sql server': ['sqlserver', 'mssql'],
            'postgresql': ['postgres', 'pg'],
            'mongodb': ['mongo'],
            'aws': ['amazon web services'],
            'gcp': ['google cloud platform'],
            'ci/cd': ['continuous integration', 'continuous deployment']
        }
        
        for main_skill, variations in skill_variations.items():
            for variation in variations:
                pattern = r'\b' + re.escape(variation.lower()) + r'\b'
                if re.search(pattern, text_lower) and main_skill not in found_skills:
                    found_skills.append(main_skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    async def extract_experience_level(self, text: str) -> str:
        """Extract required experience level from job posting"""
        text_lower = text.lower()
        
        # Experience level patterns
        patterns = {
            'entry': [
                r'entry.?level', r'junior', r'0.?2 years?', r'new grad', r'recent grad',
                r'no experience', r'fresh'
            ],
            'mid': [
                r'mid.?level', r'intermediate', r'2.?5 years?', r'3.?5 years?',
                r'some experience'
            ],
            'senior': [
                r'senior', r'5\+ years?', r'6\+ years?', r'7\+ years?', r'experienced',
                r'lead', r'principal'
            ],
            'executive': [
                r'director', r'manager', r'head of', r'vp', r'cto', r'ceo', r'executive'
            ]
        }
        
        for level, level_patterns in patterns.items():
            for pattern in level_patterns:
                if re.search(pattern, text_lower):
                    return level
        
        return 'not_specified'
    
    async def extract_job_requirements(self, text: str) -> Dict[str, List[str]]:
        """Extract structured job requirements"""
        requirements = {
            'required_skills': [],
            'preferred_skills': [],
            'responsibilities': [],
            'qualifications': []
        }
        
        text_lower = text.lower()
        
        # Split text into sections
        sections = self._split_into_sections(text)
        
        for section_name, section_text in sections.items():
            if 'requirement' in section_name or 'qualification' in section_name:
                requirements['qualifications'].extend(
                    self._extract_bullet_points(section_text)
                )
            elif 'responsibilit' in section_name or 'duties' in section_name:
                requirements['responsibilities'].extend(
                    self._extract_bullet_points(section_text)
                )
            elif 'skill' in section_name or 'technical' in section_name:
                requirements['required_skills'].extend(
                    await self.extract_skills(section_text)
                )
        
        return requirements
    
    def _split_into_sections(self, text: str) -> Dict[str, str]:
        """Split job posting into logical sections"""
        sections = {}
        
        # Common section headers
        section_patterns = [
            r'responsibilities?:?',
            r'requirements?:?',
            r'qualifications?:?',
            r'skills?:?',
            r'experience:?',
            r'education:?',
            r'what you.?ll do:?',
            r'what we.?re looking for:?',
            r'nice to have:?',
            r'preferred:?',
            r'bonus:?'
        ]
        
        lines = text.split('\n')
        current_section = 'general'
        current_content = []
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check if this line matches a section header
            section_found = None
            for pattern in section_patterns:
                if re.search(pattern, line_lower):
                    section_found = line_lower
                    break
            
            if section_found:
                # Save previous section
                if current_content:
                    sections[current_section] = '\n'.join(current_content)
                
                # Start new section
                current_section = section_found
                current_content = []
            else:
                current_content.append(line)
        
        # Save last section
        if current_content:
            sections[current_section] = '\n'.join(current_content)
        
        return sections
    
    def _extract_bullet_points(self, text: str) -> List[str]:
        """Extract bullet points or list items from text"""
        bullet_points = []
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Check for various bullet point indicators
            if (line.startswith('•') or 
                line.startswith('-') or 
                line.startswith('*') or
                re.match(r'^\d+\.', line)):
                # Remove bullet point marker
                cleaned = re.sub(r'^[•\-*\d\.]\s*', '', line).strip()
                if cleaned:
                    bullet_points.append(cleaned)
        
        return bullet_points
