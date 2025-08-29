import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./translation/i18n";
import './styles/index.css'
import { App } from '../components/App';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
