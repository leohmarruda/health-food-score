import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  try {
    // 1. Buscar as URLs das imagens antes de deletar o registro
    const { data: food } = await supabase
      .from('foods')
      .select('front_photo_url, nutrition_label_url, ingredients_photo_url, back_photo_url')
      .eq('id', id)
      .single();

    if (food) {
      // 2. Extrair nomes dos arquivos das URLs
      const filesToDelete = Object.values(food)
        .filter(Boolean)
        .map((url: any) => url.split('/').pop());

      if (filesToDelete.length > 0) {
        await supabase.storage.from('food-images').remove(filesToDelete);
      }
    }

    // 3. Deletar o registro do banco
    const { error } = await supabase.from('foods').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}