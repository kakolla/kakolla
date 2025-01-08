import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import * as _THREE from 'three'
import ThreeScene from './ThreeScene.tsx'
import Title from './Title.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Title text='Abi Kakolla' />
    <ThreeScene />
    {/* <App /> */}
  </StrictMode>,
)
