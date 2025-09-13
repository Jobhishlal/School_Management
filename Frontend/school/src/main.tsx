
import { createRoot } from 'react-dom/client'
import React from "react";
import './index.css'
import {store} from './store/index.ts'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
    <Provider store={store}>
       <BrowserRouter> 
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
