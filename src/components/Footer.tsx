
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Heart, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-ghibli-forest/90 text-white pt-16 pb-8 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Cloud className="h-6 w-6" />
              <h3 className="text-2xl font-handwritten font-bold">Aigongbu</h3>
            </div>
            <p className="text-ghibli-cloud/90 mb-6 max-w-md">
              모든 연령층에게 상상력과 경이로움을 불러일으키는 마법 같은 세계와 감동적인 이야기를 만들어갑니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-ghibli-cloud/90 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/company-info" className="text-ghibli-cloud/90 hover:text-white transition-colors">Company Info</Link>
              </li>
              <li>
                <Link to="/dev-lectures" className="text-ghibli-cloud/90 hover:text-white transition-colors">Development Courses</Link>
              </li>
              <li>
                <Link to="/ai-lectures" className="text-ghibli-cloud/90 hover:text-white transition-colors">AI Courses</Link>
              </li>
              <li>
                <Link to="/top-lectures" className="text-ghibli-cloud/90 hover:text-white transition-colors">Top Courses</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">연락처</h4>
            <ul className="space-y-2">
              <li className="text-ghibli-cloud/90">서울특별시 강남구 123</li>
              <li className="text-ghibli-cloud/90">마법의 숲, 12345</li>
              <li className="text-ghibli-cloud/90">contact@aigongbu.com</li>
              <li className="text-ghibli-cloud/90">02-123-4567</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-ghibli-cloud/90 text-sm mb-4 md:mb-0">
            &copy; 2025 Aigongbu. All rights reserved.
          </p>
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-ghibli-cloud/90 text-sm">사랑과</span>
            <Heart className="h-4 w-4 mx-1 text-ghibli-sunset" />
            <span className="text-ghibli-cloud/90 text-sm">상상력으로 만들었습니다</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
