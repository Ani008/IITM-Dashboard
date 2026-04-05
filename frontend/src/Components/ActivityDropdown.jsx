import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // Optional: npm install date-fns

const ActivityDropdown = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Retrieve your token (make sure the key matches what you used at login)
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/activitylogs?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`, // This fixes the 401 error
            },
          },
        );
        setLogs(res.data.data);
      } catch (err) {
        console.error("Auth error:", err.response.status);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Recent Activity
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log._id}
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
            >
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {log.action}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-xs text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDropdown;
