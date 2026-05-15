import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="21270272793-b9e60m9r3aub55i1qnbjb2k9bv6trnga.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)