import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Tailor</h1>
          <p className="text-gray-600 mb-6">
            AI-powered resume tailoring for job applications
          </p>
          <div className="text-6xl mb-4">📄</div>
          <p className="text-sm text-gray-500">
            This is the main web app. The Chrome extension popup is handled separately.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
