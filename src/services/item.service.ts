import apiClient from '@/lib/axios';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  agent_id: number | null;
  member_id: number | null;
  category: string;
  unit: string;
  created_at: string;
  image_url: string | null;
  distance_km: number;
}

export interface ItemListResponse {
  status: string;
  items: Item[];
  count: number;
}

export async function fetchAllItems(): Promise<Item[]> {
  const res = await apiClient.get<ItemListResponse>('/item/all');
  return res.data.items;
}
