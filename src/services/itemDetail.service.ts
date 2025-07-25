import apiClient from '@/lib/axios';
import { Item } from './item.service';

export async function fetchItemDetail(id: number | string): Promise<Item> {
  const res = await apiClient.get<Item>(`/item/${id}`);
  return res.data;
}
