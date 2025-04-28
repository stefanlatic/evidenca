import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs } from "firebase/firestore";
import HealthProgressCard from '../Utils/HealthProgressCard';
import WelcomeMessage from '../Utils/WelcomeMesage';
import AddRecordCard from '../Utils/AddRecordCard';
import RecordtableCard from '../Utils/RecordTableCard';
import AddAndListMedicationCard from '../Utils/AddAndListMedicationCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  
  const [hasShownEvents, setHasShownEvents] = useState(() => {
    return localStorage.getItem('hasShownEvents') === 'true';
  });
  const [hasShownMeds, setHasShownMeds] = useState(() => {
    return localStorage.getItem('hasShownMeds') === 'true';
  });
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchTodayEvents = async () => {
      if (!user || hasShownEvents) return;

      const today = new Date().toISOString().split('T')[0];

      const q = query(
        collection(db, "evidencije"),
        where("userId", "==", user.uid),
        where("date", "==", today)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const { name, type } = doc.data();
          toast.success(`📢 Danas je dan za: ${type} - ${name}`, {
            position: "top-center",
            autoClose: 8000,
          });
        });

        setHasShownEvents(true);
        localStorage.setItem('hasShownEvents', 'true');
      }
    };

    fetchTodayEvents();
  }, [user, hasShownEvents]);

  useEffect(() => {
    const fetchTodayMeds = async () => {
      if (!user || hasShownMeds) return;

      const today = new Date().toISOString().split("T")[0];

      const q = query(
        collection(db, "lekovi"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const medsForToday = {
        ujutru: [],
        podne: [],
        vece: []
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const startDate = data.date || data.createdAt?.toDate()?.toISOString().split("T")[0];

        if (startDate <= today) {
          Object.entries(data.times).forEach(([key, isChecked]) => {
            if (isChecked) {
              medsForToday[key].push(data.name);
            }
          });
        }
      });

      const toastTimes = {
        ujutru: "8:00",
        podne: "13:00",
        vece: "20:00",
      };

      Object.entries(medsForToday).forEach(([time, meds]) => {
        if (meds.length > 0) {
          toast.info(`⏰ ${toastTimes[time]} je! Vreme je za: ${meds.join(", ")}`, {
            position: "top-center",
            autoClose: 7000,
          });
        }
      });

      setHasShownMeds(true);
      localStorage.setItem('hasShownMeds', 'true');
    };

    fetchTodayMeds();
  }, [user, hasShownMeds]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  
  return (
    <>
    <div className="min-h-screen bg-blue-200 flex flex-col items-center">

    <div className='mt-7'>{userData ? <WelcomeMessage userData={userData} /> : <p>Učitavanje...</p>}</div>
    <div><HealthProgressCard /></div>
    <p className='text-center text-[#0550b3] font-medium mt-7'>Ako si kontaktirao/komunicirao sa svojim lekarom radi zakazivanja pregleda ili si bio na pregledu kod istog upiši svoju evidenciju!</p>
    
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
