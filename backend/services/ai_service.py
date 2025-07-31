import openai
from typing import Dict, Any, List
import os
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered resume analysis and optimization using OpenAI"""
    
    def __init__(self):
        # Initialize OpenAI client
        self.client = openai.OpenAI(
            api_key=os.getenv('OPENAI_API_KEY')
        )
        
        # Model configuration
        self.model = "gpt-4-turbo-preview"  # Use latest GPT-4 model
        self.max_tokens = 2000
        self.temperature = 0.3  # Lower temperature for more consistent results
    
    async def generate_tailoring_suggestions(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate AI-powered resume tailoring suggestions"""
        try:
            # Prepare context for AI
            context = self._prepare_context(resume_data, job_analysis)
            
            # Generate suggestions using OpenAI
            suggestions = await self._get_ai_suggestions(context)
            
            # Calculate match score
            match_score = self._calculate_match_score(resume_data, job_analysis)
            
            return {
                "suggestions": suggestions,
                "match_score": match_score,
                "priority_changes": [s for s in suggestions if s.get("priority", 0) >= 4],
                "missing_keywords": self._find_missing_keywords(resume_data, job_analysis),
                "ats_score": self._calculate_ats_score(resume_data, job_analysis)
            }
            
        except Exception as e:
            logger.error(f"Error generating tailoring suggestions: {str(e)}")
            raise
    
    async def optimize_text_section(
        self, 
        text: str, 
        section_type: str, 
        job_context: Dict[str, Any]
    ) -> str:
        """Optimize a specific resume section using AI"""
        try:
            prompt = self._create_optimization_prompt(text, section_type, job_context)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume writer and career coach."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error optimizing text section: {str(e)}")
            raise
    
    def _prepare_context(self, resume_data: Dict[str, Any], job_analysis: Dict[str, Any]) -> str:
        """Prepare context for AI analysis"""
        context = f"""
        JOB POSTING ANALYSIS:
        - Title: {job_analysis.get('job_title', 'N/A')}
        - Company: {job_analysis.get('company', 'N/A')}
        - Industry: {job_analysis.get('industry', 'N/A')}
        - Experience Level: {job_analysis.get('experience_level', 'N/A')}
        - Required Skills: {', '.join(job_analysis.get('required_skills', []))}
        - Key Requirements: {job_analysis.get('requirements', {})}
        
        CURRENT RESUME DATA:
        - Summary: {resume_data.get('summary', 'N/A')}
        - Skills: {', '.join(resume_data.get('skills', []))}
        - Experience Entries: {len(resume_data.get('experience', []))}
        - Education: {len(resume_data.get('education', []))}
        - Certifications: {', '.join(resume_data.get('certifications', []))}
        """
        
        return context
    
    async def _get_ai_suggestions(self, context: str) -> List[Dict[str, Any]]:
        """Get AI-generated suggestions"""
        try:
            prompt = f"""
            Based on the following job posting and resume data, provide specific, actionable suggestions to tailor the resume for this job. Focus on:
            
            1. Keywords to add or emphasize
            2. Skills to highlight
            3. Experience descriptions to modify
            4. Missing elements to include
            5. ATS optimization recommendations
            
            Context:
            {context}
            
            Please provide suggestions in JSON format with the following structure for each suggestion:
            {{
                "section": "section_name",
                "type": "add|modify|remove",
                "original_text": "current text (if modifying)",
                "suggested_text": "new text",
                "reason": "explanation for the change",
                "priority": 1-5 (5 being highest priority)
            }}
            
            Provide 5-10 specific, actionable suggestions.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume writer with deep knowledge of ATS systems and hiring practices."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            # Parse AI response
            ai_response = response.choices[0].message.content.strip()
            
            # Try to extract JSON from the response
            try:
                # Look for JSON content between ```json tags or parse directly
                if "```json" in ai_response:
                    json_start = ai_response.find("```json") + 7
                    json_end = ai_response.find("```", json_start)
                    json_content = ai_response[json_start:json_end]
                else:
                    json_content = ai_response
                
                suggestions = json.loads(json_content)
                
                # Ensure suggestions is a list
                if isinstance(suggestions, dict):
                    suggestions = [suggestions]
                
                return suggestions
                
            except json.JSONDecodeError:
                # Fallback: parse suggestions manually
                return self._parse_suggestions_fallback(ai_response)
            
        except Exception as e:
            logger.error(f"Error getting AI suggestions: {str(e)}")
            # Return basic suggestions as fallback
            return self._generate_fallback_suggestions(context)
    
    def _parse_suggestions_fallback(self, ai_response: str) -> List[Dict[str, Any]]:
        """Fallback parsing when JSON parsing fails"""
        suggestions = []
        
        # Basic parsing logic for structured text
        lines = ai_response.split('\n')
        current_suggestion = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith('Section:'):
                if current_suggestion:
                    suggestions.append(current_suggestion)
                current_suggestion = {'section': line.split(':', 1)[1].strip()}
            elif line.startswith('Type:'):
                current_suggestion['type'] = line.split(':', 1)[1].strip()
            elif line.startswith('Suggested:'):
                current_suggestion['suggested_text'] = line.split(':', 1)[1].strip()
            elif line.startswith('Reason:'):
                current_suggestion['reason'] = line.split(':', 1)[1].strip()
                current_suggestion['priority'] = 3  # Default priority
        
        if current_suggestion:
            suggestions.append(current_suggestion)
        
        return suggestions
    
    def _generate_fallback_suggestions(self, context: str) -> List[Dict[str, Any]]:
        """Generate basic suggestions when AI fails"""
        return [
            {
                "section": "summary",
                "type": "modify",
                "suggested_text": "Add job-relevant keywords to your professional summary",
                "reason": "Improve ATS keyword matching",
                "priority": 4
            },
            {
                "section": "skills",
                "type": "add",
                "suggested_text": "Include technical skills mentioned in job posting",
                "reason": "Match required qualifications",
                "priority": 5
            }
        ]
    
    def _create_optimization_prompt(
        self, 
        text: str, 
        section_type: str, 
        job_context: Dict[str, Any]
    ) -> str:
        """Create prompt for text section optimization"""
        return f"""
        Please optimize the following {section_type} section of a resume for the given job context:
        
        Current Text:
        {text}
        
        Job Context:
        - Title: {job_context.get('title', 'N/A')}
        - Company: {job_context.get('company', 'N/A')}
        - Required Skills: {', '.join(job_context.get('required_skills', []))}
        - Industry: {job_context.get('industry', 'N/A')}
        
        Requirements:
        1. Maintain the same general structure and length
        2. Incorporate relevant keywords naturally
        3. Use action verbs and quantifiable achievements
        4. Make it ATS-friendly
        5. Keep it professional and concise
        
        Return only the optimized text without explanations.
        """
    
    def _calculate_match_score(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> float:
        """Calculate overall job match score"""
        try:
            score = 0.0
            total_factors = 0
            
            # Skills match (40% weight)
            resume_skills = set(skill.lower() for skill in resume_data.get('skills', []))
            required_skills = set(skill.lower() for skill in job_analysis.get('required_skills', []))
            
            if required_skills:
                skills_match = len(resume_skills.intersection(required_skills)) / len(required_skills)
                score += skills_match * 40
            total_factors += 40
            
            # Keywords match (30% weight)
            resume_text = resume_data.get('raw_text', '').lower()
            job_keywords = [kw.lower() for kw in job_analysis.get('keywords', [])]
            
            if job_keywords:
                keyword_matches = sum(1 for kw in job_keywords if kw in resume_text)
                keyword_score = keyword_matches / len(job_keywords)
                score += keyword_score * 30
            total_factors += 30
            
            # Experience level match (20% weight)
            experience_match = self._match_experience_level(resume_data, job_analysis)
            score += experience_match * 20
            total_factors += 20
            
            # Industry relevance (10% weight)
            industry_match = self._match_industry_relevance(resume_data, job_analysis)
            score += industry_match * 10
            total_factors += 10
            
            return min(100.0, (score / total_factors) * 100) if total_factors > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating match score: {str(e)}")
            return 0.0
    
    def _match_experience_level(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> float:
        """Match experience level between resume and job"""
        # This is a simplified implementation
        # In practice, you'd analyze the resume's experience section more thoroughly
        experience_entries = len(resume_data.get('experience', []))
        required_level = job_analysis.get('experience_level', 'not_specified')
        
        if required_level == 'entry' and experience_entries <= 2:
            return 1.0
        elif required_level == 'mid' and 2 <= experience_entries <= 5:
            return 1.0
        elif required_level == 'senior' and experience_entries >= 5:
            return 1.0
        else:
            return 0.5  # Partial match
    
    def _match_industry_relevance(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> float:
        """Match industry relevance"""
        # Simplified industry matching
        resume_text = resume_data.get('raw_text', '').lower()
        job_industry = job_analysis.get('industry', '').lower()
        
        if job_industry in resume_text:
            return 1.0
        else:
            return 0.5  # Assume some transferable skills
    
    def _find_missing_keywords(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> List[str]:
        """Find important keywords missing from resume"""
        resume_text = resume_data.get('raw_text', '').lower()
        job_keywords = [kw.lower() for kw in job_analysis.get('keywords', [])]
        required_skills = [skill.lower() for skill in job_analysis.get('required_skills', [])]
        
        missing = []
        
        # Check for missing skills
        for skill in required_skills:
            if skill not in resume_text:
                missing.append(skill)
        
        # Check for missing important keywords (top 10)
        for keyword in job_keywords[:10]:
            if keyword not in resume_text and keyword not in missing:
                missing.append(keyword)
        
        return missing[:10]  # Return top 10 missing keywords
    
    def _calculate_ats_score(
        self, 
        resume_data: Dict[str, Any], 
        job_analysis: Dict[str, Any]
    ) -> float:
        """Calculate ATS (Applicant Tracking System) friendliness score"""
        score = 0.0
        
        # Check for structured sections
        if resume_data.get('personal_info'):
            score += 20
        if resume_data.get('summary'):
            score += 15
        if resume_data.get('experience'):
            score += 25
        if resume_data.get('education'):
            score += 15
        if resume_data.get('skills'):
            score += 25
        
        return min(100.0, score)
