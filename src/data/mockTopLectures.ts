
export const generateTopLecturesData = () => {
  return Array(20).fill(null).map((_, idx) => ({
    id: `top-lecture-${idx}`,
    title: `인기 강의 ${idx + 1}`,
    instructor: idx % 3 === 0 ? `AI 튜터 ${idx % 10}` : `김강사 ${idx % 10}`,
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=top${idx}`,
    category: Math.floor(Math.random() * 10) < 5 ? 'frontend' : 'backend',
    rating: (4 + Math.random()).toFixed(1),
    price: (15000 + idx * 500).toLocaleString(),
    bookmarks: Math.floor(Math.random() * 200) + 100,
    isAI: idx % 3 === 0,
    rank: idx + 1,
  }));
};
