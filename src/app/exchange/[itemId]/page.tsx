"use client"

import { fetchItemDetail } from '@/services/itemDetail.service';
import { fetchSellerProfile, SellerProfile } from '@/services/sellerProfile.service';
import { addToCart } from '@/services/cart.service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios";

import * as React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export default function ItemDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
    const { user, isAuthenticated, fetchProfile, logout, isLoading } = useAuthContext()
    
  type Item = {
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
  };

  const [item, setItem] = useState<Item | null>(null);
  const [qty, setQty] = useState(1);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Offer modal state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerMessage, setOfferMessage] = useState<string | null>(null);

  const unwrappedParams = React.use(params);
  const itemId = unwrappedParams.itemId;

  // TODO: Replace this with your actual user context/hook
//   const user = null; // e.g. useUser() or get from context/provider
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const data = await fetchItemDetail(itemId);
        if (ignore) return;
        setItem(data);
        setQty(1);
        let sellerProfile = null;
        try {
          if (data.agent_id) {
            sellerProfile = await fetchSellerProfile(true, data.agent_id);
          } else if (data.member_id) {
            sellerProfile = await fetchSellerProfile(false, data.member_id);
          }
        } catch {
          console.error('Failed to fetch seller profile');
        }
        if (!ignore) setSeller(sellerProfile);
      } catch {
        if (!ignore) setError('Failed to load item details');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [itemId]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!item) return null;

  return (
    <div className="container mx-auto px-2 md:px-4 py-8">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
        {/* Left: Image & Main Info */}
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-64">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="rounded-lg w-full max-w-xs object-contain" />
            ) : (
              <div className="w-full max-w-xs h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                <span className="text-6xl">🛢️</span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{item.name}</h1>
              <div className="text-lg md:text-2xl text-[#04BB84] font-bold mb-2">Rp {item.price.toLocaleString()} <span className="text-base font-normal text-gray-600">/ {item.unit}</span></div>
              {typeof item.distance_km === 'number' && (
                <div className="mb-2 text-gray-500 text-sm">{item.distance_km.toFixed(2)} km away</div>
              )}
              <div className="mb-2 text-gray-700">Stock: <span className="font-semibold">{item.stock}</span></div>
              <div className="mb-2 text-gray-700">Category: <span className="font-semibold capitalize">{item.category}</span></div>
            </div>
            {/* Quantity & Actions */}
            <div className="flex flex-col gap-2 mt-4 w-full max-w-xs">
              <div className="flex items-center mb-1">
                <label className="font-medium mr-4">Quantity</label>
                <div className="flex items-center border rounded px-2 py-1 bg-gray-50">
                  <button
                    className="px-2 text-lg font-bold text-[#04BB84]"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >-</button>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={qty}
                    onChange={e => setQty(Math.max(1, Math.min(item.stock, Number(e.target.value))))}
                    className="w-12 text-center border-none bg-transparent focus:outline-none"
                  />
                  <button
                    className="px-2 text-lg font-bold text-[#04BB84]"
                    onClick={() => setQty(q => Math.min(item.stock, q + 1))}
                    disabled={qty >= item.stock}
                  >+</button>
                  <span className="ml-2 text-xs text-gray-500">{item.stock} available</span>
                </div>
              </div>
              {user?.is_agent ? (
                <>
                  <button
                    className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors w-full mt-2"
                    onClick={() => setOfferModalOpen(true)}
                  >
                    Make an Offer
                  </button>
                  {offerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          onClick={() => { setOfferModalOpen(false); setOfferPrice(''); setOfferMessage(null); }}
                        >✕</button>
                        <h2 className="text-lg font-bold mb-4">Make an Offer</h2>
                        <label className="block mb-2 text-sm font-medium">Offer Price (Rp)</label>
                        <input
                          type="number"
                          min={1}
                          value={offerPrice}
                          onChange={e => setOfferPrice(Number(e.target.value))}
                          className="w-full border rounded px-3 py-2 mb-4"
                          placeholder="Enter your offer price"
                        />
                        {offerMessage && (
                          <div className="mb-2 text-center text-green-600 text-sm">{offerMessage}</div>
                        )}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded"
                            onClick={() => { setOfferModalOpen(false); setOfferPrice(''); setOfferMessage(null); }}
                            disabled={offerLoading}
                          >Cancel</button>
                          <button
                            className="flex-1 bg-[#04BB84] text-white px-3 py-1 rounded hover:bg-[#039970] disabled:opacity-60"
                            disabled={offerLoading || !offerPrice}
                            onClick={async () => {
                              if (!item || !offerPrice) return;
                              setOfferLoading(true);
                              setOfferMessage(null);
                              try {
                                const res = await axios.post('/transaction/offers/create/', {
                                  item_id: item.id,
                                  price: offerPrice,
                                });
                                setOfferMessage(res.data?.message || "Offer created successfully");
                                setTimeout(() => {
                                  setOfferModalOpen(false);
                                  setOfferPrice('');
                                  setOfferMessage(null);
                                }, 1200);
                              } catch (e: any) {
                                setOfferMessage(e?.response?.data?.message || "Failed to create offer");
                              } finally {
                                setOfferLoading(false);
                              }
                            }}
                          >
                            {offerLoading ? "Submitting..." : "OK"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors w-full mt-2 disabled:opacity-60"
                  disabled={addingId === item.id}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!item) return;
                    setAddingId(item.id);
                    try {
                      await addToCart({
                        agent_id: item.agent_id || undefined,
                        member_id: item.member_id || undefined,
                        item_id: item.id,
                        quantity: qty,
                      });
                      // Optionally show a success message here
                    } catch {
                      // Optionally show an error message here
                    } finally {
                      setAddingId(null);
                    }
                  }}
                >
                  {addingId === item.id ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Right: Seller Info */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#E6F9F3] rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt={seller.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
          <div className="text-lg font-bold mb-1">{seller?.email || 'Seller'}</div>
          <button className="bg-[#4FCB9A] text-white px-3 py-1 rounded text-sm font-medium mb-3 flex items-center gap-1"><span>💬</span>Message</button>
          <div className="w-full">
            <div className="font-semibold text-gray-800 mb-2">Contact Information</div>
            <div className="bg-[#E6F9F3] rounded flex items-center px-3 py-2 mb-2">
              <span className="text-[#04BB84] font-semibold w-28">Email</span>
              <span className="text-gray-600 truncate">{seller?.email || '-'}</span>
            </div>
            <div className="bg-[#E6F9F3] rounded flex items-center px-3 py-2">
              <span className="text-[#04BB84] font-semibold w-28">Phone number</span>
              <span className="text-gray-600 truncate">{seller?.phone_number || '-'}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Product Details Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-xl font-bold mb-2">Product Details</div>
        <div className="mb-2 text-gray-600 text-sm">Please review the details below before placing your order.</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#E6F9F3] rounded-lg p-4 flex flex-col">
            <span className="font-semibold text-[#04BB84] mb-1">Category</span>
            <span className="text-gray-700">{item.category}</span>
          </div>
          <div className="bg-[#E6F9F3] rounded-lg p-4 flex flex-col">
            <span className="font-semibold text-[#04BB84] mb-1">Quantity</span>
            <span className="text-gray-700">{item.stock}</span>
          </div>
          <div className="bg-[#E6F9F3] rounded-lg p-4 flex flex-col">
            <span className="font-semibold text-[#04BB84] mb-1">Seller</span>
            <span className="text-gray-700">{item.member_id || item.agent_id}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Description</div>
          <div className="bg-[#F6F6F6] rounded p-3 text-gray-700 text-sm">{item.description}</div>
        </div>
      </div>
    </div>
  );
}
