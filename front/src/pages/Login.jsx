import React, { useState } from 'react';
import { Formik } from 'formik';
import { Input, Button, IconButton, Typography } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import { useUserLoginMutation } from '../app/authApi';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          try {
            const result = await userLogin(values).unwrap();
            toast.success('Logged in successfully!');
            const userData = { token: result.token, username: result.username, _id: result._id, bio: result.bio, profilePicture: result.profilePicture };
            localStorage.setItem('userInfo', JSON.stringify(userData));
            console.log('Saved to localStorage:', userData);
            navigate('/root');
          } catch (err) {
            toast.error(err.data?.message || 'Login failed');
          }
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                required
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                size="sm"
                variant="text"
                className="!absolute right-1 top-1 rounded"
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              </IconButton>
            </div>
            <Button type="submit" loading={isLoading}>
              Submit
            </Button>
          </form>
        )}
      </Formik>

      <Typography variant="small" color="gray" className="mt-4 text-center">
        Don't have an account?{' '}
        <Button variant="text" size="sm" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Typography>
    </div>
  );
}
