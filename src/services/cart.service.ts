import apiClient from '@/lib/axios';

export async function addToCart({ agent_id, member_id, item_id, quantity }: {
  agent_id?: number;
  member_id?: number;
  item_id: number;
  quantity: number;
}) {
  const payload: any = { item_id, quantity };
  if (agent_id) payload.agent_id = agent_id;
  if (member_id) payload.member_id = member_id;
  return apiClient.post('/transaction/cart/add/', payload);
}
