import useSWR from 'swr';
import { api } from '../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data);

export function useCategoriesTree() {
  const { data, error, isLoading } = useSWR(`/categories/tree`, fetcher);
  return { data, error, isLoading };
}

