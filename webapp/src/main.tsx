/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'

// Import your Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ClerkProvider>
  </React.StrictMode>,
)
