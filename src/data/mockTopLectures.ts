
export const generateTopLecturesData = () => {
  const imageBase = 'https://images.unsplash.com/photo-';
  const imageIds = [
    '1498050108023-c5249f4df085',
    '1461749280684-dccba630e2f6',
    '1488590528505-98d2b5aba04b',
    '1486312338219-ce68d2c6f44d',
    '1487058792275-0ad4aaf24ca7',
    '1605810230434-7631ac76ec81',
    '1519389950473-47ba0277781c',
    '1581091226825-a6a2a5aee158',
    '1649972904349-6e44c42644a7',
    '1636622496845-a82f090384b3'
  ];
  
  return Array(20).fill(null).map((_, idx) => ({
    id: `top-lecture-${idx}`,
    title: `인기 강의 ${idx + 1}`,
    instructor: idx % 3 === 0 ? `AI 튜터 ${idx % 10}` : `김강사 ${idx % 10}`,
    image: `${imageBase}${imageIds[idx % imageIds.length]}?auto=format&fit=crop&w=600&q=80`,
    category: Math.floor(Math.random() * 10) < 5 ? 'frontend' : 'backend',
    rating: (4 + Math.random()).toFixed(1),
    price: (15000 + idx * 500).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 200) + 100,
    isAI: idx % 3 === 0,
    rank: idx + 1,
  }));
};
