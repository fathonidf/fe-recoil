import apiClient from '@/lib/axios';

export interface SellerProfile {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  // add more fields as needed
}

export async function fetchSellerProfile(isAgent: boolean, id: number): Promise<SellerProfile> {
  if (isAgent) {
    // user is agent, fetch member/agent profile by agent_id
    const res = await apiClient.get<SellerProfile>(`/member/agent/profile/${id}/`);
    return res.data;
  } else {
    // user is member, fetch member profile by member_id
    const res = await apiClient.get<SellerProfile>(`/member/profile/${id}/`);
    return res.data;
  }
}
