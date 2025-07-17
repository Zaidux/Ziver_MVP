import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const layoutStyle = {
  // Add padding to the bottom to ensure content isn't hidden by the nav bar
  paddingBottom: '70px', 
  minHeight: '100vh',
};

function MainAppLayout() {
  return (
    <div style={layoutStyle}>
      <main>
        {/* The current page (Mining, Tasks, etc.) will be rendered here */}
        <Outlet /> 
      </main>
      <BottomNav />
    </div>
  );
}

export default MainAppLayout;
