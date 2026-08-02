import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill crypto.randomUUID for mobile devices without HTTPS
if (!window.crypto) window.crypto = {};
if (!window.crypto.randomUUID) {
  window.crypto.randomUUID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
}
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
