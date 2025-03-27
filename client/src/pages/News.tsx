import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['/api/news'],
  });
  
  const filteredNews = newsItems ? 
    (activeCategory === "All News" 
      ? newsItems 
      : newsItems.filter((item: any) => item.category === activeCategory)
    ) : [];
    
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="py-16 px-4 bg-neutral-50">
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
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
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
            {currentNews.map((item: any) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="inline-flex rounded-md shadow-sm">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="rounded-r-none"
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(index + 1)}
                  className="rounded-none"
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded-l-none"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
