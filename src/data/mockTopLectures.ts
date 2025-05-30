
export const generateTopLecturesData = () => {
  // Using the provided instructor images
  const uploadedImages = [
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_1_3.png', // AI로 보는 세상
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_2_4.png', // OAuth2 로그인
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_3_5.png', // AWS 클라우드
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnail_98_3.png', // iOS 앱 개발
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_5_7.png', // REST API
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_6_8.png', // REST API 2
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_7_9.png', // Vue 3
    'https://aigongbu-lecture-files.s3.ap-northeast-2.amazonaws.com/thumbnails/thumbnails_18_20.png'  // 스프링 부트
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
