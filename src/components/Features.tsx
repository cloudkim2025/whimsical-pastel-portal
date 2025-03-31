
import React from 'react';
import { Heart, Star, Book, Image } from 'lucide-react';

const featureData = [
  {
    icon: <Heart className="h-8 w-8 text-ghibli-sunset" />,
    title: "Heartwarming Stories",
    description: "Immerse yourself in tales that touch the soul, spark imagination, and remind us of life's simple joys."
  },
  {
    icon: <Star className="h-8 w-8 text-ghibli-forest" />,
    title: "Magical Experiences",
    description: "Discover adventures that blend fantasy with reality, creating spaces where wonder can flourish."
  },
  {
    icon: <Book className="h-8 w-8 text-ghibli-earth" />,
    title: "Timeless Wisdom",
    description: "Explore universal truths woven into everyday narratives, connecting us to nature and each other."
  },
  {
    icon: <Image className="h-8 w-8 text-ghibli-sky-blue" />,
    title: "Visual Poetry",
    description: "Delight in breathtaking visuals that capture the beauty of both grand landscapes and intimate details."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ghibli-cloud/30 to-white/0 -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-ghibli-midnight mb-4">Why Choose Us</h2>
          <p className="text-ghibli-stone text-lg max-w-2xl mx-auto">
            Our studio brings together imagination, craftsmanship, and heart to create experiences that resonate with audiences of all ages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card opacity-0" 
              style={{ 
                animation: 'slide-up 1s ease-out forwards',
                animationDelay: `${0.2 * index}s` 
              }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-ghibli-midnight mb-3">{feature.title}</h3>
              <p className="text-ghibli-stone">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-handwritten font-bold text-ghibli-midnight mb-6">
            "The creation of a single world comes from a huge number of fragments and chaos."
          </h3>
          <p className="text-ghibli-stone italic">- Hayao Miyazaki</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
