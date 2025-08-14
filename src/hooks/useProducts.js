import useSWR from 'swr';
import { api } from '../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data);

export function useProducts(params = '') {
  const { data, error, isLoading } = useSWR(`/products${params}`, fetcher);
  return { data, error, isLoading };
}

export function useFeaturedProducts(categoryId) {
  const qs = categoryId ? `?category_id=${categoryId}` : '';
  const { data, error, isLoading } = useSWR(`/products/featured${qs}`, fetcher);
  return { data, error, isLoading };
}

