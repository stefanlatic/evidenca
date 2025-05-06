import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AddAndListMedicationCard = () => {
  const { user } = useAuth();
  const [medName, setMedName] = useState("");
  const [times, setTimes] = useState({ ujutru: false, podne: false, veče: false });
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "lekovi"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedications(data);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleAddMedication = async () => {
    if (!medName.trim()) return;
    try {
        await addDoc(collection(db, "lekovi"), {
            name: medName.trim(),
            times: { ...times },
            date: new Date().toISOString().split("T")[0], 
            createdAt: serverTimestamp(),
            userId: user.uid,
          });
          
      setMedName("");
      setTimes({ ujutru: false, podne: false, veče: false });
    } catch (error) {
      console.error("Greška pri dodavanju leka:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Da li želite da obrišete ovaj lek?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "lekovi", id));
      } catch (error) {
        console.error("Greška pri brisanju:", error);
      }
    }
  };

  const handleCheckboxChange = (time) => {
    setTimes((prev) => ({ ...prev, [time]: !prev[time] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md py-6 px-4 sm:px-8 w-full">
      <h2 className="text-sm sm:text-xl font-semibold mb-4">Dodaj novi lek, suplement ili vitamin</h2>

      <input
        value={medName}
        onChange={(e) => setMedName(e.target.value)}
        placeholder="Naziv leka..."
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <div className="flex gap-6 mb-4">
        {["ujutru", "podne", "veče"].map((time) => (
          <label key={time} className="flex items-center gap-2 text-gray-700 capitalize">
            <input
              type="checkbox"
              checked={times[time]}
              onChange={() => handleCheckboxChange(time)}
              className="accent-blue-500"
            />
            {time}
          </label>
        ))}
      </div>

      <button
        onClick={handleAddMedication}
        className="bg-blue-600 text-xs sm:text-base text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Sačuvaj
      </button>

     
      <div className=" text-xs sm:text-base mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {["ujutru", "podne", "veče"].map((time) => (
      <div key={time} className="bg-blue-50 p-4 rounded shadow-sm">
      <h3 className="text-xs sm:text-base font-semibold capitalize text-blue-700 mb-2">
        {time}
      </h3>
      {medications.filter((m) => m.times[time]).length === 0 ? (
        <p className="text-xs sm:text-base text-gray-500 italic">Nema lekova za ovo vreme.</p>
      ) : (
        <ul className="space-y-2">
          {medications
            .filter((m) => m.times[time])
            .map((med) => (
              <li
                key={med.id}
                className="flex justify-between items-center bg-white px-3 py-2 rounded"
              >
                <span>{med.name}</span>
                <button
                    onClick={() => handleDelete(med.id)}
                    className="text-red-500 text-xs sm:text-base hover:opacity-70 ml-3"
                    title="Obriši"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default AddAndListMedicationCard;
