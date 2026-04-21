import React from 'react';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}

export default App;
