import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    if (user?.uid) {
      localStorage.setItem('hasShownEvents', 'false');
      localStorage.setItem('hasShownMeds', 'false');
      setHasShownEvents(false);
      setHasShownMeds(false);
    }
  }, [user?.uid]);


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
            className:"text-xs p-4 sm:text-sm sm:p-6 md:text-md md:p-8 lg:text-lg xl:text-xl" ,
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
  
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentHour = now.getHours();
  
      const q = query(
        collection(db, "lekovi"),
        where("userId", "==", user.uid)
      );
  
      const querySnapshot = await getDocs(q);
  
      const medsForToday = {
        ujutru: [],
        podne: [],
        veče: []
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
  
      
      if (currentHour >= 8 && medsForToday.ujutru.length > 0 && !hasNotificationBeenShown("ujutru")) {
        toast.info(`⏰ 8:00 je! Vreme je za: ${medsForToday.ujutru.join(", ")}`, {
          position: "top-center",
          autoClose: 7000,
          className:"text-xs p-4 sm:text-sm sm:p-6 md:text-md md:p-8 lg:text-lg xl:text-xl" ,
        });
        markNotificationAsShown("ujutru");
      }
      
      if (currentHour >= 13 && medsForToday.podne.length > 0 && !hasNotificationBeenShown("podne")) {
        toast.info(`⏰ 13:00 je! Vreme je za: ${medsForToday.podne.join(", ")}`, {
          position: "top-center",
          autoClose: 7000,
          className:"text-xs p-4 sm:text-sm sm:p-6 md:text-md md:p-8 lg:text-lg xl:text-xl" ,
        });
        markNotificationAsShown("podne");
      }
      
      if (currentHour >= 20 && medsForToday.veče.length > 0 && !hasNotificationBeenShown("veče")) {
        toast.info(`⏰ 20:00 je! Vreme je za: ${medsForToday.veče.join(", ")}`, {
          position: "top-center",
          autoClose: 7000,
          className:"text-xs p-4 sm:text-sm sm:p-6 md:text-md md:p-8 lg:text-lg xl:text-xl" ,
        });
        markNotificationAsShown("veče");
      };
      
      setHasShownMeds(true);
      localStorage.setItem("hasShownMeds", "true");
      localStorage.setItem("shownDate", today); 
    };
    const hasNotificationBeenShown = (key) => {
      const shownData = JSON.parse(localStorage.getItem('shownMeds') || '{}');
      const today = new Date().toISOString().split("T")[0];
      return shownData[key] === today;
    };
    
    const markNotificationAsShown = (key) => {
      const shownData = JSON.parse(localStorage.getItem('shownMeds') || '{}');
      const today = new Date().toISOString().split("T")[0];
      shownData[key] = today;
      localStorage.setItem('shownMeds', JSON.stringify(shownData));
    };
    
    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("shownDate");
  
    if (lastShown !== today) {
      localStorage.removeItem("hasShownMeds");
      localStorage.setItem("shownDate", today);
      setHasShownMeds(false);
    }
  
    fetchTodayMeds();
  }, [user, hasShownMeds]);
  
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };
  
  return (
    <>
    <div className="min-h-screen bg-blue-200 flex flex-col items-center">

    <div className='text-[10px] sm:text-[16px] md:text-lg mt-7 mx-3 sm:mx-6 md:mx-20 lg:mx-60 '>{userData ? <WelcomeMessage userData={userData} /> : <p></p>}</div>
    <div className='p-3'><HealthProgressCard /></div>
    <p className='text-sm sm:text-lg text-center text-[#0550b3]  font-medium mt-7 px-3'>Ako si kontaktirao/komunicirao sa svojim lekarom radi zakazivanja pregleda ili si bio na pregledu kod istog upiši svoju evidenciju!</p>
    
    <div className='flex flex-col lg:flex-row gap-6 px-2 sm:px-4 lg:px-16 mt-7 w-full max-w-screen'>
    <div className="w-full lg:w-1/3"><AddRecordCard /></div>
    <div className="w-full lg:w-2/3"><RecordtableCard /></div>
    </div>
    <p className='text-sm sm:text-lg text-center text-[#0550b3] font-medium mt-7 px-3'>Da li Vam je prepisan/preporučen neki lek, suplement ili vitamin?</p>
    <div className='mt-7'><AddAndListMedicationCard /></div>
    <p className='text-sm sm:text-lg text-center text-[#0550b3] font-medium mt-7 mb-10 px-3'>Bićete obavešteni porukom u vezi leka koji treba da popijete ujutru u 8h, oko podneva u 13h i naveče u 20h.</p>
    </div> 
  </> 
  );
};

export default Dashboard;     
