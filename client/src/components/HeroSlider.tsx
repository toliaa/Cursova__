import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: slides, isLoading } = useQuery({
    queryKey: ['/api/slider'],
  });
  
  const slideCount = slides?.length || 0;
  
  const showSlide = (index: number) => {
    setCurrentSlide((index + slideCount) % slideCount);
  };
  
  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };
  
  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };
  
  // Auto-rotate slides
  useEffect(() => {
    if (!slideCount) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, slideCount]);
  
  if (isLoading) {
    return (
      <div className="relative bg-neutral-800 h-[500px] overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <section id="home" className="relative bg-neutral-800 h-[500px] overflow-hidden">
      {/* Slider Container */}
      <div className="slider-container h-full relative">
        {slides && slides.map((slide: any, index: number) => (
          <div 
            key={slide.id}
            className={cn(
              "slide absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="absolute inset-0 bg-neutral-900/60 z-10"></div>
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center px-4 max-w-4xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{slide.title}</h2>
                <p className="text-white text-xl mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
                <Link href={slide.ctaLink}>
                  <Button size="lg" className="mr-4">
                    {slide.ctaText}
                  </Button>
                </Link>
                {slide.secondaryCtaText && (
                  <Link href={slide.secondaryCtaLink || "#"}>
                    <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-neutral-100">
                      {slide.secondaryCtaText}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center z-30 opacity-80 hover:opacity-100 transition"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center z-30 opacity-80 hover:opacity-100 transition"
        >
          <ChevronRight />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides && slides.map((_: any, index: number) => (
            <button 
              key={index}
              onClick={() => showSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full bg-white transition-opacity",
                index === currentSlide ? "opacity-100" : "opacity-50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
