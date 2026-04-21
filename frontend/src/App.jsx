import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import SplashScreen3D from './components/SplashScreen/SplashScreen3D';
import { AppProvider } from './context/AppContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit transition after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Fully remove splash screen after 3 seconds
    const finishTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <AppProvider>
      {isLoading && <SplashScreen3D isExiting={isExiting} />}
      {!isLoading && (
        <div className="fade-in">
          <DashboardLayout />
        </div>
      )}
    </AppProvider>
  );
}

export default App;
