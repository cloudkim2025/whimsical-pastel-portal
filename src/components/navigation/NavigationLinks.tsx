
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks: React.FC = () => {
  return (
    <>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/company-info" className="nav-link">Company Info</Link>
      <Link to="/dev-lectures" className="nav-link">Development Courses</Link>
      <Link to="/ai-lectures" className="nav-link">AI Courses</Link>
      <Link to="/top-lectures" className="nav-link">Top Courses</Link>
    </>
  );
};

export default NavigationLinks;
