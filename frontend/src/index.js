import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { CarHiveContextProvider } from './context/carHiveContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <CarHiveContextProvider> */}
    <App />
    {/* </CarHiveContextProvider> */}

  </React.StrictMode>
);


