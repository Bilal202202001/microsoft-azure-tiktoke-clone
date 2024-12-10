import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import JqlConverter from './Dashboard/QueryConverter/JqlConverter';
import AuthForm from './auth/AuthForm';
import JiraCredentials from './Dashboard/Credentials/JiraCredentials';
import DashboardLayout from './Dashboard/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard/Dashboard';
import Users from './Dashboard/Users/Users';
import Projects from './Dashboard/Projects/Projects';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="foryou" element={<Dashboard />} />
          <Route path="credentials" element={<JiraCredentials />} />
          <Route path="haab" element={<JqlConverter />} />
          <Route path="users" element={<Users />} />
          <Route path="projects" element={<Projects />} />
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
