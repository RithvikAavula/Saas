import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data
    }
  })
}

export function usePricingPlans() {
  return useQuery({
    queryKey: ['pricing_plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data
    }
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      
      if (error) throw error
      return data
    }
  })
}