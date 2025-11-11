
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from './components/ui/toaster'

// Set dark mode as default
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
        <Toaster/>
    </Provider>
  </BrowserRouter>,
)
