import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { db } from "../firebase/config"; 
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const HealthProgressCard = () => {
  const [showMedChart, setShowMedChart] = useState(false);
  const [medicationData, setMedicationData] = useState(Array(12).fill(0));
  const [evidencijaData, setEvidencijaData] = useState(Array(12).fill(0));
  const { user } = useAuth();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // === LEKOVI ===
      const lekoviRef = collection(db, 'lekovi');
      const q1 = query(lekoviRef, where('userId', '==', user.uid));
      const snapshot1 = await getDocs(q1);
      const newMedData = [...Array(12).fill(0)];

      onSnapshot(q1, (snapshot1) => {
        const newMedData = [...Array(12).fill(0)];
      
        snapshot1.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt;
          const times = data.times || {};
      
          if (!createdAt) return;
      
          const date = createdAt.toDate();
          const month = date.getMonth();
      
          let dnevno = 0;
          if (times.ujutru) dnevno++;
          if (times.podne) dnevno++;
          if (times.veče) dnevno++;
      
          newMedData[month] += dnevno;
        });
      
        setMedicationData(newMedData);
      });
      
      // === EVIDENCIJE ===
      const evidencijaRef = collection(db, 'evidencije');
      const q2 = query(evidencijaRef, where('userId', '==', user.uid));
      const snapshot2 = await getDocs(q2);
      const newEvData = [...Array(12).fill(0)];

      onSnapshot(q2, (snapshot2) => {
        const newEvData = [...Array(12).fill(0)];
      
        snapshot2.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt;
      
          if (!createdAt) return;
      
          const date = createdAt.toDate(); 
          const month = date.getMonth();
      
          newEvData[month]++;
        });
      
        setEvidencijaData(newEvData);
      });
      
    };

    fetchData();
  }, [user]);

  const barData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Broj evidencija',
        data: evidencijaData,
        backgroundColor: '#1e40af',
      },
    ],
  };

  const lineData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Broj lekova u toku dana',
        data: medicationData,
        fill: false,
        borderColor: '#e3342f',
        backgroundColor: '#e3342f',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-full h-500px w-[280px] sm:w-[500px] md:w-[700px] xl:w-[900px] max-w-6xl mx-auto px-1 sm:px-6 py-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-blue-800 mb-4">
        Tvoj napredak zdravlja!
      </h2>

      <div className="w-full  p-2">
        {showMedChart ? (
          <Line data={lineData} options={chartOptions} />
        ) : (
          <Bar data={barData} options={chartOptions} />
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setShowMedChart(!showMedChart)}
          className="text-sm flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showMedChart ? (
            <>
              ← <span className="ml-2 text-xs sm:text-sm sm:text-center">Grafikon evidencija</span>
            </>
          ) : (
            <>
              → <span className="ml-2 text-xs sm:text-sm sm:text-center">Grafikon lekova</span>
            </>
          )}
        </button>
        <p className="text-gray-500 text-xs sm:text-sm">
          {showMedChart ? 'Grafikon tvojih lekova' : 'Grafikon tvojih evidencija'}
        </p>
      </div>
    </div>
  );
};

export default HealthProgressCard;
