"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Cart");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      try {
        const res = await axios.get("/transaction/cart/");
        const data = res.data;
        setCart(data.cart || []);
        setAgentInfo(data.agent_info || null);
        setTotalItems(data.total_items || 0);
        setTotalValue(data.total_value || 0);
      } catch {
        setCart([]);
        setAgentInfo(null);
        setTotalItems(0);
        setTotalValue(0);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleDelete = (item_id: number) => {
    setCart((prev) => prev.filter((item) => item.item_id !== item_id));
    // Optionally, call API to delete from cart
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  const tabs = ["Browse Product", "My Store", "Transactions", "Messages"];
  const categories = ["All Categories", "Cooking Oil", "Motor Oil", "Paint", "Others"];

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            Small Actions, Big Impact!
          </h1>
          <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
            Connect, exchange, and recycle quality liquid waste effortlessly!
          </p>
        </div>
        {/* Tab Navigation */}
        <div className="mb-8 relative z-20">
          <div className="bg-white rounded-xl p-2 shadow-sm max-w-6xl mx-auto">
            <div className="grid grid-cols-4 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "Browse Product") router.push("/exchange");
                    else if (tab === "My Store") router.push("/exchange?tab=My%20Store");
                    else if (tab === "Transactions") router.push("/exchange/transactions");
                    else if (tab === "Messages") router.push("/exchange/messages");
                    setActiveTab(tab);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#04BB84] text-white shadow-[0_4px_8px_rgba(4,187,132,0.3)] transform translate-y-[-2px] border-b-4 border-[#039970]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#04BB84]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Search and Filter Section */}
        <div className="mb-8 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full bg-white rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#04BB84] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#04BB84] text-[#04BB84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BB84] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* My Cart Button */}
                <button
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-[#04BB84] text-[#04BB84] rounded-lg hover:bg-[#04BB84] hover:text-white transition-all duration-300 whitespace-nowrap"
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>My Cart</span>
                </button>
                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="cursor-pointer text-[#04BB84] flex items-center gap-2 px-4 py-2 bg-white border border-[#04BB84] rounded-lg hover:bg-gray-50 transition-all duration-300 min-w-[160px] justify-between whitespace-nowrap"
                  >
                    <span>{selectedCategory}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 z-50 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors first:rounded-t-lg last:rounded-b-lg z-50 cursor-pointer ${
                            selectedCategory === category
                              ? "bg-[#04BB84] text-white hover:bg-[#04BB84]"
                              : "text-gray-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cart Content */}
        <div className="max-w-5xl mx-auto border-2 border-dotted border-[#04BB84] rounded-xl bg-white/80 p-4 md:p-8">
          {/* Cart Shop Group */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">
                <span role="img" aria-label="shop">
                  🏪
                </span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl md:text-2xl text-[#04BB84] flex items-center gap-2">
                  {agentInfo?.agent_name || "Shop"}{" "}
                  <span className="bg-[#E6F9F3] text-[#04BB84] px-2 py-1 rounded text-xs font-medium ml-2">
                    Store
                  </span>
                </div>
                <div className="text-gray-500 text-sm">{agentInfo?.agent_email}</div>
              </div>
            </div>
            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={item.item_id}
                className="flex flex-col md:flex-row items-center gap-4 border rounded-lg p-4 mb-4 bg-white shadow-sm"
              >
                <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  {/* No image in API, fallback to icon */}
                  <span className="text-4xl">🛢️</span>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <div className="font-semibold text-lg">{item.item_name}</div>
                  <div className="text-[#04BB84] font-bold text-xl">
                    Rp {item.price.toLocaleString()} / L
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-xl">
                      Quantity: <span className="font-semibold">{item.quantity}</span>
                    </span>
                  </div>
                </div>
                <button
                  className="bg-[#FF5C35] text-white px-6 py-2 rounded font-bold hover:bg-[#e04a25] transition-colors"
                  onClick={() => handleDelete(item.item_id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          {/* Cart Summary */}
          <div className="flex flex-col md:flex-row items-center justify-between border-t pt-6 mt-6">
            <div className="text-lg md:text-xl font-semibold">
              Quantity: <span className="text-[#04BB84]">{totalItems}</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">
              Total: <span className="text-[#04BB84]">Rp {totalValue.toLocaleString()}</span>
            </div>
            <button
              className="bg-[#04BB84] text-white px-8 py-3 rounded font-bold text-lg hover:bg-[#039970] transition-colors mt-4 md:mt-0"
              onClick={async () => {
                try {
                  await axios.post("/transaction/checkout/");
                  router.push("/exchange");
                } catch (e) {
                  alert("Checkout failed");
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
