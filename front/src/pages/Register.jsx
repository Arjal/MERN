import React, { useState } from 'react';
import { Formik } from 'formik';
import { Input, Button, IconButton, Typography } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import { useUserSignUpMutation } from '../app/authApi';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [userSignUp, { isLoading }] = useUserSignUpMutation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-[400px] mt-20 mx-auto">
      <Typography variant="h4" className="text-center font-semibold mb-8">
        Create an Account
      </Typography>

      <Formik
        initialValues={{
          username: '',
          email: '',
          password: ''
        }}
        onSubmit={async (val) => {
          try {
            await userSignUp(val).unwrap();
            toast.success('Registered successfully!');
            navigate('/login');
          } catch (err) {
            toast.error(err.data?.message || 'Registration failed');
          }
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <form onSubmit={handleSubmit}
            className="space-y-6">

            <div>
              <Input
                onChange={handleChange}
                value={values.username}
                label='Username'
                name="username"
              />
            </div>

            <div>
              <Input
                onChange={handleChange}
                value={values.email}
                name="email"
                type="email"
                label='Email'
              />
            </div>
            <div>
              <Input
                onChange={handleChange}
                name="password"
                value={values.password}
                type={showPassword ? 'text' : 'password'}
                label='Password'
                className="pr-12"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                variant="text"
                size="sm"
                className="!absolute right-1 top-1 rounded">
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              </IconButton>

            </div>



            <Button loading={isLoading} type="submit">
              Submit
            </Button>
          </form>
        )}
      </Formik>

      <Typography variant="small" color="gray" className="mt-4 text-center">
        Already have an account?{' '}
        <Button variant="text" size="sm" onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:underline">
          Login
        </Button>
      </Typography>
    </div >
  );
}
