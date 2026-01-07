import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='font-primary w-full bg-[#F3F5F9]'>
      <App />
    </div>
  </StrictMode>,
)
