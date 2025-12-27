import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipagem alterada para Promise
) {
  // No Next.js 15, params e cookies devem ser aguardados (await)
  const { id } = await params; 
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // 1. Buscar as URLs das imagens
    const { data: food } = await supabase
      .from('foods')
      .select('front_photo_url, nutrition_label_url, ingredients_photo_url, back_photo_url')
      .eq('id', id)
      .single();

    if (food) {
      const filesToDelete = Object.values(food)
        .filter(Boolean)
        .map((url: any) => url.split('/').pop());

      if (filesToDelete.length > 0) {
        await supabase.storage.from('food-images').remove(filesToDelete);
      }
    }

    // 2. Deletar o registro
    const { error } = await supabase.from('foods').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}