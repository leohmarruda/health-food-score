import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();

    const { error } = await supabase
      .from('foods')
      .update({
        name: body.name,
        brand: body.brand,
        category: body.category,
        hfs: body.hfs,
        energy_kcal: body.energy_kcal,
        protein_g: body.protein_g,
        carbs_total_g: body.carbs_total_g,
        fat_total_g: body.fat_total_g,
        sodium_mg: body.sodium_mg,
        fiber_g: body.fiber_g,
        saturated_fat_g: body.saturated_fat_g,
        trans_fat_g: body.trans_fat_g,
        portion_size_value: body.portion_size_value,
        portion_unit: body.portion_unit,
        ingredients_list: body.ingredients_list, 
        ingredients_raw: body.ingredients_raw, 
        nutrition_raw: body.nutrition_raw, 
        declared_special_nutrients: body.declared_special_nutrients, 
        declared_processes: body.declared_processes,
        last_update: body.last_update        
      })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}