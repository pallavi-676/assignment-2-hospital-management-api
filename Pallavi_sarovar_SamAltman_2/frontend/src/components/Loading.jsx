import React from 'react';

const Loading = ({ fullScreen = false, message = 'Loading healthcare data...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-9 h-9 rounded-full border-3 border-[#CCEEF0] border-t-[#0D5C63] animate-spin mb-3"></div>
      {message && <p className="text-xs font-semibold text-[#5A7175]">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FDFD]/90 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
