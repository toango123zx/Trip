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
      console.log('Saved location name to localStorage:', locationName);

      setIsGeneratingDescription(true);
      
      console.log('Calling geminiService.generateTravelDescription...');
      const description = await geminiService.generateTravelDescription(locationName);
      
      console.log('Generated Description:', description);
      
      form.setValue('description', description, { 
        shouldValidate: true, 
        shouldDirty: true,
        shouldTouch: true
      });
      
      setLocationDescription(description);
      
      console.log('Current form description after setValue:', form.getValues('description'));
      
      notificationUtils.success();

      return description;
    } catch (error) {
      console.error('Error in generateLocationDescription:', error);
      
      notificationUtils.error();
      throw error;
    } finally {
      setIsGeneratingDescription(false);
      console.log('generateLocationDescription process completed');
    }
  }, [form]);

  const clearLocationDescription = () => {
    console.log('Clearing location description');
    
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