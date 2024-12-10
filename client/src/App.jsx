import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './auth/AuthForm';
import DashboardLayout from './Dashboard/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Foryou from './Dashboard/ForYou';
import Upload from './Dashboard/Upload/Upload';
import Following from './Dashboard/Following/Following';
import Profile from './Dashboard/Profile/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="" element={<Foryou />} />
          <Route path="following" element={<Following />} />
          <Route path="upload" element={<Upload />} />
          <Route path="profile" element={<Profile />} />
          {/* <Route path="credentials" element={<JiraCredentials />} />
          <Route path="users" element={<Users />} />
          <Route path="projects" element={<Projects />} /> */}
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
