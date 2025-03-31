
import React from 'react';

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    alt: "Foggy mountain landscape",
    title: "Misty Mountains"
  },
  {
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    alt: "Waterfall through forest",
    title: "Hidden Waterfall"
  },
  {
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    alt: "Pine tree forest",
    title: "Ancient Forest"
  },
  {
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    alt: "Sunlight through trees",
    title: "Forest Light"
  },
  {
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    alt: "Deer in mountain landscape",
    title: "Valley Guardians"
  },
  {
    url: "https://images.unsplash.com/photo-1616071264373-d9c2f3d0f690",
    alt: "Japanese temple gate",
    title: "Temple Pathway"
  }
];

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-ghibli-cloud/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ghibli-midnight mb-4">Our Gallery</h2>
          <p className="text-ghibli-stone text-lg max-w-2xl mx-auto">
            Explore the magical worlds we've created, each image telling its own story.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="img-hover-zoom opacity-0 shadow-lg" 
              style={{ 
                animation: 'fade-in 1s ease-out forwards',
                animationDelay: `${0.15 * index}s` 
              }}
            >
              <div className="relative group">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-ghibli-midnight/0 group-hover:bg-ghibli-midnight/40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                    <h3 className="text-xl font-handwritten font-bold">{image.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-secondary">View Full Gallery</button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
