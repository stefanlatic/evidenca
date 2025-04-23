import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import WelcomeMessage from '../Utils/WelcomeMesage';
import AddRecordCard from '../Utils/AddRecordCard';
import RecordtableCard from '../Utils/RecordTableCard';
import AddAndListMedicationCard from '../Utils/AddAndListMedicationCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, query, where, getDocs } from "firebase/firestore";



const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayEvents = async () => {
      const { uid } = user;
      const today = new Date().toISOString().split('T')[0]; // format: "YYYY-MM-DD"
  
      const q = query(
        collection(db, "evidencije"),
        where("userId", "==", uid),
        where("date", "==", today)
      );
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const { name, type } = doc.data();
        toast.success(`📢 Danas je dan za: ${type} - ${name}`, {
          position: "top-center",
          autoClose: 8000,
        });
      });
    };
  
    if (user) fetchTodayEvents();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    }; 

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
    <div className="min-h-screen bg-blue-200 flex flex-col items-center">

    <div className='mt-7'><WelcomeMessage /></div>
    <p className='text-center text-[#0550b3] font-medium mt-7'>Ako si kontaktirao/komunicirao sa svojim lekarom ili si bio na pregledu kod istog upiši svoju evidenciju!</p>
    
    <div className='flex flex-col lg:flex-row gap-6 px-4 lg:px-16 mt-6'>
    <div><AddRecordCard /></div>
    <div className='ml-10'><RecordtableCard /></div>
    </div>
    <p className='text-center text-[#0550b3] font-medium mt-7'>Da li Vam je prepisan/preporučen neki lek, suplement ili vitamin?</p>
    <div className='mt-7'><AddAndListMedicationCard /></div>
    <p className='text-center text-[#0550b3] font-medium mt-7 mb-10'>Bićete obavešteni porukom u vezi leka koji treba da popijete ujutru u 8h, oko podneva u 13h i naveče u 20h.</p>
    </div>
  </>
  );
};

export default Dashboard;
