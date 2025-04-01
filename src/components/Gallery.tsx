
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
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    alt: "언덕 위의 사람",
    title: "지속적인 노력",
    message: "오늘 최선을 다해 노력한다면, 내일의 정상에서 더 넓은 세계를 볼 수 있습니다. 포기하지 말고 한 걸음씩 나아가세요."
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    alt: "폭포",
    title: "변화의 흐름",
    message: "지식은 폭포처럼 끊임없이 흐릅니다. 그 흐름에 몸을 맡기고 배움의 여정을 즐기세요. 당신의 성장에는 끝이 없습니다."
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    alt: "높은 나무들",
    title: "성장의 높이",
    message: "거대한 나무도 작은 씨앗에서 시작합니다. 오늘의 작은 학습이 내일의 큰 성취로 이어집니다. 꾸준함이 성공의 열쇠입니다."
  },
  {
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    alt: "숲 속 빛",
    title: "통찰의 빛",
    message: "어둠 속에서도 빛은 언제나 존재합니다. 문제에 막혀 있을 때에도 해결책은 분명히 있으니, 포기하지 말고 계속 도전하세요."
  },
  {
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    alt: "산 속의 사슴",
    title: "자연스러운 배움",
    message: "배움은 자연의 일부입니다. 스스로의 속도로 성장하며, 자신만의 고유한 길을 발견하세요. 남들과 비교하지 말고 자신의 여정을 즐기세요."
  },
  {
    url: "https://images.unsplash.com/photo-1616071264373-d9c2f3d0f690",
    alt: "일본 사원 입구",
    title: "지혜의 문",
    message: "교육은 새로운 세계로 향하는 문을 여는 열쇠입니다. 지식을 통해 당신이 상상하지 못했던 가능성의 세계로 발걸음을 내딛으세요."
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
              className="img-hover-zoom opacity-0 shadow-lg cursor-pointer" 
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
