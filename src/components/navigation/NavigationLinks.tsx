
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks: React.FC = () => {
  return (
    <>
      <Link to="/" className="nav-link">홈</Link>
      <Link to="/company-info" className="nav-link">회사정보</Link>
      <Link to="/dev-lectures" className="nav-link">개발강의</Link>
      <Link to="/ai-lectures" className="nav-link">AI 강의</Link>
      <Link to="/top-lectures" className="nav-link">인기강의</Link>
    </>
  );
};

export default NavigationLinks;
