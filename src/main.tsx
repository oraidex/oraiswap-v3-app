import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import init from '@wasm'
import SingletonOraiswapV3 from '@store/services/contractSingleton.ts'
;(async () => {
  await init()
  const App = await import('./App.tsx')

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App.default />
    </React.StrictMode>
  )
})()
