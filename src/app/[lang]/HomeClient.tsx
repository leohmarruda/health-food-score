'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import FoodCard from '@/components/FoodCard';
import FoodProfileModal from '@/components/FoodProfileModal';
import FoodTable from '@/components/FoodTable';
import { supabase } from '@/lib/supabase';
import { downloadAsCSV } from '@/utils/export';
import type { Food } from '@/types/food';

type ViewMode = 'grid' | 'table';
type SortKey = 'name' | 'energy_kcal' | 'protein_g' | 'hfs';
type SortOrder = 'asc' | 'desc';

export default function HomeClient({ dict, lang }: { dict: any, lang: string }) {
  // State
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'hfs',
    order: 'desc'
  });

  // Derived values
  const t = dict.home || { 
    searchPlaceholder: 'Search foods...',
    loading: 'Loading library...',
    noFoods: 'No foods found',
    addFirst: 'Add your first food item',
    protein: 'Protein',
    grid: 'Grid',
    table: 'Table'
  };

  // Effects
  useEffect(() => {
    async function fetchFoods() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        toast.error(t.loadError || 'Failed to load foods');
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  // Computed values
  const processedFoods = useMemo(() => {
    const filtered = foods.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grid view: sort alphabetically by name
    if (viewMode === 'grid') {
      return [...filtered].sort((a, b) => {
        const aName = (a.name || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        return aName.localeCompare(bName);
      });
    }

    // Table view: use sortConfig
    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? 0;
      const bValue = b[sortConfig.key] ?? 0;

      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [foods, searchTerm, sortConfig, viewMode]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handlers
  const toggleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleFoodClick = (food: any) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-text-main">{dict.common.title}</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border border-text-main/20 text-text-main p-2 px-4 rounded-theme w-full md:w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-text-main/70">{t.loading}</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-20 text-text-main/70 bg-card rounded-theme border border-text-main/20 border-dashed">
          <p className="text-lg font-medium">{t.noFoods} {searchTerm && `"${searchTerm}"`}</p>
          {!searchTerm && (
            <Link href={`/${lang}/new-food`} className="text-primary hover:underline mt-2 inline-block">
              {t.addFirst} →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-theme font-medium transition ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-card text-text-main'
                }`}
              >
                {t.grid}
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-theme font-medium transition ${
                  viewMode === 'table' ? 'bg-primary text-white' : 'bg-card text-text-main'
                }`}
              >
                {t.table}
              </button>
            </div>
            
            <button 
              onClick={() => downloadAsCSV(filteredFoods, 'food-library-export')}
              className="px-4 py-2 bg-primary text-white rounded-theme hover:opacity-90 transition flex items-center gap-2 text-sm font-medium shadow-md"
            >
              📊 {t.export}
            </button>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedFoods.map((food) => (
                <div key={food.id} onClick={() => handleFoodClick(food)}>
                  <FoodCard food={food as any} dict={dict} />
                </div>
              ))}
            </div>
          ) : (
            <FoodTable 
              foods={processedFoods} 
              onFoodClick={handleFoodClick} 
              dict={dict}
              sortConfig={sortConfig}
              onSort={toggleSort}
            />
          )}
        </>
      )}

      <FoodProfileModal 
        food={selectedFood}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dict={dict}
      />
    </main>
  );
}