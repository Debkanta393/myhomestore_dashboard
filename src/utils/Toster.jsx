import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';


export const Toster = ({ message, type, onClose }) => {
    useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 min-w-[320px] px-6 py-4 rounded-lg shadow-2xl ${
        type === 'success' 
          ? 'bg-green-800 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 flex-shrink-0" />
        )}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};