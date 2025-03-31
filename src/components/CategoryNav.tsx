
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Database, Server, Cpu, PenTool, Video, Megaphone, Robot } from 'lucide-react';

const categories = [
  { 
    id: 'frontend', 
    name: '프론트엔드', 
    icon: Code,
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-blue-200',
  },
  { 
    id: 'backend', 
    name: '백엔드', 
    icon: Server,
    color: 'bg-green-100 text-green-600',
    borderColor: 'border-green-200',
  },
  { 
    id: 'data', 
    name: '데이터 사이언스', 
    icon: Database,
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200',
  },
  { 
    id: 'ai', 
    name: 'AI 강의', 
    icon: Robot,
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-orange-200',
  },
  { 
    id: 'devops', 
    name: 'DevOps', 
    icon: Cpu,
    color: 'bg-red-100 text-red-600',
    borderColor: 'border-red-200',
  },
  { 
    id: 'design', 
    name: '디자인', 
    icon: PenTool,
    color: 'bg-pink-100 text-pink-600',
    borderColor: 'border-pink-200',
  },
  { 
    id: 'video', 
    name: '영상 편집', 
    icon: Video,
    color: 'bg-yellow-100 text-yellow-600',
    borderColor: 'border-yellow-200',
  },
  { 
    id: 'marketing', 
    name: '마케팅', 
    icon: Megaphone,
    color: 'bg-indigo-100 text-indigo-600',
    borderColor: 'border-indigo-200',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const CategoryNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'ai') {
      navigate('/ai-courses');
    } else {
      navigate('/dev-courses', { state: { selectedCategory: categoryId } });
    }
  };
  
  return (
    <div className="py-10">
      <h2 className="text-2xl md:text-3xl font-handwritten text-center text-ghibli-forest mb-8">
        카테고리별 강의 살펴보기
      </h2>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {categories.map(category => (
          <motion.div
            key={category.id}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border ${category.borderColor} ${category.color} cursor-pointer transition-all hover:shadow-md`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-3 rounded-full bg-white mb-3">
              <category.icon className={`h-6 w-6 ${category.color.split(' ')[1]}`} />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryNav;
