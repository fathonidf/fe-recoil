"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { fetchAllItems, Item } from '@/services/item.service'
import { addToCart } from '@/services/cart.service'
import { fetchMyItems } from '@/services/myitem.service'
import Image from "next/image"
import { Search, ShoppingCart, ChevronDown, Upload, X } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"
import axios from "@/lib/axios"

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState("Browse Product")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, user } = useAuthContext()

  const router = useRouter();
  // Items state
  const [items, setItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [errorItems, setErrorItems] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<number | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerMessage, setOfferMessage] = useState<string | null>(null);
  const [offerItem, setOfferItem] = useState<Item | null>(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addProductMessage, setAddProductMessage] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    product_title: '',
    description: '',
    price: '',
    quantity: '',
    waste_category: '',
    image: null as File | null,
  });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only require authentication for "My Store" tab
    if (activeTab === 'My Store' && !isAuthenticated) return;
    
    setLoadingItems(true);
    setErrorItems(null);
    const fetchFn = activeTab === 'My Store' ? fetchMyItems : fetchAllItems;
    fetchFn()
      .then(setItems)
      .catch(() => setErrorItems('Failed to load items'))
      .finally(() => setLoadingItems(false));
  }, [isAuthenticated, activeTab])

  // Filter items based on search query and selected category
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(item.category.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    "Browse Product",
    "My Store", 
    "Transactions"
  ]

  const categories = [
    "All Categories",
    "cooking oil",
    "motor oil", 
    "paint",
    "others"
  ]

  // Handle product form input
  const handleProductInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductForm(prev => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProductImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setProductImagePreview(null);
    }
  };

  const removeProductImage = () => {
    setProductForm(prev => ({ ...prev, image: null }));
    setProductImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddProductLoading(true);
    setAddProductMessage(null);
    try {
      const formData = new FormData();
      formData.append('product_title', productForm.product_title);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('quantity', productForm.quantity);
      formData.append('waste_category', productForm.waste_category);
      formData.append('unit', 'Liter');
      if (productForm.image) formData.append('image', productForm.image);

      // Important: do NOT set Content-Type header, let browser set it for FormData
      await axios.post("/item/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAddProductMessage('Product added successfully!');
      setTimeout(() => {
        setAddProductModalOpen(false);
        setProductForm({
          product_title: '',
          description: '',
          price: '',
          quantity: '',
          waste_category: '',
          image: null,
        });
        setProductImagePreview(null);
        setAddProductMessage(null);
        setActiveTab('My Store');
      }, 1200);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Failed to add product';
      setAddProductMessage(errorMessage);
    } finally {
      setAddProductLoading(false);
    }
  };

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
        {/* Only show main content if modal is not open */}
        {!offerModalOpen && !addProductModalOpen && (
          <>
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
                <div className="grid grid-cols-3 gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (tab === "Transactions") {
                          router.push("/exchange/transactions");
                        } else {
                          setActiveTab(tab);
                        }
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
                    {/* Right Button: Add Product for My Store, Categories Dropdown otherwise */}
                    {activeTab === "My Store" ? (
                      <button
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#04BB84] text-white rounded-lg hover:bg-[#039970] transition-all duration-300 whitespace-nowrap"
                        onClick={() => setAddProductModalOpen(true)}
                      >
                        + Add Product
                      </button>
                    ) : (
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
                                className={`w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors first:rounded-t-lg last:rounded-b-lg z-50 cursor-pointer capitalize ${
                                  selectedCategory === category ? 'bg-[#04BB84] text-white hover:bg-[#04BB84]' : 'text-gray-700'
                                }`}
                              >
                                {category === 'All Categories' ? category : category}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Content Based on Authentication */}
            {!isAuthenticated ? (
              // Not Logged In - Show Sign In Prompt Only
              
              <div className="text-center py-16 relative z-10">
                <div className="max-w-md mx-auto mb-8">
                  <Image
                    src="/exchange_page/exchange please sign in.svg"
                    alt="Please sign in illustration"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
                  Please sign in to view your Store
                </h2>
              </div>
            ) : (
              <>
                {/* Product Cards Grid */}
                <div className="max-w-6xl mx-auto relative z-10">
                  {loadingItems ? (
                    <div className="text-center py-10 text-gray-500">Loading products...</div>
                  ) : errorItems ? (
                    <div className="text-center py-10 text-red-500">{errorItems}</div>
                  ) : (
                    <>
                      {/* Results counter */}
                      {(searchQuery || selectedCategory !== 'All Categories') && (
                        <div className="mb-4 text-sm text-gray-600">
                          Showing {filteredItems.length} of {items.length} products
                          {searchQuery && ` for "${searchQuery}"`}
                          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.length === 0 ? (
                          <div className="col-span-full text-center text-gray-500">
                            {searchQuery || selectedCategory !== 'All Categories' 
                              ? 'No products match your search criteria.' 
                              : 'No products found.'
                            }
                          </div>
                        ) : (
                          filteredItems.map((item) => (
                          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                              {item.image_url ? (
                                <Image 
                                  src={item.image_url} 
                                  alt={item.name} 
                                  width={192}
                                  height={192}
                                  className="object-contain w-full h-full" 
                                />
                              ) : (
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-white font-bold text-xl">🛢️</span>
                                  </div>
                                  <p className="text-gray-600 text-sm">{item.category}</p>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              {/* Only show the title, no " - Liter" */}
                              <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                              <p className="text-gray-600 text-sm mb-1 capitalize">{item.category}</p>
                              {activeTab !== 'My Store' && (
                                typeof item.distance_km === 'number' ? (
                                  <p className="text-gray-500 text-xs mb-3">{item.distance_km.toFixed(2)} km away</p>
                                ) : (
                                  <p className="text-gray-500 text-xs mb-3">Distance unknown</p>
                                )
                              )}
                              <div className="flex items-center mb-3">
                                <span className="text-[#04BB84] font-bold text-lg">Rp{item.price.toFixed(2)}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="flex-1 bg-white border border-[#04BB84] text-[#04BB84] px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                                  onClick={() => router.push(`/exchange/${item.id}`)}
                                >
                                  View Details
                                </button>
                                {activeTab === 'My Store' ? (
                                  <button
                                    className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
                                    disabled={addingId === item.id}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      // TODO: Implement delete functionality
                                      console.log('Delete item:', item.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                ) : user?.is_agent ? (
                                  <>
                                    <button
                                      className="flex-1 bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors"
                                      onClick={() => { setOfferModalOpen(true); setOfferItem(item); }}
                                    >
                                      Make an Offer
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="flex-1 bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors disabled:opacity-60"
                                    disabled={addingId === item.id}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      setAddingId(item.id);
                                      try {
                                        await addToCart({
                                          agent_id: item.agent_id || undefined,
                                          member_id: item.member_id || undefined,
                                          item_id: item.id,
                                          quantity: 1,
                                        });
                                        // Optionally show a success message
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
                        ))
                      )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {/* Offer Modal rendered at root so it overlays everything */}
        {offerModalOpen && offerItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => { setOfferModalOpen(false); setOfferPrice(''); setOfferMessage(null); setOfferItem(null); }}
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
                  onClick={() => { setOfferModalOpen(false); setOfferPrice(''); setOfferMessage(null); setOfferItem(null); }}
                  disabled={offerLoading}
                >Cancel</button>
                <button
                  className="flex-1 bg-[#04BB84] text-white px-3 py-1 rounded hover:bg-[#039970] disabled:opacity-60"
                  disabled={offerLoading || !offerPrice}
                  onClick={async () => {
                    if (!offerItem || !offerPrice) return;
                    setOfferLoading(true);
                    setOfferMessage(null);
                    try {
                      const res = await axios.post('/transaction/offers/create/', {
                        item_id: offerItem.id,
                        price: offerPrice,
                      });
                      setOfferMessage(res.data?.message || "Offer created successfully");
                      setTimeout(() => {
                        setOfferModalOpen(false);
                        setOfferPrice('');
                        setOfferMessage(null);
                        setOfferItem(null);
                      }, 1200);
                    } catch (e: unknown) {
                      const errorMessage = e instanceof Error && 'response' in e && 
                        typeof e.response === 'object' && e.response !== null &&
                        'data' in e.response && typeof e.response.data === 'object' && 
                        e.response.data !== null && 'message' in e.response.data
                        ? String(e.response.data.message)
                        : "Failed to create offer";
                      setOfferMessage(errorMessage);
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
        {/* Add Product Modal */}
        {addProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative border border-gray-200">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => { setAddProductModalOpen(false); setAddProductMessage(null); }}
              >✕</button>
              <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image (Optional)</label>
                  {productImagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                      <Image
                        src={productImagePreview}
                        alt="Preview"
                        width={400}
                        height={192}
                        className="object-contain w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={removeProductImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#04BB84] hover:bg-[#E6F9F3] transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload an image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProductImage}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Product Title</label>
                    <input
                      type="text"
                      name="product_title"
                      value={productForm.product_title}
                      onChange={handleProductInput}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Waste Category</label>
                    <input
                      type="text"
                      name="waste_category"
                      value={productForm.waste_category}
                      onChange={handleProductInput}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={productForm.quantity}
                      onChange={handleProductInput}
                      className="w-full border rounded px-3 py-2"
                      required
                      min={1}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <input
                      type="text"
                      value="Liter"
                      disabled
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductInput}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductInput}
                    className="w-full border rounded px-3 py-2"
                    required
                    min={1}
                  />
                </div>
                {addProductMessage && (
                  <div className="text-center text-green-600 text-sm">{addProductMessage}</div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded"
                    onClick={() => { setAddProductModalOpen(false); setAddProductMessage(null); }}
                    disabled={addProductLoading}
                  >Cancel</button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#04BB84] text-white px-3 py-2 rounded hover:bg-[#039970] disabled:opacity-60"
                    disabled={addProductLoading}
                  >
                    {addProductLoading ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

