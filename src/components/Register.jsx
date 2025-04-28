import React from 'react';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const today = new Date();
    const birthDate = new Date(data.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 14) {
      alert('Morate imati najmanje 14 godina da biste se registrovali.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        birthDate: data.birthDate,
        email: data.email,
      });

      navigate('/dashboard');
    } catch (error) {
      alert('Greška prilikom registracije: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-4">
          <img src="/avatar.jpg" alt="avatar" className="h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Registracija</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            className="w-full p-2 rounded-md border border-gray-300"
            placeholder="Ime"
            {...register("name", { required: "Ime je obavezno" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="date"
            className="w-full p-2 rounded-md border border-gray-300"
            {...register("birthDate", { required: "Datum rođenja je obavezan" })}
          />
          {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md border border-gray-300"
            {...register("email", {
              required: "Email je obavezan",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Neispravan email",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Lozinka"
            className="w-full p-2 rounded-md border border-gray-300"
            {...register("password", {
              required: "Lozinka je obavezna",
              minLength: {
                value: 6,
                message: "Lozinka mora imati najmanje 6 karaktera",
              },
            })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input
            type="password"
            placeholder="Ponovite lozinku"
            className="w-full p-2 rounded-md border border-gray-300"
            {...register("confirmPassword", {
              required: "Potvrda lozinke je obavezna",
              validate: (value, formValues) =>
                value === formValues.password || "Lozinke se ne poklapaju",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
          >
            Registruj se
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
