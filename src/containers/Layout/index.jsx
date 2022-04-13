import React, { useState, useEffect, createRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { StyledLayout } from './index.style';

export default function Layout({ children }) {
  const mainPanel = createRef();

  useEffect(() => {
    document.body.style.overflow = 'unset';
    return function cleanup() {};
  });

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((prevValue) => !prevValue);
  };

  return (
    <StyledLayout collapsed={collapsed}>
      <Sidebar collapsed={collapsed} toggle={toggle} />
      <div className="main" ref={mainPanel}>
        <div className="navbar">
          <Navbar />
        </div>
        {children}
      </div>
    </StyledLayout>
  );
}
