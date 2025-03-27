import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GalleryItem from "@/components/GalleryItem";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['/api/gallery'],
  });
  
  const filteredItems = galleryItems ? 
    (activeCategory === "All Categories" 
      ? galleryItems 
      : galleryItems.filter((item: any) => item.category === activeCategory)
    ) : [];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4 text-center">Research Gallery</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-10">
          Explore visual highlights from our various research departments and scholarly activities.
        </p>

        {/* Gallery Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.gallery.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="px-4 py-2 rounded-md font-medium"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item: any) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
