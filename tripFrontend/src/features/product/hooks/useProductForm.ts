import { useState, useCallback, useEffect } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { TRequestBodyCreateProduct } from '../product.type';
import { geminiService } from '@/services/geminiService';
import { notificationUtils } from '@/utils/notificationUtils';

export const useProductForm = () => {
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const form: UseFormReturn<TRequestBodyCreateProduct> = useForm<TRequestBodyCreateProduct>({
    defaultValues: {
      name: '',
      locationId: '',
      description: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const generateLocationDescription = useCallback(async (locationName: string) => {

    try {
      geminiService.saveLocationName(locationName);

      setIsGeneratingDescription(true);
      
      const description = await geminiService.generateTravelDescription(locationName);
      
      
      form.setValue('description', description, { 
        shouldValidate: true, 
        shouldDirty: true,
        shouldTouch: true
      });
      
      setLocationDescription(description);
      
      
      notificationUtils.success();

      return description;
    } catch (error) {
      
      notificationUtils.error();
      throw error;
    } finally {
      setIsGeneratingDescription(false);
      ('generateLocationDescription process completed');
    }
  }, [form]);

  const clearLocationDescription = () => {
    
    geminiService.clearLocationName();
    setLocationDescription('');
    form.setValue('description', '', { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    });
  };

  return {
    form,
    generateLocationDescription,
    clearLocationDescription,
    locationDescription,
    isGeneratingDescription,
  };
}; 