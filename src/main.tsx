import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import init from './wasm'

const render = async () => {
  await init()
  const App = await import('./App.tsx')

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App.default />
    </React.StrictMode>
  )
}

render()
