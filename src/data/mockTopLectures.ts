
export const generateTopLecturesData = () => {
  // Using the provided instructor images
  const uploadedImages = [
    'public/lovable-uploads/54a601ec-8297-4281-9f86-96314a37d694.png', // AI로 보는 세상
    'public/lovable-uploads/872cdf2e-5e57-4437-9d56-e3d9de32f64e.png', // OAuth2 로그인
    'public/lovable-uploads/f3deb0c3-69a6-4303-938a-b75ec8a7156a.png', // AWS 클라우드
    'public/lovable-uploads/5058af0f-6ce4-43e0-999f-79c23b02bfe6.png', // iOS 앱 개발
    'public/lovable-uploads/377ae563-df7f-443f-94fd-8ff42f1b5220.png', // REST API
    'public/lovable-uploads/dbeefc26-dadd-4789-9a11-87c800bc1f06.png', // REST API 2
    'public/lovable-uploads/9b530af4-f3e8-4917-a3ea-b2572b23abfd.png', // Vue 3
    'public/lovable-uploads/0091da42-215f-49f1-aec1-327c8338951c.png'  // 스프링 부트
  ];
  
  // Course topics and names
  const titles = [
    'AI로 보는 세상: 딥러닝 기초',
    'OAuth2 로그인 시스템 구현',
    'AWS로 시작하는 클라우드 인프라',
    'iOS 앱 개발 입문',
    'REST API 설계와 보안',
    'Vue 3 완전 입문',
    '스프링 부트로 시작하는 백엔드 개발',
    'REST API 고급 기술',
    'React와 NextJS 실전 프로젝트',
    '데이터 사이언스 완벽 가이드'
  ];
  
  const instructors = [
    '김인공 교수',
    '박웹개발 강사',
    '이클라우드 아키텍트',
    '최모바일 개발자',
    '정백엔드 개발자',
    '강프론트엔드 개발자',
    '스프링 전문가',
    'AI 튜터 시스템',
    '풀스택 개발자',
    '데이터 사이언스 박사'
  ];
  
  return Array(20).fill(null).map((_, idx) => {
    const titleIndex = idx % titles.length;
    const isAI = idx % 5 === 0;
    return {
      id: `top-lecture-${idx}`,
      title: titles[titleIndex] + (idx > 9 ? ` ${Math.floor(idx / 10) + 1}` : ''),
      instructor: isAI ? `AI 튜터 ${idx % 3}` : instructors[idx % instructors.length],
      image: uploadedImages[idx % uploadedImages.length],
      category: Math.floor(Math.random() * 10) < 5 ? 'frontend' : 'backend',
      rating: (4 + Math.random()).toFixed(1),
      price: (49000 + idx * 5000).toLocaleString(),
      bookmarks: Math.floor(Math.random() * 200) + 100,
      isAI: isAI,
      rank: idx + 1,
    }
  });
};
