'use client';

import { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  title: string;
}

export function useMainServiceCategories({serviceId}: {serviceId: string | undefined}) {
  const [mainServiceCategories, setMainServiceCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      setMainServiceCategories([]);
      return;
    }
    async function fetchMainServiceCategories() {
      try {
        const res = await fetch(`/api/services/${serviceId}/categories?serviceId=${serviceId}`);
        const json = await res.json();
       
        if (json.success) {
          setMainServiceCategories(json.data.map((category: any) => ({
            value: category.id,
            label: category.title,
          })));
        }
        console.log('mainServiceCategories:', mainServiceCategories);
      } catch (error) {
        console.error('Error fetching makes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMainServiceCategories();
  }, [serviceId]);

  return { mainServiceCategories, loading };
}

export function useCategorySpecailizations({categoryId}: {categoryId: string | undefined}) {
  const [categorySpecailizations, setCategorySpecailizations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setCategorySpecailizations([]);
      return;
    }

    async function fetchCategorySpecailizations() {
      setLoading(true);
        console.log(categoryId);
      try {
        const res = await fetch(`/api/categories/${categoryId}/specailizations?categoryId=${categoryId}`);
        const json = await res.json();
        console.log(json);
        
        if (json.success) {
          setCategorySpecailizations(json.data.map((specailization: any) => ({
            value: specailization.id,
            label: specailization.title,
          })));
        }
      } catch (error) {
        console.log(error);
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorySpecailizations();
  }, [categoryId]);

  return { categorySpecailizations, loading };
}

// ==================== SERVICE ORDER API ====================

export interface CarInfo {
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  vinNumber: string;
}

export interface ServiceOrderRequest {
  mainServiceCategoryId: number;
  categorySpecializationId: number;
  date: string;
  time: string;
  scheduleType: string;
  description: string;
  location: string;
  serviceAreaCenter: string;
  serviceAreaRadius: number;
  minBudget: number;
  maxBudget: number;
  orderExpirationHours: number;
  notes: string;
  carInfo: CarInfo;
}

export interface ServiceOrderResponse {
  id: number;
  [key: string]: any;
}

/**
 * Create a new service order by calling the Next.js API route
 */
export const createServiceOrder = async (
  orderData: ServiceOrderRequest
): Promise<ServiceOrderResponse> => {
  try {
    const response = await fetch('/api/service-orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      const message =
        status === 401 ||status===403
          ? 
            'يرجى تسجيل الدخول أو التسجيل كطالب خدمة لإنشاء الطلب.'
          : (errorData.error as string) ||
            (errorData.message as string) ||
            `HTTP error! status: ${response.status}`;
      const err = new Error(message) as Error & { status?: number; code?: string };
      err.status = status;
      err.code = errorData.code;
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

/**
 * Fetch a single service order by ID
 */
export const getServiceOrder = async (orderId: string): Promise<ServiceOrderResponse> => {
  try {
    const response = await fetch(`/api/service-orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data?.data ?? data;
  } catch (error) {
    console.error('Error fetching service order:', error);
    throw error;
  }
};

/**
 * Helper function to transform form data to API format with null checks
 */
export const transformFormDataToApiFormat = (formData: any): ServiceOrderRequest => {
  // Validate required fields
  if (!formData) {
    throw new Error('Form data is null or undefined');
  }

  if (!formData.categoryId) {
    throw new Error('Category ID is required');
  }

  if (!formData.specailizationId) {
    throw new Error('Specialization ID is required');
  }

  // Get current date/time for defaults
  const now = new Date();
  const currentDate = now.toISOString();
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

  return {
    mainServiceCategoryId: parseInt(formData.categoryId) || 0,
    categorySpecializationId: parseInt(formData.specailizationId) || 0,
    date: formData.date ? new Date(formData.date).toISOString() : currentDate,
    time: formData.time || currentTime,
    scheduleType: formData.scheduleType || "scheduled",
    description: formData.description || "",
    location: formData.location || "",
    serviceAreaCenter: formData.serviceAreaCenter || "24.7136, 46.6753",
    serviceAreaRadius: parseFloat(formData.serviceAreaRadius?.toString() || "5") || 5,
    minBudget: parseFloat(formData.minBudget?.toString() || "0") || 0,
    maxBudget: parseFloat(formData.maxBudget?.toString() || "0") || 0,
    orderExpirationHours: parseInt(formData.orderExpirationHours?.toString() || "24") || 24,
    notes: formData.notes || "",
    carInfo: {
      make: formData.make || "",
      model: formData.model || "",
      year: formData.year || "",
      plateNumber: formData.plateNumber || "",
      mileage: formData.mileage || "",
      transmission: formData.transmission || "",
      fuelType: formData.fuelType || "",
      vinNumber: formData.vinNumber || "",
    },
  };
};

/**
 * Hook to submit service order with loading and error states
 */
export function useServiceOrderSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ServiceOrderResponse | null>(null);

  const submitOrder = async (formData: any) => {
    // Early validation
    if (!formData) {
      const errorMsg = 'البيانات مفقودة. يرجى العودة وإكمال النموذج.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    if (!formData.categoryId || !formData.specailizationId) {
      const errorMsg = 'يرجى اختيار نوع الخدمة والتخصص.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsSubmitting(true);
    setError(null);
    setResponse(null);

    try {
      const apiData = transformFormDataToApiFormat(formData);

      const response = await fetch('/api/service-orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const status = response.status;
        const message = status==401 || status==403 ? 'يرجى تسجيل الدخول أو التسجيل كطالب خدمة لإنشاء الطلب.' : 'جدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.';
           
        setError(message);
        const err = new Error(message) as Error & { status?: number };
        err.status = status;
        throw err;
      }

      const data = await response.json();
      setResponse(data);
      console.log('data:', data)
      return data;
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setIsSubmitting(false);
    setError(null);
    setResponse(null);
  };

  return { 
    submitOrder, 
    isSubmitting, 
    error, 
    response,
    resetState 
  };
}