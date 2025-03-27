import { Badge } from "@/components/ui/badge";

interface GalleryItemProps {
  item: {
    id: number;
    title: string;
    imageUrl: string;
    category: string;
  };
}

export default function GalleryItem({ item }: GalleryItemProps) {
  // Function to determine badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'science':
        return 'bg-primary-600';
      case 'technology':
        return 'bg-secondary-600';
      case 'medicine':
        return 'bg-red-600';
      case 'humanities':
        return 'bg-amber-600';
      case 'events':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md group">
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-full h-64 object-cover transition duration-300 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-100 transition">
        <div>
          <Badge className={`text-xs font-medium text-white ${getBadgeColor(item.category)} px-2 py-1 rounded`}>
            {item.category}
          </Badge>
          <h3 className="text-white font-bold mt-2">{item.title}</h3>
        </div>
      </div>
    </div>
  );
}
