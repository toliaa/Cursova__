import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedNews() {
  const { data: featuredNews, isLoading } = useQuery({
    queryKey: ['/api/news/featured'],
  });

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800">Featured News</h2>
          <Link href="/news">
            <a className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredNews && featuredNews.map((news: any) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
