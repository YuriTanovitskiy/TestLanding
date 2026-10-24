import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './LanguageProvider'
import { initializeAnalytics } from './analytics'
import { initializeOwnerMode } from './ownerMode'

initializeOwnerMode()
initializeAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider><App /></LanguageProvider>
  </StrictMode>,
)
