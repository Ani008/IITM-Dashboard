// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ label, value, subLabel, color, icon, isLight, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${color} rounded-2xl p-5 flex items-center space-x-4 shadow-sm cursor-pointer 
      transition-transform active:scale-95 hover:opacity-90`} // Added feedback styles
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      <div>
        <div className={`text-2xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>
          {value}
        </div>
        <div className={`text-[10px] font-bold tracking-wider uppercase opacity-80 ${isLight ? 'text-gray-500' : 'text-white'}`}>
          {subLabel}
        </div>
      </div>
    </div>
  );
};

export default StatCard; // Add this line