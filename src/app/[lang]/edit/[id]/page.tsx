'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

import ConfirmModal from '@/components/ConfirmModal';
import Spinner from '@/components/Spinner';
import BasicInfoSection from '@/components/forms/BasicInfoSection';
import ExtraDataSection from '@/components/forms/ExtraDataSection';
import ImageGallery from '@/components/forms/ImageGallery';
import NutritionFactsSection from '@/components/forms/NutritionFactsSection';
import { useFoodForm } from '@/hooks/useFoodForm';
import { useLockedFields } from '@/hooks/useLockedFields';
import { useSaveFood } from '@/hooks/useSaveFood';
import { getDictionary } from '@/lib/get-dictionary';
import { supabase } from '@/lib/supabase';
import { deleteFoodRecord } from '@/utils/api';
import { cleanFoodData, extractImageUrls } from '@/utils/form-helpers';

export default function EditFood() {
  // Hooks
  const { id, lang } = useParams();
  const router = useRouter();
  const {
    formData,
    originalData,
    images,
    dirty,
    initializeForm,
    updateField,
    updateFormData,
    updateImage,
    setFormData,
    setOriginalData
  } = useFoodForm();

  const { isLocked, toggleLock } = useLockedFields();

  // State
  const [loading, setLoading] = useState(true);
  const [dict, setDict] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Data fetching
  const fetchLatestData = async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const cleanData = cleanFoodData(data);
        setFormData(cleanData);
        setOriginalData(cleanData);
        const imageUrls = extractImageUrls(data);
        Object.keys(imageUrls).forEach(key => {
          updateImage(key, imageUrls[key]);
        });
      }
    } catch (err) {
      console.error('Error syncing data:', err);
      toast.error(dict?.pages?.edit?.loadError || 'Failed to load latest data');
    }
  };

  // Custom hooks (must be after state and functions they depend on)
  const { saveFood, isSaving } = useSaveFood(id as string, dict, fetchLatestData);

  // Effects
  useEffect(() => {
    async function init() {
      const [d, { data }] = await Promise.all([
        getDictionary(lang as 'pt' | 'en'),
        supabase.from('foods').select('*').eq('id', id).single()
      ]);

      setDict(d);

      if (data) {
        initializeForm(data);
      }
      setLoading(false);
    }
    init();
  }, [id, lang, initializeForm]);

  // Event handlers
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveFood(formData);
  };

  const handleCancelClick = () => {
    if (dirty) {
      setShowCancelModal(true);
    } else {
      router.back();
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFoodRecord(id as string);
      toast.success(dict?.pages?.edit?.deleteSuccess || 'Food item deleted successfully');
      router.push(`/${lang}/manage`);
      router.refresh();
    } catch (err) {
      toast.error(dict?.pages?.edit?.deleteError || 'Failed to delete food item');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dict || !dict.pages?.edit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const t = dict.pages.edit;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-10">
        <ImageGallery
          images={images}
          formData={formData}
          dict={dict}
          lang={lang as string}
          foodId={id as string}
          onImageUpdate={updateImage}
          onFormDataUpdate={updateFormData}
          lockedFields={isLocked}
        />
        <div className="lg:w-2/3 bg-card p-8 rounded-theme shadow-sm border border-text-main/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-text-main/10">
            <h2 className="text-2xl font-black text-text-main tracking-tight">{t.editorTitle}</h2>
            {formData.last_update && (
              <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-theme border border-text-main/10">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-text-main/50 leading-none mb-1">
                    {t.lastUpdatedLabel}
                  </p>
                  <p className="text-xs font-mono text-text-main leading-none">
                    {new Date(formData.last_update).toLocaleString(
                      lang === 'pt' ? 'pt-BR' : 'en-US'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <BasicInfoSection 
              formData={formData} 
              dict={dict} 
              onChange={updateField}
              isLocked={isLocked}
              onToggleLock={toggleLock}
            />
            <NutritionFactsSection
              formData={formData}
              dict={dict}
              isDirty={dirty}
              onChange={updateField}
              isLocked={isLocked}
              onToggleLock={toggleLock}
            />
            <ExtraDataSection 
              formData={formData} 
              dict={dict} 
              onChange={updateField}
              isLocked={isLocked}
              onToggleLock={toggleLock}
            />

            <div className="border-t border-text-main/10 pt-8 mt-8">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="flex-1 px-6 py-3 border border-text-main/20 text-text-main/70 hover:text-text-main hover:border-text-main/40 hover:bg-text-main/5 font-medium transition-all rounded-theme bg-background flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {dict?.common?.cancel || 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSaving || !dirty}
                  className="flex-1 px-8 py-3 bg-primary text-white rounded-theme font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Spinner />
                      <span>{t.saving || 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t.btnSave || 'Save and Calculate HFS'}
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-6 py-3 border-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500/60 active:scale-[0.98] font-semibold transition-all rounded-theme bg-background flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{t.btnDelete || 'Delete Record Permanently'}</span>
                </button>
                <p className="text-xs text-center text-text-main/50 dark:text-text-main/40 mt-3 font-medium">
                  {dict?.pages?.edit?.deleteWarning || 'This action cannot be undone'}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        isOpen={showCancelModal}
        title={t.discardTitle || 'Discard changes?'}
        message={
          t.discardMessage ||
          'You have made changes to this food item. Are you sure you want to leave without saving?'
        }
        variant="info"
        confirmLabel={t.discardConfirm || 'Yes, leave'}
        cancelLabel={t.discardCancel || 'Continue editing'}
        onConfirm={() => router.back()}
        onCancel={() => setShowCancelModal(false)}
        dict={dict}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        title={t.confirmDeleteTitle || 'Delete Food Item?'}
        message={
          t.confirmDeleteMessage ||
          'This action is permanent and will remove all data and images.'
        }
        variant="danger"
        confirmLabel={t.btnDeleteConfirm || 'Yes, Delete'}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        dict={dict}
      />
    </div>
  );
}
