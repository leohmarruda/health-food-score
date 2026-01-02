/**
 * Processes food images using AI to extract nutritional information.
 * 
 * @param imageUrls - Array of image URLs to process
 * @param mode - Processing mode: 'full-scan' or 'rescan'
 * @returns Processed data from API
 * @throws Error if processing fails
 */
export const processImages = async (imageUrls: string[], mode: 'full-scan' | 'rescan') => {
    const response = await fetch('/api/process-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imageUrls, mode }),
    });
    
    if (!response.ok) throw new Error("Processing failed");
    return response.json();
  };

/**
 * Deletes a food record from the database.
 * 
 * @param id - Food record ID to delete
 * @returns True if deletion succeeds
 * @throws Error if deletion fails
 */
export const deleteFoodRecord = async (id: string) => {
    const res = await fetch(`/api/foods/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete');
    }
    return true;
  };