import React, { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext'; 

const AddRecordCard = () => {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (selectedDate > today) {
      toast.info("Bićete obavešteni o ovom događaju na taj dan! 📅", {
        position: "top-center",
        autoClose: 5000,
      });
    }

    try {
      await addDoc(collection(db, "evidencije"), {
        type,
        name,
        date,
        details,
        createdAt: Timestamp.now(),  
        userId: user.uid

      });

      setMessage("✅ Evidencija uspešno sačuvana!");
      setType("");
      setName("");
      setDate("");
      setDetails("");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Greška pri snimanju:", error);
      setMessage("❌ Došlo je do greške. Pokušaj ponovo.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-2 sm:p-6 w-full max-w-full sm:max-w-md mx-auto text-[10px] sm:text-base">
      <h2 className="text-xs sm:text-xl font-semibold mb-4">Dodaj evidenciju</h2>

      {message && (
        <div className="mb-4 text-xs p-2 rounded bg-green-100 text-green-800">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-base">
        <div>
          <label htmlFor="type" className="block font-medium">Tip</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            required
          >
            <option value="">-- Izaberi tip --</option>
            <option value="Lekarski pregled">Lekarski pregled</option>
            <option value="Vakcinacija">Vakcinacija</option>
            <option value="Laboratorijski rezultati">Laboratorijski rezultati</option>
            <option value="Rehabilitacija i terapije">Rehabilitacija i terapije</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block font-medium">Naziv</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block font-medium">Datum</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="details" className="block font-medium">Detalji</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            rows="3"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded text-xs"
          >
            Otkaži
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded text-xs"
          >
            Sačuvaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordCard;
