import React from 'react';

const CustomLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* Central container */}
      <div className="relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48">
        
        {/* Base white logo (subtle transparent version for background) */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            maskImage: 'url(/assets/loader/loader-logo.png)',
            WebkitMaskImage: 'url(/assets/loader/loader-logo.png)',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            backgroundColor: 'white'
          }}
        />
        
        {/* Filling logo animation (liquid effect) */}
        <div 
          className="absolute inset-0 animate-fill-logo" 
          style={{
            maskImage: 'url(/assets/loader/loader-logo.png)',
            WebkitMaskImage: 'url(/assets/loader/loader-logo.png)',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            backgroundColor: '#41F0A5' 
          }}
        />

        {/* Glow effect */}
        <div 
          className="absolute inset-0 blur-2xl opacity-40 animate-pulse bg-[#41F0A5]"
          style={{
            maskImage: 'url(/assets/loader/loader-logo.png)',
            WebkitMaskImage: 'url(/assets/loader/loader-logo.png)',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain'
          }}
        />

      </div>
    </div>
  );
};

export default CustomLoader;
