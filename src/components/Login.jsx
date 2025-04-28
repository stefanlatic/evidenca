import React from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Ako korisnik još nema dokument, kreiraj ga
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "Nepoznato",
          email: user.email,
          birthDate: "", // Nemamo datum rodjenja sa Google-a
        });
      }

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
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
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
