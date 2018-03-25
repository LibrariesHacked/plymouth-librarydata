// React
import React from 'react';
import ReactDOM from 'react-dom';

// Service worker for proper web app
import registerServiceWorker from './registerServiceWorker';

// Typeface and style to use throughout app
import 'typeface-roboto'
import './App.css';

// Our main app dashboard
import App from './App';

// Render the app into the root div
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();