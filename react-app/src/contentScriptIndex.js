import React from 'react';
import ReactDOM from 'react-dom/client';
import './cursors/arrow1.png';
import './cursors/arrow2.png';
import './cursors/arrow3.png';
import './cursors/arrow4.png';
import ContentApp from './components/ContentApp';

// import reportWebVitals from './reportWebVitals';

const rootElement = document.createElement("div");
rootElement.id = "lump-link-app";
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ContentApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
