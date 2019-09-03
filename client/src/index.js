import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

// React
import React from 'react';
import ReactDOM from 'react-dom';

// Typeface and style to use throughout app
import './App.css';
import 'typeface-roboto';

// Our main app dashboard
import App from './App';

// Render the app into the root div
ReactDOM.render(<App />, document.getElementById('root'));
