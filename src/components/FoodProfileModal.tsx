'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NutritionLabel from './NutritionLabel';
import type { Food } from '@/types/food';

interface FoodProfileModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
  dict: any;
}

export default function FoodProfileModal({ food, isOpen, onClose, dict }: FoodProfileModalProps) {
  const params = useParams();
  const lang = (params?.lang as string) || 'pt';

  if (!isOpen || !food || !dict) return null;

  const [multiplier, setMultiplier] = useState(1);
  const t = dict.home;
  const tm = dict.manage;

  // Calculate nutrition values based on portion size and multiplier
  const baseRatio = (food.portion_size_value || 100) / 100;
  const totalRatio = baseRatio * multiplier;

  const getPortionTotal = (value100g: number | null | undefined) => {
    if (value100g == null) return 0;
    return value100g * totalRatio;
  };
  const calculateCalories = (num: number | null | undefined) => (num ? Math.round(num * totalRatio) : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="relative bg-card rounded-theme shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 text-text-main/60 hover:text-text-main text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-text-main/10 transition"
        >
          ×
        </button>
        <div className="md:w-5/12 bg-background p-6 overflow-y-auto border-r border-text-main/10 flex flex-col items-center">
          <div className="w-full h-48 bg-card rounded-theme mb-6 shadow-sm flex items-center justify-center p-4">
            <img src={food.front_photo_url} className="max-h-full object-contain" alt={food.name} />
          </div>
          <div className="scale-90 origin-top">
                    <NutritionLabel 
                        data={food} 
                        multiplier={multiplier} 
                        usePortion={true}
                        onMultiplierChange={setMultiplier}
                        dict={dict}
                    />
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between min-w-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {food.brand || t.noBrand || 'Generic'}
              </span>
              <h2 className="text-3xl font-black text-text-main leading-tight">{food.name}</h2>
              <p className="text-text-main/60 italic text-sm mt-1">
                {(food.category && dict.categories) 
                  ? (dict.categories[food.category as keyof typeof dict.categories] || food.category)
                  : food.category}
              </p>
            </div>

            {/* HFS Score - Enhanced */}
            <div className="p-5 bg-gradient-to-br from-background to-background/50 rounded-theme border-2 border-text-main/10 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-text-main uppercase">HFS Score</span>
                </div>
                <span className={`text-2xl font-black ${
                  food.hfs >= 7 ? 'text-green-600' : food.hfs >= 4 ? 'text-orange-500' : food.hfs >= 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {food.hfs >= 0 ? food.hfs.toFixed(1) : '—'}/10
                </span>
              </div>
              <div className="w-full bg-text-main/10 h-4 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${
                    food.hfs >= 7 ? 'bg-green-500' : food.hfs >= 4 ? 'bg-orange-400' : food.hfs >= 0 ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${food.hfs >= 0 ? (food.hfs * 10) : 0}%` }}
                />
              </div>
              <p className="text-xs text-text-main/50 mt-2">
                {food.hfs >= 7 ? 'Excellent' : food.hfs >= 4 ? 'Good' : food.hfs >= 0 ? 'Needs Improvement' : 'Not Calculated'}
              </p>
            </div>

            {/* Typical Portion */}
            {(food.portion_size_value || food.portion_unit) && (
              <div className="p-4 bg-background rounded-theme border border-text-main/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-bold text-text-main uppercase">Typical Portion</span>
                </div>
                <p className="text-lg font-semibold text-text-main">
                  {food.portion_size_value || 100}{food.portion_unit || 'g'}
                </p>
                <p className="text-xs text-text-main/60 mt-1">
                  {t.portion || 'Portion'} size as declared on package
                </p>
              </div>
            )}

            {/* Ingredients */}
            {((food as any).ingredients_list && Array.isArray((food as any).ingredients_list) && (food as any).ingredients_list.length > 0) || food.ingredients_raw ? (
              <div className="p-4 bg-background rounded-theme border border-text-main/10">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-bold text-text-main uppercase">Ingredients</span>
                </div>
                {(food as any).ingredients_list && Array.isArray((food as any).ingredients_list) && (food as any).ingredients_list.length > 0 ? (
                  <ul className="space-y-1">
                    {(food as any).ingredients_list.map((ingredient: string, idx: number) => (
                      <li key={idx} className="text-sm text-text-main/80 flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="flex-1">{ingredient.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : food.ingredients_raw ? (
                  <p className="text-sm text-text-main/80 leading-relaxed whitespace-pre-wrap">
                    {food.ingredients_raw}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Price - Optional field */}
            {(food as any).price && (
              <div className="p-4 bg-background rounded-theme border border-text-main/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-text-main uppercase">Price</span>
                </div>
                <p className="text-xl font-bold text-text-main">
                  {typeof (food as any).price === 'number' 
                    ? `R$ ${(food as any).price.toFixed(2).replace('.', ',')}`
                    : (food as any).price}
                </p>
              </div>
            )}

            {/* Nutrition Summary */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">{t.totalConsumption || 'Total for current consumption'}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t.calories}</p>
                  <span className="text-5xl font-black text-white">
                    {calculateCalories(food.energy_kcal)}
                  </span>
                  <span className="ml-2 text-gray-400 font-bold uppercase text-xs tracking-widest">kcal</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-400">
                    {getPortionTotal(food.protein_g).toFixed(1)}g
                  </span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Protein</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-8">
            <div className="mt-6 pt-4 border-t border-text-main/10 flex items-center justify-between">
              <div className="text-[10px] text-text-main/50 italic">
                {t.lastUpdate || 'Last update'}: {food.created_at 
                  ? new Date(food.created_at).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') 
                  : 'Manual Entry'}
              </div>
              <Link
                href={`/${lang}/edit/${food.id}`}
                className="flex items-center justify-center w-full bg-primary text-white py-4 rounded-theme font-bold text-lg hover:opacity-90 shadow-lg transition active:scale-95"
              >
                ✏️ {tm?.edit || 'Edit Record'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}