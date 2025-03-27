import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    category: string;
    date: string;
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  // Function to determine badge color based on category
  const getBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'science':
        return 'bg-primary-100 text-primary-800';
      case 'technology':
        return 'bg-secondary-100 text-secondary-800';
      case 'student life':
        return 'bg-purple-100 text-purple-800';
      case 'publications':
        return 'bg-amber-100 text-amber-800';
      case 'events':
        return 'bg-green-100 text-green-800';
      case 'research':
        return 'bg-primary-100 text-primary-800';
      case 'academic':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <Badge 
            variant="outline" 
            className={cn("rounded font-medium text-xs px-2.5 py-0.5", getBadgeClass(news.category))}
          >
            {news.category}
          </Badge>
          <span className="text-neutral-500 text-sm ml-auto">
            {formatDate(news.date)}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{news.title}</h3>
        <p className="text-neutral-600 text-sm mb-4">{news.summary}</p>
        <a href="#" className="text-primary-600 hover:text-primary-800 font-medium text-sm">
          Read More →
        </a>
      </CardContent>
    </Card>
  );
}
