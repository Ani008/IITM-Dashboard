// src/components/ListItem.jsx
import React from 'react';

const ListItem = ({ title, slides, isPublic }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-yellow-400 rounded-xl overflow-hidden">
        {/* Placeholder for Image */}
      </div>
      <div>
        <h4 className="font-bold text-blue-900">{title}</h4>
        <p className="text-xs text-gray-400 italic">Sint occaecat cupidatat non proident...</p>
        <span className="text-[10px] font-bold text-gray-800 mt-1 block">{slides} Slides</span>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400">{isPublic ? 'Public' : 'Private'}</span>
        <div className={`w-8 h-4 rounded-full relative ${isPublic ? 'bg-blue-700' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isPublic ? 'right-1' : 'left-1'}`}></div>
        </div>
      </div>
      <div className="flex gap-2 text-gray-300">
         <span className="cursor-pointer hover:text-gray-600 text-lg">✎</span>
         <span className="cursor-pointer hover:text-red-400 text-lg">🗑</span>
      </div>
    </div>
  </div>
);

export default ListItem; // Add this line