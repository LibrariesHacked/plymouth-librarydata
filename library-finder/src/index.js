import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './App.css';

// Typeface to use throughout app
import 'typeface-roboto'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();