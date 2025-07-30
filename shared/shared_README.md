# Resume Tailor - Shared Utilities

Common utilities and models shared between the Chrome extension and backend API.

## Overview

The shared folder contains reusable components that standardize data structures and common operations across the Resume Tailor ecosystem.

## Modules

### `utils.py` - Common utility functions
- **TextProcessor**: Text cleaning, email/phone extraction
- **SkillsMatcher**: Skill categorization and matching  
- **ResumeFormatter**: Resume data formatting
- **KeywordAnalyzer**: Keyword extraction and analysis

### `models.py` - Data structures
- **Core Models**: PersonalInfo, ExperienceEntry, ResumeData, JobPosting
- **Enums**: ExperienceLevel, JobType, SuggestionType, Priority
- **Conversion Functions**: dict_to_resume_data, resume_data_to_dict

### `constants.py` - Application constants
- **Categories**: Resume sections, job types, industries
- **Configuration**: API settings, file limits, AI parameters
- **Skills Database**: Skill synonyms and ATS keywords

## Usage Examples

### Text Processing
```python
from shared.utils import TextProcessor

clean_text = TextProcessor.clean_text("  Raw text  ")
email = TextProcessor.extract_email("Contact: john@example.com")
```

### Skill Matching
```python
from shared.utils import SkillsMatcher

category = SkillsMatcher.categorize_skill("python")
score = SkillsMatcher.calculate_skill_match_score(
    resume_skills=["python", "react"],
    job_skills=["python", "django"]
)
```

### Data Models
```python
from shared.models import ResumeData, PersonalInfo

resume = ResumeData(
    personal_info=PersonalInfo(name="John", email="john@email.com"),
    skills=["Python", "React"]
)
```

## Installation

```python
# Add to Python path
import sys
sys.path.append('path/to/shared')

from shared.utils import TextProcessor
from shared.models import ResumeData
```

## License

MIT License
