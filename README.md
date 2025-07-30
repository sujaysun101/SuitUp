# Resume Tailor - AI-Powered Job Application Assistant

A comprehensive resume tailoring platform that helps users discover job postings, analyze job descriptions using AI, optimize resumes, and automatically fill job applications. Built with a modern gradient UI inspired by Gemini's design language.

## 🚀 Features

### 🎯 Core Functionality
- **Job Discovery**: Automatically detects and extracts job information from major job boards
- **AI Analysis**: Analyzes job descriptions and suggests resume improvements
- **Resume Optimization**: AI-powered resume tailoring with real-time feedback
- **Google Drive Integration**: Direct integration with Google Docs for seamless resume editing
- **Auto-fill Applications**: Intelligent form detection and automated job application filling
- **Modern UI**: Beautiful gradient interface inspired by Google Gemini

### 🌟 Key Components
1. **Chrome Extension**: Modern popup with job detection and auto-fill capabilities
2. **Web Application**: Comprehensive dashboard for resume management and job analysis
3. **Backend API**: FastAPI-powered service with AI integration and Google Drive support
4. **Google Drive Service**: OAuth2-enabled document management and editing

## 🏗️ Architecture

```
resume-tailor-extension/
├── extension/          # Chrome Extension (Modern Gemini-inspired UI)
├── webapp/            # React Web Application (shadcn/ui + Tailwind)
├── backend/           # FastAPI Backend with AI & Google Drive
├── shared/            # Shared TypeScript types and utilities
└── build-all.ps1     # Complete build script
```

## 🛠️ Tech Stack

### Frontend (Webapp)
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS with custom gradients
- **Animations**: Framer Motion
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **AI Integration**: OpenAI GPT API
- **Google APIs**: Drive API, Docs API, OAuth2
- **Database**: File-based storage (expandable to PostgreSQL)
- **Authentication**: Google OAuth2 flow

### Extension
- **Build Tool**: Vite + TypeScript
- **UI Framework**: React with Tailwind CSS
- **Chrome APIs**: Tabs, Storage, Scripting, ActiveTab
- **Content Scripts**: Advanced form detection and auto-fill

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Chrome browser (for extension)
- Google Cloud Console account (for Drive integration)

### 1. Complete Setup (Automated)
```powershell
# Clone and navigate to the project
git clone <your-repo-url>
cd resume-tailor-extension

# Run the complete build script
.\build-all.ps1
```

### 2. Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

#### Webapp Setup
```bash
cd webapp
npm install
npm run dev  # Development server
npm run build  # Production build
```

#### Extension Setup
```bash
cd extension
npm install
npm run build  # Builds to dist/ folder
```

### 3. Google Drive Integration Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Drive API and Google Docs API

2. **Create OAuth2 Credentials**:
   - Go to "Credentials" section
   - Create "OAuth 2.0 Client ID"
   - Add authorized redirect URIs:
     - `http://localhost:8000/auth/google/callback`
     - `http://localhost:3000/auth/callback`

3. **Configure Environment**:
   ```env
   # backend/.env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## 🎮 Usage Guide

### 1. Start the Backend
```bash
cd backend
.\venv\Scripts\activate  # Windows
uvicorn main:app --reload
```
Backend runs on `http://localhost:8000`

### 2. Start the Webapp
```bash
cd webapp
npm run dev
```
Webapp runs on `http://localhost:3000`

### 3. Install Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder
5. The extension icon should appear in your browser toolbar

### 4. Using the System

#### Job Discovery & Analysis
1. Navigate to any supported job board (LinkedIn, Indeed, etc.)
2. Click the Resume Tailor extension icon
3. Click "Analyze Job" to extract job details
4. Review AI-powered job analysis and requirements

#### Resume Optimization
1. Click "Open Web App" from the extension
2. Upload or create your resume in the webapp
3. Use the AI analysis to optimize your resume
4. Save optimized resume to Google Drive

#### Auto-fill Applications
1. Navigate to a job application form
2. The extension automatically detects application forms
3. Click the "Auto-fill with Resume" floating button
4. Watch as your information is intelligently filled

## 🎨 UI Design

The interface features a modern gradient design inspired by Google Gemini:
- **Primary Gradient**: `linear-gradient(135deg, #0ea5e9, #3b82f6, #8b5cf6)`
- **Glass Morphism**: Backdrop blur effects with semi-transparent backgrounds
- **Smooth Animations**: Framer Motion powered transitions
- **Dark Theme**: Optimized for modern dark UI preferences

## 📁 Project Structure

### Extension (`/extension`)
```
src/
├── popup.tsx          # Modern extension popup with gradients
├── content.ts         # Job detection + auto-fill functionality
├── background.ts      # Extension background service worker
└── types.ts          # TypeScript type definitions
```

### Webapp (`/webapp`)
```
src/
├── pages/
│   ├── Dashboard.tsx     # Main dashboard with job stats
│   ├── JobAnalysis.tsx   # AI-powered job analysis
│   └── ResumeEditor.tsx  # Resume editing with Google Drive
├── components/
│   └── Navigation.tsx    # App navigation component
└── lib/
    └── api.ts           # API client for backend communication
```

### Backend (`/backend`)
```
├── main.py                          # FastAPI application entry
├── services/
│   └── google_drive_service.py     # Google Drive/Docs integration
├── models/                         # Data models and schemas
└── routes/                         # API route handlers
```

## 🔧 API Endpoints

### Job Analysis
- `POST /api/jobs/analyze` - Analyze job description with AI
- `GET /api/jobs/{id}` - Retrieve job analysis results

### Resume Management
- `POST /api/resumes/upload` - Upload resume for analysis
- `GET /api/resumes/{id}` - Retrieve resume data
- `POST /api/resumes/{id}/optimize` - AI-powered resume optimization

### Google Drive Integration
- `GET /api/google-drive/auth` - Initiate OAuth2 flow
- `POST /api/google-drive/save-resume` - Save resume to Google Drive
- `GET /api/google-drive/resumes` - List saved resumes

### Auto-fill Support
- `POST /api/autofill/analyze-form` - Analyze form fields for auto-fill
- `POST /api/autofill/fill-data` - Generate fill data for forms

## 🧪 Testing

### Extension Testing
1. Load extension in Chrome Developer Mode
2. Visit supported job sites (LinkedIn, Indeed)
3. Test job detection and analysis
4. Test auto-fill on application forms

### Webapp Testing
1. Start development server: `npm run dev`
2. Test Google Drive OAuth flow
3. Test resume upload and AI analysis
4. Test responsive design on different screen sizes

### Backend Testing
1. Access API docs at `http://localhost:8000/docs`
2. Test all endpoints using FastAPI's interactive documentation
3. Verify Google Drive integration with OAuth2 flow

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Set environment variables in your deployment platform
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
OPENAI_API_KEY=your_openai_key
```

### Webapp Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

### Extension Publishing
1. Build production version: `npm run build`
2. Create a zip file of the `dist/` folder
3. Submit to Chrome Web Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `http://localhost:8000/docs`
- Review the browser console for extension debugging

## 🎯 Roadmap

- [ ] Advanced AI models for better job matching
- [ ] Integration with more job boards
- [ ] Resume version control and templates
- [ ] Team collaboration features
- [ ] Mobile app companion
- [ ] Analytics dashboard for application tracking

---

Built with ❤️ using modern web technologies and AI-powered insights.
