import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import RootLayout from './components/RootLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Post from './pages/Post'
import UserProfile from './pages/UserProfile';
import UpdateUser from './pages/Updateuser';
import Logout from './pages/Logout';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/login" />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/root',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'profile/:id', element: <Profile /> },
        { path: 'post', element: <Post /> },
        { path: 'userprofile', element: <UserProfile /> },
        { path: 'Updateuser/:id', element: <UpdateUser /> }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
