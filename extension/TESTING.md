# Testing the Resume Tailor Extension

## Quick Testing Steps

### 1. Load the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The Resume Tailor extension should appear in your extensions list

### 2. Test Job Detection
1. Visit one of the supported job sites:
   - [LinkedIn Jobs](https://www.linkedin.com/jobs/)
   - [Indeed](https://www.indeed.com/)
   - [Google Jobs](https://jobs.google.com/)
   - [Glassdoor](https://www.glassdoor.com/)

2. Navigate to any job posting
3. Look for the floating AI button (📄) in the bottom right corner
4. Click the extension icon in Chrome toolbar to see detected job info

### 3. Test Resume Analysis
1. On a job posting page, click the floating AI button (📄)
2. In the modal that opens:
   - Either upload a resume file (PDF/DOC)
   - Or paste resume text in the text area
3. Click "Analyze & Tailor Resume"
4. Wait for the analysis results (currently simulated)

### 4. Test Features
- **Match Score**: Should show a percentage (60-100%)
- **Missing Keywords**: Should display highlighted keyword tags
- **Suggestions**: Should show before/after text improvements
- **Copy/Apply**: Test the copy and apply buttons
- **Save Resume**: Test saving functionality

### 5. Test Popup Interface
1. Click the extension icon in Chrome toolbar
2. Switch between "Current Job" and "History" tabs
3. Test refresh functionality
4. Verify job information is displayed correctly

## Expected Behavior

### ✅ Working Features
- Job detection on supported sites
- Floating action button appears
- Extension popup shows detected job
- Analysis modal opens and displays
- Simulated analysis results appear
- UI is responsive and styled with Tailwind

### 🔧 Known Limitations (Expected)
- AI analysis is currently simulated (mock data)
- Icons are placeholder text
- File upload doesn't process actual files yet
- Autofill functionality not implemented

## Troubleshooting

### Extension Not Loading
- Check that you selected the `dist` folder, not the root project folder
- Ensure the build completed successfully (`npm run build:extension`)
- Check Chrome DevTools console for errors

### Job Not Detected
- Refresh the page after loading the extension
- Check that you're on a supported job site
- Some sites may load content dynamically - wait a few seconds

### Popup Not Working
- Check Chrome extensions page to ensure permissions are granted
- Try refreshing the job posting page
- Check browser console for JavaScript errors

### Content Script Issues
- Open Chrome DevTools on the job page
- Check Console tab for any error messages
- Verify the extension has permission for the current domain

## Development Testing

### Hot Reload Changes
1. Make code changes
2. Run `npm run build:extension`
3. Go to `chrome://extensions/`
4. Click the refresh icon for Resume Tailor extension
5. Refresh the job posting page to test changes

### Debug Mode
- Open Chrome DevTools while testing
- Check Console for log messages
- Use the Sources tab to debug TypeScript files
- Monitor Network tab for future API calls

## Next Steps for Real Deployment

1. **Add Real Icons**: Create 16x16, 32x32, 48x48, 128x128 PNG icons
2. **Integrate AI API**: Replace mock data with real OpenAI/AI service
3. **File Processing**: Implement actual PDF/DOC resume parsing
4. **Error Handling**: Add proper error messages and fallbacks
5. **User Testing**: Get feedback from real users on job sites

---

Happy testing! 🧪
