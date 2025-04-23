import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const HealthProgressCard = () => {
  const { user } = useAuth();
  const [showMedGraph, setShowMedGraph] = useState(false);
  const [evidencijaData, setEvidencijaData] = useState(Array(12).fill(0));
  const [lekoviData, setLekoviData] = useState(Array(12).fill(0));

  useEffect(() => {
    const evidQuery = query(collection(db, "evidencije"), where("userId", "==", user.uid));
    const medsQuery = query(collection(db, "lekovi"), where("userId", "==", user.uid));

    const unsubEvidencije = onSnapshot(evidQuery, (snapshot) => {
      const monthCounts = Array(12).fill(0);
      snapshot.forEach((doc) => {
        const date = doc.data().datum?.toDate?.();
        if (date) {
          const month = date.getMonth();
          monthCounts[month]++;
        }
      });
      setEvidencijaData(monthCounts);
    });

    const unsubLekovi = onSnapshot(medsQuery, (snapshot) => {
      const monthCounts = Array(12).fill(0);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const created = data.createdAt?.toDate?.();
        if (created) {
          const month = created.getMonth();
          const times = data.times || {};
          const count = Object.values(times).filter(Boolean).length;
          monthCounts[month] += count;
        }
      });
      setLekoviData(monthCounts);
    });

    return () => {
      unsubEvidencije();
      unsubLekovi();
    };
  }, [user.uid]);

  const labels = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

  const evidOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 0 } },
    },
  };

  const lekoviOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { maxRotation: 0 } },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md px-6 py-8 w-full max-w-6xl mx-auto mt-10 relative">
      <h2 className="text-center text-2xl font-semibold text-blue-800 mb-6">Tvoj napredak zdravlja!</h2>

      <div className="h-[360px] md:h-[400px]">
        {showMedGraph ? (
          <Line data={{ labels, datasets: [{ label: '', data: lekoviData, borderColor: '#DC2626', backgroundColor: '#DC2626', tension: 0.3 }] }} options={lekoviOptions} />
        ) : (
          <Bar data={{ labels, datasets: [{ label: '', data: evidencijaData, backgroundColor: '#1D4ED8', borderRadius: 5 }] }} options={evidOptions} />
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setShowMedGraph(!showMedGraph)}
          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xl"
        >
          {showMedGraph ? "←" : "→"}
        </button>
        <p className="text-sm text-gray-600">
          {showMedGraph ? "Grafikon tvojih lekova" : "Grafikon tvojih evidencija"}
        </p>
        <div className="w-10" />
      </div>
    </div>
  );
};

export default HealthProgressCard;
