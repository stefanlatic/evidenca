import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; 

const RecordTableCard = () => {
  const [records, setRecords] = useState([]);
  const { user, loading  } = useAuth(); 
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Da li ste sigurni da želite da izbrišete evidenciju?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "evidencije", id));
      } catch (error) {
        console.error("Greška pri brisanju:", error);
      }
    }
  };

  useEffect(() => {
    if (loading || !user?.uid) return;

    const q = query(
      collection(db, "evidencije"),
      where("userId", "==", user.uid), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(data);
    });

    return () => unsubscribe(); 
  },[user?.uid, loading]);

  return (
    <>
    <div className="bg-white rounded-xl shadow-md p-2 sm:p-4 text-[10px] sm:text-base w-full overflow-auto text-[10px] sm:text-base">
    <h2 className="text-sm sm:text-xl font-semibold mb-4">Sve Evidencije</h2>
  
    {records.length === 0 ? (
      <p className="text-gray-500">Nema unetih evidencija još uvek.</p>
    ) : (
      <table className="w-full text-[10px] sm:text-base text-left text-gray-700 break-words">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="py-2 px-2 sm:px-4">Tip</th>
            <th className="py-2 px-2 sm:px-4">Naziv</th>
            <th className="py-2 px-2 sm:px-4">Datum</th>
            <th className="py-2 px-2 sm:px-4">Detalji</th>
            <th className="py-2 px-2 sm:px-4">Akcija</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-2 sm:px-4 font-semibold">{record.type}</td>
              <td className="py-2 px-2 sm:px-4">{record.name}</td>
              <td className="py-2 px-2 sm:px-4">{record.date}</td>
              <td className="py-2 px-2 sm:px-4 break-words max-w-[120px] sm:max-w-xs">{record.details}</td>
              <td className="py-2 px-2 sm:px-4">
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  </>
  )
};

export default RecordTableCard;
