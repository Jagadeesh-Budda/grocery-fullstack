import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const productData = [
  { id: 1, name: "Organic Bananas", price: "60", stock: 15, image: "https://placehold.co/400x300/f3f4f6/059669?text=Bananas" },
  { id: 2, name: "Fresh Milk (1L)", price: "55", stock: 0, image: "https://placehold.co/400x300/f3f4f6/059669?text=Milk" },
  { id: 3, name: "Whole Wheat Bread", price: "40", stock: 5, image: "https://placehold.co/400x300/f3f4f6/059669?text=Bread" },
  { id: 4, name: "Red Apples", price: "120", stock: 25, image: "https://placehold.co/400x300/f3f4f6/059669?text=Apples" },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Enhanced Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl3 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-grocery-heading">Product Inventory</h1>
          <p className="text-xs text-grocery-body">Manage {productData.length} items in your store</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-grocery-primary/20 outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-grocery-primary hover:bg-grocery-primaryHover text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* 2. Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden !p-0 relative border-none shadow-card hover:shadow-glass transition-all">
            
            {/* Action Buttons (Visible on Hover) */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button className="p-2 bg-white/90 backdrop-blur-sm text-grocery-heading rounded-lg shadow-sm hover:bg-white"><Edit2 size={14} /></button>
              <button className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg shadow-sm hover:bg-red-50"><Trash2 size={14} /></button>
            </div>

            <img src={product.image} alt={product.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-grocery-heading text-sm">{product.name}</h3>
                <span className="text-grocery-primary font-black text-sm">₹{product.price}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Stock: {product.stock} units</span>
                <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}