import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, History } from "lucide-react";

const RecentActivity = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/activitylogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(res.data.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <History size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          System Activity Logs
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {logs.map((log) => (
          <div
            key={log._id}
            className="flex items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition"
          >
            {/* 1. Using your backend virtual 'formattedTime' instead of manual formatting */}
            <div className="w-32 text-sm font-mono text-slate-400">
              {log.formattedTime}
            </div>

            <div className="flex-1">
              {/* 2. Display the detailed description instead of just the action keyword */}
              <p className="text-slate-700 font-medium">
                {log.description}
              </p>
              {/* Optional: Show the action as a small badge if you want both */}
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                {log.action}
              </span>
            </div>

            <div className="text-xs text-slate-400 italic">
              {new Date(log.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;