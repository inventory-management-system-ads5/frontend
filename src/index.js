import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './app';
import Suppliers from './pages/supplier/suppliers';
import SignIn from './pages/signIn/signIn';
import SignUp from './pages/signUp/signUp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/supplier/" element={<Suppliers />} />
        <Route path="/signin/" element={<SignIn />} />
        <Route path="/signup/" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
