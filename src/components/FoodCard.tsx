import Image from 'next/image';

interface Food {
  id: string;
  name: string;
  energy_kcal: number;
  hfs: number;
  front_photo_url: string;
}

export default function FoodCard({ food, dict }: { food: Food, dict: any }) {
  // Get HFS badge color styles
  const getHFSStyles = (score: number) => {
    if (score >= 4) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 2.5) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (score < 0) return 'bg-gray-100 text-gray-500 border-gray-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="border border-text-main/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-card group cursor-pointer">
      <div className="relative h-48 w-full bg-text-main/5 overflow-hidden">
        {food.front_photo_url ? (
          <img 
            src={food.front_photo_url} 
            alt={food.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-main/40 bg-text-main/5">
            {dict?.home?.noPhoto || 'No Image'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg capitalize text-text-main truncate">
            {food.name || 'Unknown Food'}
          </h3>
          <span className={`px-2 py-1 rounded text-[10px] font-black border flex-shrink-0 ${getHFSStyles(food.hfs ?? 0)}`}>
            HFS: {food.hfs != null && food.hfs >= 0 ? food.hfs.toFixed(1) : '—'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-text-main/60 text-sm">
            🔥 {food.energy_kcal || 0} kcal
          </span>
        </div>
      </div>
    </div>
  );
}