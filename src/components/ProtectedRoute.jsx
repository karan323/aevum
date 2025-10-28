import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminIsAuthed } from '../lib/storage';

export default function ProtectedRoute({ children }) {
  if (!adminIsAuthed()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

