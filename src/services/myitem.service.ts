import apiClient from '@/lib/axios';
import { Item } from './item.service';

export async function fetchMyItems(): Promise<Item[]> {
  const res = await apiClient.get<{ status: string; items: Item[]; count: number }>('/item/my');
  return res.data.items;
}
