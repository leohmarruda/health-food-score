import { Food } from '@/types/food';

interface FoodTableProps {
  foods: Food[];
  onFoodClick: (food: Food) => void;
  dict: any;
}

export default function FoodTable({ foods, onFoodClick, dict, sortConfig, onSort }: any) {
  const t = dict.home;

  // Helper para renderizar a seta de ordenação
  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <span className="ml-1 opacity-30 text-[10px]">↕</span>;
    return sortConfig.order === 'asc' 
      ? <span className="ml-1 text-primary text-[10px]">▲</span> 
      : <span className="ml-1 text-primary text-[10px]">▼</span>;
  };

  // Helper para as cores do HFS
  const getHFSColor = (score: number) => {
    if (score >= 4) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 2.5) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (score < 0) return 'text-text-main/40 bg-text-main/5 border-text-main/10';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="overflow-hidden border border-text-main/10 rounded-theme bg-card shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-text-main/5 text-text-main/70 uppercase text-xs">
          <tr className="bg-text-main/5 border-b border-text-main/10 text-xs uppercase text-text-main/70 font-bold">
            {/* Coluna Nome */}
            <th className="px-4 py-3 cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('name')}>
              <div className="flex items-center">{dict?.home?.name} <SortIcon column="name" /></div>
            </th>
            
            {/* NOVA COLUNA HFS (Substituindo Brand ou adicionando) */}
            <th className="px-4 py-3 cursor-pointer hover:bg-text-main/5 transition text-center" onClick={() => onSort('hfs')}>
              <div className="flex items-center justify-center">HFS <SortIcon column="hfs" /></div>
            </th>

            <th className="px-4 py-3 cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('brand')}>
              <div className="flex items-center">{dict?.home?.brand} <SortIcon column="brand" /></div>
            </th>
            
            <th className="px-4 py-3 text-right cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('energy_kcal')}>
              <div className="flex items-center justify-end">{dict?.home?.kcal} <SortIcon column="energy_kcal" /></div>
            </th>
            
            <th className="px-4 py-3 text-right cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('protein_g')}>
              <div className="flex items-center justify-end">{dict?.home?.protein} <SortIcon column="protein_g" /></div>
            </th>

            <th className="px-4 py-3 text-right cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('carbs_total_g')}>
              <div className="flex items-center justify-end">{dict?.home?.carbs} <SortIcon column="carbs_total_g" /></div>
            </th>

            <th className="px-4 py-3 text-right cursor-pointer hover:bg-text-main/5 transition" onClick={() => onSort('fat_total_g')}>
              <div className="flex items-center justify-end">{dict?.home?.fat} <SortIcon column="fat_total_g" /></div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-text-main/10 text-text-main">
          {foods.map((food: any) => (
            <tr 
              key={food.id} 
              className="hover:bg-text-main/5 transition-colors bg-card cursor-pointer group" 
              onClick={() => onFoodClick(food)}
            >
              <td className="px-4 py-3 font-medium text-primary group-hover:underline">{food.name}</td>
              
              {/* Célula HFS com Badge Colorido */}
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-[11px] font-black border ${getHFSColor(food.hfs)}`}>
                  {food.hfs && food.hfs >= 0 ? food.hfs.toFixed(1) : '—'}
                </span>
              </td>

              <td className="px-4 py-3 text-text-main/70">{food.brand || '—'}</td>
              <td className="px-4 py-3 text-right font-bold text-primary">{food.energy_kcal}</td>
              <td className="px-4 py-3 text-right text-text-main/70">{food.protein_g}g</td>
              <td className="px-4 py-3 text-right text-text-main/70">{food.carbs_total_g}g</td>
              <td className="px-4 py-3 text-right text-text-main/70">{food.fat_total_g}g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}