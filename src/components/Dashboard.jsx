import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import WelcomeMessage from '../Utils/WelcomeMesage';
import AddRecordCard from '../Utils/AddRecordCard';
import RecordtableCard from '../Utils/RecordTableCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
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

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <>
    <div className="min-h-screen bg-blue-200 flex flex-col items-center">

    <div className='mt-7'><WelcomeMessage /></div>
    <p className='text-center text-[#0550b3] font-medium mt-7'>Ako si kontaktirao/komunicirao sa svojim lekarom ili si bio na pregledu kod istog upisi svoju evidenciju!</p>
    
    <div className='flex mt-7'>
    <div><AddRecordCard /></div>
    <div><RecordtableCard /></div>
    </div>
    </div>
  </>
  );
};

export default Dashboard;
