# Resume Tailor - AI-Powered Chrome Extension

A Chrome extension that helps job seekers tailor their resumes for specific job postings using AI analysis.

## 🚀 Features

### Phase 1 (MVP) - Complete ✅
- **Job Detection**: Automatically detects job postings on LinkedIn, Indeed, Google Jobs, and Glassdoor
- **Resume Analysis**: AI-powered analysis comparing your resume with job descriptions
- **Smart Suggestions**: Get specific recommendations to improve your resume content
- **Match Score**: See how well your resume matches the job requirements (0-100%)
- **Missing Keywords**: Identify important keywords you should include
- **One-Click Application**: Quick access to tailoring tools directly on job sites

### Upcoming Features 🔜
- **Autofill Support**: Automatically fill job application forms with tailored content
- **Resume History**: Save and manage multiple tailored versions
- **Cover Letter Generator**: AI-generated cover letters based on job requirements
- **Application Tracking**: Track your applications and success rates

## 🛠️ Installation

### For Users

1. **Download the Extension**:
   - Clone or download this repository
   - Navigate to the project folder and run:
   ```bash
   npm install
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

3. **Grant Permissions**:
   - The extension will request permissions for job sites
   - Click "Allow" to enable job detection features

### For Developers

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd resume-tailor-extension/extension-resume-tailor
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build:extension
   ```

## 🎯 How to Use

### 1. Browse Job Sites
- Visit supported job sites: LinkedIn, Indeed, Google Jobs, or Glassdoor
- The extension automatically detects job postings

### 2. Analyze Your Resume
- Click the floating AI button (📄) on job pages
- Upload your resume or paste the text
- Click "Analyze & Tailor Resume"

### 3. Review Suggestions
- View your match score (0-100%)
- See missing keywords highlighted
- Review AI-generated improvements for each bullet point

### 4. Apply Changes
- Copy improved text with one click
- Apply suggestions to create a tailored version
- Save the tailored resume for future reference

## 🏗️ Technical Architecture

### Frontend (Chrome Extension)
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Extension API**: Chrome Manifest v3

### Content Scripts
- **Job Detection**: Automatically extracts job information from pages
- **UI Injection**: Adds floating action buttons and analysis panels
- **Site Support**: LinkedIn, Indeed, Google Jobs, Glassdoor

### Background Service Worker
- **Storage Management**: Handles job data and resume storage
- **Message Passing**: Coordinates between content scripts and popup
- **Permissions**: Manages site access and user permissions

## 🎨 User Interface

### Popup Interface
- **Current Job Tab**: Shows detected job information and quick actions
- **History Tab**: Displays saved tailored resumes
- **Settings**: Configure AI provider and extension preferences

### Content Script UI
- **Floating Action Button**: Quick access to analysis tools
- **Analysis Modal**: Full-featured resume analysis interface
- **Suggestions Panel**: Interactive improvement recommendations

## 🔧 Configuration

### Supported Job Sites
- LinkedIn Jobs (`linkedin.com/jobs/*`)
- Indeed (`indeed.com/*`)
- Google Jobs (`jobs.google.com/*`)
- Glassdoor (`glassdoor.com/*`)

### Storage
- **Chrome Sync Storage**: User preferences and saved resumes
- **Chrome Local Storage**: Temporary job data and analysis results

## 📋 Development Roadmap

### Phase 1: Core Extension (Current) ✅
- [x] Chrome extension setup with Manifest v3
- [x] Job site detection and data extraction
- [x] Basic AI analysis interface
- [x] Resume upload and text input
- [x] Match scoring and keyword analysis
- [x] Suggestion generation and display

### Phase 2: AI Integration 🔄
- [ ] OpenAI API integration for real AI analysis
- [ ] Advanced NLP for resume parsing
- [ ] Contextual keyword extraction
- [ ] Industry-specific recommendations

### Phase 3: Advanced Features 🔜
- [ ] Autofill job application forms
- [ ] Resume version management
- [ ] Cover letter generation
- [ ] Application tracking dashboard
- [ ] Success rate analytics

### Phase 4: Backend Integration 🔮
- [ ] User authentication and cloud storage
- [ ] Advanced analytics and insights
- [ ] Team collaboration features
- [ ] API for third-party integrations

## 🚨 Known Issues

1. **PostCSS Warning**: Some PostCSS warnings during build (non-blocking)
2. **Icon Placeholders**: Extension icons not yet created
3. **Mock AI Data**: Currently using simulated AI responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in this repository
- Check the [FAQ](docs/FAQ.md)
- Contact the development team

---

**Resume Tailor** - Revolutionizing job applications, one resume at a time! 🎯
