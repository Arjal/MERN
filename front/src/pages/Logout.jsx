import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully!');
    navigate('/login');
  }, [navigate]);

  return null;
}
