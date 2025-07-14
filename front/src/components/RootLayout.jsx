import React from 'react';
import { Outlet, Link } from 'react-router-dom';


const RootLayout = () => {
  return (
    <div>
      <header style={{ padding: '1rem', backgroundColor: '#eee' }}>
        <nav>
          <Link to="/root" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="userprofile" style={{ marginRight: '1rem' }}>userprofile</Link>
          <Link to="post" style={{ marginRight: '1rem' }}>Post</Link>
          <Link to="/logout" style={{ marginRight: '1rem' }}>Logout</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

    </div>
  );
};

export default RootLayout;
