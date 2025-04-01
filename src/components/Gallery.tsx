
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const motivationImages = [
  {
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
    alt: "코딩하는 사람들",
    title: "함께 배워요",
    message: "함께 배우면 더 빠르게 성장합니다. 주변의 동료들과 지식을 나누고, 서로의 아이디어를 발전시켜 나가세요. 협업은 개발의 핵심입니다."
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    alt: "팀워크",
    title: "지속적 성장",
    message: "개발은 끊임없는 학습의 연속입니다. 오늘 배운 것을 내일 적용하고, 매일 조금씩 성장해 나가는 과정을 즐기세요. 작은 성취가 모여 큰 성공이 됩니다."
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    alt: "등반하는 사람",
    title: "도전의 가치",
    message: "어려움을 극복할 때 진정한 성장이 이루어집니다. 당장은 힘들더라도, 그 과정에서 얻는 경험과 지식은 평생의 자산이 됩니다. 포기하지 말고 계속 도전하세요."
  },
  {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    alt: "밤늦게 코딩",
    title: "열정의 시간",
    message: "열정은 모든 위대한 성취의 시작점입니다. 자신이 진정으로 좋아하는 일을 찾고, 그 안에서 기쁨을 발견하세요. 열정이 있다면 밤샘 코딩도 즐거운 여정이 됩니다."
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    alt: "프레젠테이션",
    title: "지식의 공유",
    message: "배움은 나눌 때 더 큰 가치가 있습니다. 자신이 알게 된 것을 다른 사람과 공유하며 함께 성장해 나가세요. 가르치는 과정에서 더 깊이 이해할 수 있습니다."
  },
  {
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    alt: "성취의 기쁨",
    title: "성취의 즐거움",
    message: "목표를 달성했을 때의 성취감은 그 어떤 것과도 비교할 수 없습니다. 작은 승리를 축하하고, 그 기쁨을 원동력 삼아 더 높은 곳을 향해 나아가세요."
  }
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<(typeof motivationImages)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (image: typeof motivationImages[0]) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  return (
    <section id="motivation" className="py-20 bg-gradient-to-b from-white to-ghibli-cloud/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ghibli-midnight mb-4 korean-text">왜 공부해야 할까</h2>
          <p className="text-ghibli-stone text-lg max-w-2xl mx-auto korean-text">
            학습은 단순한 지식 습득을 넘어, 더 나은 자신을 만들어가는 여정입니다. 
            아래 이미지를 클릭하여 동기부여 메시지를 확인해보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motivationImages.map((image, index) => (
            <div 
              key={index} 
              className="img-hover-zoom opacity-0 shadow-lg cursor-pointer rounded-lg overflow-hidden" 
              style={{ 
                animation: 'fade-in 1s ease-out forwards',
                animationDelay: `${0.15 * index}s` 
              }}
              onClick={() => openDialog(image)}
            >
              <div className="relative group">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-ghibli-midnight/0 group-hover:bg-ghibli-midnight/40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                    <h3 className="text-xl font-bold korean-text">{image.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl korean-text">{selectedImage?.title}</DialogTitle>
            <DialogDescription className="korean-text">
              {selectedImage?.message}
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="aspect-video overflow-hidden rounded-md mt-2">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.alt} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;
