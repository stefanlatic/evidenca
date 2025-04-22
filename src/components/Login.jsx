import React from 'react';
import { useForm } from 'react-hook-form';
import {  signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      alert('Greška pri logovanju: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      alert('Greška pri Google prijavi: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Prijava</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input 
            type="email" 
            {...register('email', { required: 'Email je obavezan' })} 
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input 
            type="password" 
            {...register('password', { required: 'Lozinka je obavezna' })} 
            placeholder="Lozinka" 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Prijavi se
          </button>
        </form>
        <div className="mt-4 text-center">
        <Link to="/forgot-password" className=" text-blue-500 hover:underline">
            Zaboravljena lozinka?
        </Link>
        </div>
        <div className="mt-4 text-center">
       
          <button onClick={handleGoogleLogin} className="text-blue-600 hover:underline">
            Prijavi se putem Google-a
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
