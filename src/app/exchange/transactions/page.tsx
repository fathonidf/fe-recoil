"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import Image from "next/image";

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  ongoing: { label: "On Going", color: "bg-yellow-100 text-yellow-700", icon: "🛒" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: "🏷️" },
  delivered: { label: "Product Delivered", color: "bg-green-500 text-white", icon: "" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Transactions");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await axios.get("transaction/history/");
        setTransactions(res.data.transactions || []);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const tabs = [
    "Browse Product",
    "My Store",
    "Transactions",
    "Messages"
  ];
  const categories = [
    "All Categories",
    "Cooking Oil",
    "Motor Oil",
    "Paint",
    "Others"
  ];

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute -left-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
      <div className="absolute -right-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
          className="rotate-180"
        />
      </div>
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
                  onClick={() => router.push('/cart')}
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
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 z-50 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors first:rounded-t-lg last:rounded-b-lg z-50 cursor-pointer ${
                            selectedCategory === category ? 'bg-[#04BB84] text-white hover:bg-[#04BB84]' : 'text-gray-700'
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
        {/* Transactions Content */}
        <div className="max-w-5xl mx-auto border-2 border-dotted border-[#04BB84] rounded-xl bg-white/80 p-4 md:p-8">
          <h2 className="text-2xl font-bold text-[#04BB84] mb-6">Transactions</h2>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No transactions found.</div>
          ) : (
            <div className="space-y-8">
              {transactions.map((tx) => (
                <div key={tx.id} className="mb-6 border rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-4 px-6 pt-6 pb-2">
                    <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">
                      <span role="img" aria-label="shop">{tx.agent_name === 'Biodiesel Shop' ? '🏪' : '👤'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg md:text-xl text-[#04BB84] flex items-center gap-2">
                        {tx.agent_name}
                      </div>
                    </div>
                    <div className={`ml-auto flex items-center gap-2 ${statusMap[tx.status]?.color || ''} px-3 py-1 rounded-full font-semibold text-sm`}>
                      {statusMap[tx.status]?.icon}
                      {statusMap[tx.status]?.label || tx.status}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 px-6 pb-6">
                    <div className="w-32 h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      <span className="text-4xl">🛢️</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-1">{tx.item_name}</div>
                      <div className="text-gray-700 mb-1">Quantity: <span className="font-bold">{tx.quantity}</span></div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[160px]">
                      <div className="text-[#04BB84] font-bold text-xl">Rp {tx.total_price.toLocaleString()}</div>
                      {tx.status === 'completed' && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold">Product Delivered</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
