'use client';
import type { Food, FoodFormData } from '@/types/food';

interface NutritionLabelProps {
  data: Food | FoodFormData;
  usePortion?: boolean;
  multiplier?: number;
  onMultiplierChange?: (newMultiplier: number) => void;
  dict: any;
}

export default function NutritionLabel({ 
  data, 
  usePortion = true, 
  multiplier = 1,
  onMultiplierChange,
  dict
}: NutritionLabelProps) {
  if (!data || !dict) return null;

  const t = dict?.components?.nutritionLabel || {};

  // Extract nutrition_parsed data with fallback to flat fields
  const nutritionParsed = data.nutrition_parsed || {};
  const metadata = nutritionParsed.metadata || {};
  const carbs = nutritionParsed.carbohydrates || {};
  const proteins = nutritionParsed.proteins || {};
  const fats = nutritionParsed.fats || {};
  const fiber = nutritionParsed.fiber || {};
  const minerals = nutritionParsed.minerals_mg || {};
  const vitamins = nutritionParsed.vitamins || {};

  // Calculate nutrition values based on portion size and multiplier
  const servingSize = metadata.serving_size || data.serving_size_value || 100;
  const servingUnit = metadata.serving_size_unit || data.serving_size_unit || 'g';
  const baseRatio = usePortion ? (servingSize / 100) : 1;
  const totalRatio = baseRatio * multiplier;

  // Helper functions to format nutrition values
  const formatValue = (num: number | null | undefined) => {
    if (num == null || num === 0) return "0";
    return (num * totalRatio).toFixed(1);
  };
  
  const formatCalories = (num: number | null | undefined) => {
    if (num == null) return 0;
    return Math.round(num * totalRatio);
  };
  
  const calculatePercentage = (value: number | null | undefined, dailyValue: number) => {
    if (value == null) return 0;
    return Math.round(((value * totalRatio) / dailyValue) * 100);
  };

  // Get values with fallback: nutrition_parsed -> flat fields
  const energyKcal = nutritionParsed.energy_kcal ?? data.energy_kcal ?? 0;
  const totalFat = fats.total_fats_g ?? data.fat_total_g ?? 0;
  const saturatedFat = fats.saturated_fats_g ?? data.saturated_fat_g ?? 0;
  const transFat = fats.trans_fats_g ?? data.trans_fat_g ?? 0;
  const monounsaturatedFat = fats.monounsaturated_fats_g;
  const polyunsaturatedFat = fats.polyunsaturated_fats_g;
  const cholesterol = fats.cholesterol_mg;
  const sodium = minerals.sodium_mg ?? data.sodium_mg ?? 0;
  const totalCarbs = carbs.total_carbs_g ?? data.carbs_total_g ?? 0;
  const sugarsTotal = carbs.sugars_total_g;
  const sugarsAdded = carbs.sugars_added_g;
  const polyols = carbs.polyols_g;
  const starch = carbs.starch_g;
  const totalFiber = fiber.total_fiber_g ?? data.fiber_g ?? 0;
  const solubleFiber = fiber.soluble_fiber_g;
  const insolubleFiber = fiber.insoluble_fiber_g;
  const protein = proteins.total_proteins_g ?? data.protein_g ?? 0;
  
  // Important minerals
  const calcium = minerals.calcium_mg;
  const iron = minerals.iron_mg;
  const potassium = minerals.potassium_mg;
  const magnesium = minerals.magnesium_mg;
  const zinc = minerals.zinc_mg;
  
  // Important vitamins
  const vitaminA = vitamins.vitamin_a_mcg;
  const vitaminC = vitamins.vitamin_c_mg;
  const vitaminD = vitamins.vitamin_d_mcg;
  const vitaminE = vitamins.vitamin_e_mg;
  const vitaminK = vitamins.vitamin_k_mcg;
  const vitaminB12 = vitamins.vitamin_b12_mcg;
  const vitaminB6 = vitamins.vitamin_b6_mg;
  const vitaminB9 = vitamins.vitamin_b9_mcg;

  return (
    <div className="bg-white p-4 border-2 border-black max-w-[300px] font-sans text-black shadow-md">
      <h2 className="text-3xl font-black leading-tight border-b-8 border-black">
        {t.factsTitle || 'Nutrition Facts'}
      </h2>
      <div className="border-b-4 border-black py-1 font-bold flex justify-between items-center">
      <span>{t.servingSize || 'Serving size'}</span>
        <span className="flex items-center gap-1">
          {usePortion 
            ? `${Math.round(servingSize * multiplier)}${servingUnit}` 
            : '100g'
          }
          {onMultiplierChange && (
            <div className="flex flex-col gap-0.5 ml-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onMultiplierChange(multiplier + 0.5);
                }}
                className="w-3 h-2.5 flex items-center justify-center bg-white border border-black hover:bg-gray-100 active:bg-gray-200 transition text-[7px] font-bold leading-none shadow-sm"
                title="Increase servings"
              >
                ▲
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onMultiplierChange(Math.max(0.5, multiplier - 0.5));
                }}
                className="w-3 h-2.5 flex items-center justify-center bg-white border border-black hover:bg-gray-100 active:bg-gray-200 transition text-[7px] font-bold leading-none shadow-sm"
                title="Decrease servings"
              >
                ▼
              </button>
            </div>
          )}
        </span>
      </div>
      
      <div className="border-b-8 border-black py-1 flex justify-between items-end">
        <span className="text-2xl font-black">{t.calories || 'Calories'}</span>
        <span className="text-4xl font-black">{formatCalories(energyKcal)}</span>
      </div>
  
      <div className="text-sm border-b border-black py-1 text-right font-bold">
        % {t.dailyValue || 'Daily Value'}*
      </div>
  
      {/* Fats Section */}
      <div className="border-b border-black py-1 flex justify-between">
        <span><span className="font-bold">{t.fat || 'Total Fat'}</span> {formatValue(totalFat)}g</span>
        <span className="font-bold">{calculatePercentage(totalFat, 78)}%</span>
      </div>

      {saturatedFat > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>{t.saturatedFat || 'Saturated Fat'} {formatValue(saturatedFat)}g</span>
          <span className="font-bold">{calculatePercentage(saturatedFat, 20)}%</span>
        </div>
      )}

      {transFat > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Trans Fat {formatValue(transFat)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {monounsaturatedFat != null && monounsaturatedFat > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Monounsaturated Fat {formatValue(monounsaturatedFat)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {polyunsaturatedFat != null && polyunsaturatedFat > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Polyunsaturated Fat {formatValue(polyunsaturatedFat)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {cholesterol != null && cholesterol > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Cholesterol {Math.round(cholesterol * totalRatio)}mg</span>
          <span className="font-bold">{calculatePercentage(cholesterol, 300)}%</span>
        </div>
      )}

      {/* Sodium */}
      {sodium > 0 && (
        <div className="border-b border-black py-1 flex justify-between">
          <span>
            <span className="font-bold">{t.sodium || 'Sodium'}</span> {Math.round(sodium * totalRatio)}mg
          </span>
          <span className="font-bold">{calculatePercentage(sodium, 2300)}%</span>
        </div>
      )}

      {/* Carbohydrates Section */}
      {totalCarbs > 0 && (
        <div className="border-b border-black py-1 flex justify-between">
          <span><span className="font-bold">{t.carbs || 'Total Carbohydrate'}</span> {formatValue(totalCarbs)}g</span>
          <span className="font-bold">{calculatePercentage(totalCarbs, 275)}%</span>
        </div>
      )}

      {totalFiber > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>{t.fiber || 'Dietary Fiber'} {formatValue(totalFiber)}g</span>
          <span className="font-bold">{calculatePercentage(totalFiber, 28)}%</span>
        </div>
      )}

      {solubleFiber != null && solubleFiber > 0 && (
        <div className="border-b border-black py-1 pl-6 flex justify-between text-xs">
          <span>Soluble Fiber {formatValue(solubleFiber)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {insolubleFiber != null && insolubleFiber > 0 && (
        <div className="border-b border-black py-1 pl-6 flex justify-between text-xs">
          <span>Insoluble Fiber {formatValue(insolubleFiber)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {sugarsTotal != null && sugarsTotal > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Total Sugars {formatValue(sugarsTotal)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {sugarsAdded != null && sugarsAdded > 0 && (
        <div className="border-b border-black py-1 pl-6 flex justify-between text-xs">
          <span>Includes {formatValue(sugarsAdded)}g Added Sugars</span>
          <span className="font-bold">{calculatePercentage(sugarsAdded, 50)}%</span>
        </div>
      )}

      {polyols != null && polyols > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Polyols {formatValue(polyols)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {starch != null && starch > 0 && (
        <div className="border-b border-black py-1 pl-4 flex justify-between text-sm">
          <span>Starch {formatValue(starch)}g</span>
          <span className="font-bold"></span>
        </div>
      )}

      {/* Protein */}
      {protein > 0 && (
        <div className="border-b-4 border-black py-1 flex justify-between">
          <span><span className="font-bold">{t.protein || 'Protein'}</span> {formatValue(protein)}g</span>
          <span></span>
        </div>
      )}

      {/* Minerals Section */}
      {(calcium != null || iron != null || potassium != null || magnesium != null || zinc != null) && (
        <>
          {calcium != null && calcium > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Calcium {Math.round(calcium * totalRatio)}mg</span>
              <span className="font-bold">{calculatePercentage(calcium, 1300)}%</span>
            </div>
          )}
          {iron != null && iron > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Iron {formatValue(iron)}mg</span>
              <span className="font-bold">{calculatePercentage(iron, 18)}%</span>
            </div>
          )}
          {potassium != null && potassium > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Potassium {Math.round(potassium * totalRatio)}mg</span>
              <span className="font-bold">{calculatePercentage(potassium, 4700)}%</span>
            </div>
          )}
          {magnesium != null && magnesium > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Magnesium {formatValue(magnesium)}mg</span>
              <span className="font-bold">{calculatePercentage(magnesium, 420)}%</span>
            </div>
          )}
          {zinc != null && zinc > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Zinc {formatValue(zinc)}mg</span>
              <span className="font-bold">{calculatePercentage(zinc, 11)}%</span>
            </div>
          )}
        </>
      )}

      {/* Vitamins Section */}
      {(vitaminA != null || vitaminC != null || vitaminD != null || vitaminE != null || vitaminK != null || vitaminB12 != null || vitaminB6 != null || vitaminB9 != null) && (
        <>
          {vitaminA != null && vitaminA > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin A {Math.round(vitaminA * totalRatio)}mcg</span>
              <span className="font-bold">{calculatePercentage(vitaminA, 900)}%</span>
            </div>
          )}
          {vitaminC != null && vitaminC > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin C {formatValue(vitaminC)}mg</span>
              <span className="font-bold">{calculatePercentage(vitaminC, 90)}%</span>
            </div>
          )}
          {vitaminD != null && vitaminD > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin D {Math.round(vitaminD * totalRatio)}mcg</span>
              <span className="font-bold">{calculatePercentage(vitaminD, 20)}%</span>
            </div>
          )}
          {vitaminE != null && vitaminE > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin E {formatValue(vitaminE)}mg</span>
              <span className="font-bold">{calculatePercentage(vitaminE, 15)}%</span>
            </div>
          )}
          {vitaminK != null && vitaminK > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin K {Math.round(vitaminK * totalRatio)}mcg</span>
              <span className="font-bold">{calculatePercentage(vitaminK, 120)}%</span>
            </div>
          )}
          {vitaminB12 != null && vitaminB12 > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin B12 {Math.round(vitaminB12 * totalRatio)}mcg</span>
              <span className="font-bold">{calculatePercentage(vitaminB12, 2.4)}%</span>
            </div>
          )}
          {vitaminB6 != null && vitaminB6 > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Vitamin B6 {formatValue(vitaminB6)}mg</span>
              <span className="font-bold">{calculatePercentage(vitaminB6, 1.7)}%</span>
            </div>
          )}
          {vitaminB9 != null && vitaminB9 > 0 && (
            <div className="border-b border-black py-1 flex justify-between text-sm">
              <span>Folate (B9) {Math.round(vitaminB9 * totalRatio)}mcg</span>
              <span className="font-bold">{calculatePercentage(vitaminB9, 400)}%</span>
            </div>
          )}
        </>
      )}

      <p className="text-[10px] leading-tight mt-2 italic">
        {t.footnote?.replace('{size}', usePortion ? `${servingSize}${servingUnit}` : '100g') || 
        `* Based on a serving size. 2,000 calories a day is used for general nutrition advice.`}
      </p>
    </div>
  );
}