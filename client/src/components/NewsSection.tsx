import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/utils";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSection() {
  const [activeCategory, setActiveCategory] = useState("All News");
  
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['/api/news'],
  });
  
  const filteredNews = newsItems ? 
    (activeCategory === "All News" 
      ? newsItems.slice(0, 6) 
      : newsItems.filter((item: any) => item.category === activeCategory).slice(0, 6)
    ) : [];

  return (
    <section id="news" className="py-16 px-4 bg-neutral-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-neutral-800 mb-4 text-center">Latest News</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-10">
          Stay updated with the most recent developments and achievements from our university.
        </p>

        {/* News Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.news.map((category) => (
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

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news: any) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
