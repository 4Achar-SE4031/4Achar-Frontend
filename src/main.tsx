import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
// import { router } from './routes/Routes.tsx'
import { router } from './app/router/Routes'
// import "./fonts/iransansweb.ttf"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
