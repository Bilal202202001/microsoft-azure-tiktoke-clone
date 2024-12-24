import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './auth/AuthForm';
import DashboardLayout from './Dashboard/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Upload from './Dashboard/Upload/Upload';
import Profile from './Dashboard/Profile/Profile';
import Foryou from './Dashboard/Foryou/Foryou';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="" element={<Foryou />} />
          <Route path="upload" element={<Upload />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>


  );
}
