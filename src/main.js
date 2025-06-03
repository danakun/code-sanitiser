import './styles/style.css';
import { setupCounter } from './components/counter.js';
import { renderApp } from './components/app.js';

// Initialize the application
renderApp();

// Setup counter functionality
setupCounter(document.querySelector('#counter'));