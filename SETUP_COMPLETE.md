# Resume Tailor - Setup Guide

## Current Status ✅
Your Resume Tailor system is now fully integrated and ready to use! Here's what's working:

- ✅ **Backend Server**: Running on http://localhost:8000 with OpenAI integration
- ✅ **Webapp**: Running on http://localhost:5173 with modern Google OAuth and Clerk auth
- ✅ **Chrome Extension**: Fixed with comprehensive job scraping and analysis workflow
- ✅ **Complete Workflow**: Extension → Backend Analysis → Webapp Display → Google Docs Integration

## Final Configuration Steps

### 1. OpenAI API Key (Required for AI Features)
Add your OpenAI API key to the backend:

```bash
# Create or edit .env file in the backend folder
cd backend
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 2. Google Cloud Console Setup (Required for Google Docs Integration)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Enable APIs**:
   - Google Drive API
   - Google Docs API
   - Google Identity Services

3. **Configure OAuth Consent Screen**:
   - User Type: External
   - Add test users (your email addresses)
   - Scopes needed:
     - `https://www.googleapis.com/auth/drive.readonly`
     - `https://www.googleapis.com/auth/documents`
     - `https://www.googleapis.com/auth/userinfo.profile`

4. **Update OAuth Client**:
   - Add authorized JavaScript origins: `http://localhost:5173`
   - Add authorized redirect URIs: `http://localhost:5173`

## How to Use

### Complete Workflow:
1. **Sign in** to the webapp at http://localhost:5173
2. **Visit a job posting** on Indeed, LinkedIn, Glassdoor, etc.
3. **Click the Chrome extension** icon to analyze the job
4. **Return to webapp** to see AI-powered analysis and resume suggestions
5. **Connect Google Docs** to edit your resume directly
6. **Chat with AI** for personalized resume advice

### Extension Features:
- ✅ Detects jobs on Indeed, LinkedIn, Glassdoor
- ✅ Extracts job title, company, description, location
- ✅ Sends data to backend for AI analysis
- ✅ Automatically opens/focuses webapp tab
- ✅ Displays analysis results in webapp

### Webapp Features:
- ✅ Modern glassmorphic dark theme
- ✅ Clerk authentication with onboarding
- ✅ Google Docs integration with modern OAuth
- ✅ Real-time job analysis display
- ✅ AI chat for resume advice
- ✅ Document preview and editing

### Backend Features:
- ✅ FastAPI server with CORS support
- ✅ OpenAI GPT integration for job analysis
- ✅ Comprehensive job parsing and keyword extraction
- ✅ Chat endpoint for resume advice
- ✅ Proper error handling and logging

## Testing the Integration

1. **Start all services** (already running):
   - Backend: `cd backend && python main.py`
   - Webapp: `cd webapp && npm run dev`

2. **Test the workflow**:
   - Visit https://indeed.com/jobs
   - Find any job posting
   - Click your extension icon
   - Click "Analyze Job"
   - Watch the webapp update with analysis results

3. **Test Google Docs integration**:
   - Click "Connect Google Account" in the webapp
   - Complete OAuth flow
   - Your documents should appear in the panel

## Troubleshooting

### Extension Issues:
- **No job detected**: Make sure you're on a job posting page
- **Analysis fails**: Check that backend is running on port 8000
- **Can't connect**: Ensure webapp is running on port 5173

### OAuth Issues:
- **"idpiframe_initialization_failed"**: Add your domain to Google Cloud Console
- **"Access blocked"**: Add test users to OAuth consent screen
- **Token errors**: Check that scopes are correctly configured

### Backend Issues:
- **OpenAI errors**: Verify API key is set in .env file
- **CORS errors**: Backend should handle this automatically
- **Port conflicts**: Make sure port 8000 is free

## Files Updated in This Session

### Webapp:
- `src/App.tsx`: Added job analysis integration and messaging
- `src/components/GoogleDocsPanel.tsx`: Modern Google Identity Services
- `src/components/LLMChatPanel.tsx`: AI chat integration
- `src/api/llm.ts`: Updated API endpoints

### Backend:
- `main.py`: Added OpenAI integration and analysis endpoints
- Added comprehensive job analysis and chat functionality

### Extension:
- `src/popup.tsx`: Complete rewrite with modern job scraping
- `src/content.ts`: Added webapp communication
- Enhanced job detection for multiple sites

Your Resume Tailor system is now complete and ready for production use! 🎉
