
export const generateTopLecturesData = () => {
  // More realistic tech/development lecture images
  const imageBase = 'https://images.unsplash.com/';
  const imageIds = [
    'photo-1546410531-bb4caa6b424d', // Person teaching/presenting
    'photo-1524178232363-1fb2b075b655', // Classroom setting
    'photo-1544531586-fde5298cdd40', // Person with laptop teaching
    'photo-1551818255-e6e10975bc17', // Tech conference presenter
    'photo-1588196749597-9ff075ee6b5b', // Programming instructor
    'photo-1531482615713-2afd69097998', // Tech workshop
    'photo-1560523159-4a9692d222f9', // Coding instructor
    'photo-1523240795612-9a054b0db644', // AI demonstration
    'photo-1517048676732-d65bc937f952', // Data analysis teaching
    'photo-1507537297725-24a1c029d3ca'  // Tech lecture
  ];
  
  // Course topics and names
  const titles = [
    'AI로 보는 세상: 딥러닝 기초',
    '프론트엔드 개발 마스터 클래스',
    '백엔드 아키텍처의 모든 것',
    'React와 NextJS 실전 프로젝트',
    '데이터 사이언스 완벽 가이드',
    '파이썬 머신러닝 실무 과정',
    '자바스크립트 고급 패턴과 성능 최적화',
    '클라우드 서비스 구축과 운영',
    'DevOps 엔지니어링 실무',
    '모던 웹 개발 완전정복'
  ];
  
  const instructors = [
    '김인공 교수',
    '박웹개발 강사',
    '정데이터 박사',
    '이프론트 선임개발자',
    '최백엔드 아키텍트',
    '강클라우드 엔지니어',
    '윤머신러닝 연구원',
    '조DevOps 전문가',
    '신풀스택 개발자',
    'AI 튜터 시스템'
  ];
  
  return Array(20).fill(null).map((_, idx) => {
    const titleIndex = idx % titles.length;
    const isAI = idx % 5 === 0;
    return {
      id: `top-lecture-${idx}`,
      title: titles[titleIndex] + (idx > 9 ? ` ${Math.floor(idx / 10) + 1}` : ''),
      instructor: isAI ? `AI 튜터 ${idx % 3}` : instructors[idx % instructors.length],
      image: `${imageBase}${imageIds[idx % imageIds.length]}?auto=format&fit=crop&w=600&q=80`,
      category: Math.floor(Math.random() * 10) < 5 ? 'frontend' : 'backend',
      rating: (4 + Math.random()).toFixed(1),
      price: (49000 + idx * 5000).toLocaleString(),
      bookmarks: Math.floor(Math.random() * 200) + 100,
      isAI: isAI,
      rank: idx + 1,
    }
  });
};
