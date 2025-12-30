import { useState } from 'react';
import { toast } from 'sonner';

import NutritionLabel from '@/components/NutritionLabel';
import { supabase } from '@/lib/supabase';
import { processImages } from '@/utils/api';
import type { FoodFormData } from '@/types/food';

interface ImageGalleryProps {
  images: Record<string, string>;
  formData: FoodFormData;
  dict: any;
  lang: string;
  foodId: string;
  onImageUpdate: (tab: string, url: string) => void;
  onFormDataUpdate: (data: Partial<FoodFormData>) => void;
}

// Constants
const TAB_CONFIG = [
  { id: 'front', dbKey: 'front_photo_url' },
  { id: 'back', dbKey: 'back_photo_url' },
  { id: 'nutrition', dbKey: 'nutrition_label_url' },
  { id: 'ingredients', dbKey: 'ingredients_photo_url' }
];

export default function ImageGallery({
  images,
  formData,
  dict,
  lang,
  foodId,
  onImageUpdate,
  onFormDataUpdate
}: ImageGalleryProps) {
  // State
  const [activeTab, setActiveTab] = useState('front');
  const [uploading, setUploading] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);

  // Event handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !dict) return;
    
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${activeTab}-${file.name.replace(/[^a-z0-9]/gi, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(uploadData.path);
      
      const dbKey = TAB_CONFIG.find(t => t.id === activeTab)?.dbKey;
      if (dbKey) {
        await supabase.from('foods').update({ [dbKey]: publicUrl }).eq('id', foodId);
        onImageUpdate(activeTab, publicUrl);
      }
      
      toast.success(dict.edit.uploadSuccess);
    } catch (error: any) {
      toast.error(dict.edit.uploadError);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRescan = async () => {
    const currentImage = images[activeTab];
    if (!currentImage) {
      toast.error(dict?.edit?.noPhoto || 'No image available to rescan');
      return;
    }

    setIsRescanning(true);
    try {
      const data = await processImages([currentImage], 'rescan');
      onFormDataUpdate({
        ...data,
        ingredients_raw: data.ingredients_raw || formData.ingredients_raw,
        nutrition_raw: data.nutrition_raw || formData.nutrition_raw,
        declared_special_nutrients: data.declared_special_nutrients || formData.declared_special_nutrients
      });
      toast.success(dict?.edit?.rescanSuccess || 'Image rescanned successfully');
    } catch (err) {
      console.error(err);
      toast.error(dict?.edit?.rescanError || 'Failed to rescan image');
    } finally {
      setIsRescanning(false);
    }
  };

  return (
    <div className="lg:w-1/3 space-y-6">
      <h2 className="text-xl font-bold border-b border-text-main/10 pb-2 text-text-main flex justify-between items-center">
        {dict.edit.imageTitle}
        <button
          onClick={handleRescan}
          disabled={isRescanning}
          className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-theme border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition"
        >
          {isRescanning ? dict.edit.scanning : `↺ ${dict.edit.btnReprocess}`}
        </button>
      </h2>
      <div className="flex bg-text-main/5 p-1 rounded-theme gap-1">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-[10px] uppercase font-bold py-2 rounded-theme transition ${
              activeTab === tab.id
                ? 'bg-card text-primary shadow-sm'
                : 'text-text-main/60 hover:text-text-main'
            }`}
          >
            {dict?.addFood?.[`slot${tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}`] || tab.id}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="relative group min-h-[300px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
          {images[activeTab] ? (
            <img
              src={images[activeTab]}
              className="w-full object-contain max-h-[500px]"
              alt="Reference"
            />
          ) : (
            <div className="text-text-main/40 text-sm italic">
              {dict.edit.noPhoto} {activeTab}
            </div>
          )}
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-theme shadow-lg hover:opacity-90 transition flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>📤 {dict.edit.btnUpload}</span>
              )}
            </label>
          </div>
        </div>
        <div className="pt-4 flex justify-center bg-background rounded-theme p-4 border border-text-main/10">
          <NutritionLabel data={formData} dict={dict} />
        </div>
      </div>
    </div>
  );
}

