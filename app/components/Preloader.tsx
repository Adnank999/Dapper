// 'use client'
// import React, { useEffect, useState } from 'react';
// import SvgIcon from './aboutComponents/SvgIcon';

// const Preloader = () => {
//     const [loading, setLoading] = useState(true);
// const [isActive, setIsActive] = useState(false);
//   useEffect(() => {
//      setIsActive(true);
//     // Set a timeout to hide the preloader after a certain amount of time
//     const timer = setTimeout(() => {
//       setLoading(false);
//       setIsActive(false);
//     }, 5000); // Change 3000 to the desired loading time in milliseconds

//     return () => clearTimeout(timer); // Cleanup the timer on component unmount
//   }, []);

//   return (
//     <div className={`preloader ${isActive ? 'visible' : 'hidden'}`}>
//       <SvgIcon className={isActive ? 'active' : ''} /> 
//     </div>
    
//   );
// };

// export default Preloader;


'use client';
import React, { useEffect, useState } from 'react';
import SvgIcon from './aboutComponents/SvgIcon';

const Preloader = () => {
  const [isMounted, setIsMounted] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);

    const animationTimer = setTimeout(() => {
      setIsActive(false); // Start fade-out
    }, 2500);

    const unmountTimer = setTimeout(() => {
      setIsMounted(false); // Optional if Preloader should self-remove
    }, 2000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`preloader ${isActive ? 'visible' : 'hidden'}`}>
     
         <SvgIcon className={`${isActive ? 'active' : ''} ml-30 `} />
      
     
      <div className="loading-text ml-20 lg:ml-24 text-5xl md:text-6xl lg:text-8xl font-akoni">Loading...</div>
    </div>
  );
};

export default Preloader;
