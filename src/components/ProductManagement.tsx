import { useState, useEffect, FormEvent } from 'react';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  isBestseller: boolean;
  status: '판매중' | '품절' | '숨김';
  imageUrl: string;
  description: string;
}

export const initialCategories = [
  '선케어 (Sun Care)',
  '클렌징 (Cleansing)',
  '세럼/에센스 (Serum)',
  '크림/모이스처 (Cream)',
  '마스크/팩 (Mask)',
];

export const initialBrands = [
  'Beauty of Joseon (조선미녀)',
  'Glow Deep',
  'Hanbang Clinic',
  'Joseon Herbal',
];

export const initialProducts: Product[] = [
  {
    id: 'prd-1',
    code: 'PRD-BOJ-001',
    name: '맑은쌀선크림 : 쌀추출물+나이아시나마이드 (SPF 50+ PA++++)',
    category: '선케어 (Sun Care)',
    brand: 'Beauty of Joseon (조선미녀)',
    price: 18000,
    salePrice: 15300,
    stock: 450,
    isBestseller: true,
    status: '판매중',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtsVqrSDMr5Hp64St34s8zOuQMwoQkxb_mpUI1fs4_2dB2UmUWby6gENUgL-jXfMej03GSR4NqFXKFf0OBWAGI2wJEX3OrSBqoUAQ0S_GzTp6JR3QNdI56t1gi0j2IsgFHVIqQHpFrmBPRSExV_9yqYXUysdrMV6j46vU4JO4cESKH_0HUMLa1XhrvVZ1We1fVi1nB3DZyflXa7qWQ9AhYRsp9B-s9p6On59kcaVEus1ayOmxiUCE28C0c3',
    description: '조선시대 쌀뜨물 미용법에서 영감을 받은 촉촉하고 유기자차 타입의 베스트셀러 선크림입니다.',
  },
  {
    id: 'prd-2',
    code: 'PRD-BOJ-002',
    name: '조선미녀 인삼 탄력 크림 60ml',
    category: '크림/모이스처 (Cream)',
    brand: 'Beauty of Joseon (조선미녀)',
    price: 24000,
    salePrice: 20400,
    stock: 210,
    isBestseller: true,
    status: '판매중',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLsTDIbMW4ORIttbx7LcQBhQqCx3rUQzDZ0rKkTJlESxSyUuepvECQSxUULhXCS4f8eXC7CQU5meNhFXxQdr1h9C_ivcvf5ngHZ3ygsQcf7vhSkmFUoWkmjXwZiXVW-Em_EcgJHqx2tAbXrzXneCVMxbRmehlH_19d_zScE8wQggEYpVLob70lv2GXaObDHGs1-VBNQ77JCsoI1ZQUWF02rRduDfDoGx2sjn-WrTEFk5h98TEj0t0r53bBPW',
    description: '풍부한 인삼 수분과 오키드 영양 성분이 피부 밀도를 촘촘하게 채워주는 영양 고보습 탄력 크림.',
  },
  {
    id: 'prd-3',
    code: 'PRD-GD-003',
    name: '인삼선세럼 (SPF 50+ PA++++)',
    category: '선케어 (Sun Care)',
    brand: 'Glow Deep',
    price: 21000,
    stock: 180,
    isBestseller: true,
    status: '판매중',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLuFct-ui2RnjkMJUwltrg1fdnrwyLkZxjjYRtFWXTCib50VZ1HtAwR8fGW2yTTkpf3hR_VK-NQfztsSELjuwbfQ0vYMsGphGqaGA5PzRMKW8l7BkMV27t2NhgFaC9orJzzADHciOruVLh1WTxOnP4eFQY5gNuUyvbpQZkPTvk76g7pdHvOmUULeBMgemezDTK-STJEotnwLg1ARxE-uMKGL8s6W2M9vY58z2WYHdKRcrUyYLux-4nv0jw2f',
    description: '세럼처럼 산뜻하고 가볍게 흡수되는 사계절 영양 에센스 선케어.',
  },
  {
    id: 'prd-4',
    code: 'PRD-BOJ-004',
    name: '붉은팥 PDRN 모공탄력 세럼 30ml',
    category: '세럼/에센스 (Serum)',
    brand: 'Beauty of Joseon (조선미녀)',
    price: 26000,
    salePrice: 22100,
    stock: 320,
    isBestseller: true,
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    description: '모공 케어에 도움을 주는 붉은팥 성분과 비건 PDRN의 모공 탄력 시너지 세럼.',
  },
  {
    id: 'prd-5',
    code: 'PRD-HB-005',
    name: '조선미녀 청매실 약산성 클렌저 100ml',
    category: '클렌징 (Cleansing)',
    brand: 'Hanbang Clinic',
    price: 14000,
    stock: 150,
    isBestseller: false,
    status: '판매중',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: '피부 장벽을 보호해 주는 약산성 매실 추출물 저자극 버블 클렌저.',
  },
];

export function ProductManagement() {
  const [activeTab, setActiveTab] = useState<'제품 목록' | '카테고리 관리' | '브랜드 관리' | '베스트셀러 관리'>('제품 목록');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Category / Brand inputs
  const [newCatInput, setNewCatInput] = useState('');
  const [newBrandInput, setNewBrandInput] = useState('');

  // Product Form
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formSalePrice, setFormSalePrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(100);
  const [formStatus, setFormStatus] = useState<'판매중' | '품절' | '숨김'>('판매중');
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('shop_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        setProducts(initialProducts);
        localStorage.setItem('shop_products', JSON.stringify(initialProducts));
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem('shop_products', JSON.stringify(initialProducts));
    }

    // Load categories
    const savedCategories = localStorage.getItem('shop_categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        setCategories(initialCategories);
        localStorage.setItem('shop_categories', JSON.stringify(initialCategories));
      }
    } else {
      setCategories(initialCategories);
      localStorage.setItem('shop_categories', JSON.stringify(initialCategories));
    }

    // Load brands
    const savedBrands = localStorage.getItem('shop_brands');
    if (savedBrands) {
      try {
        setBrands(JSON.parse(savedBrands));
      } catch (e) {
        setBrands(initialBrands);
        localStorage.setItem('shop_brands', JSON.stringify(initialBrands));
      }
    } else {
      setBrands(initialBrands);
      localStorage.setItem('shop_brands', JSON.stringify(initialBrands));
    }
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('shop_products', JSON.stringify(updated));
  };

  const saveCategories = (updated: string[]) => {
    setCategories(updated);
    localStorage.setItem('shop_categories', JSON.stringify(updated));
  };

  const saveBrands = (updated: string[]) => {
    setBrands(updated);
    localStorage.setItem('shop_brands', JSON.stringify(updated));
  };

  // 1. Category Add / Delete
  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    if (categories.includes(newCatInput.trim())) {
      alert('이미 존재하는 카테고리입니다.');
      return;
    }
    const updated = [...categories, newCatInput.trim()];
    saveCategories(updated);
    setNewCatInput('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (window.confirm(`'${catToDelete}' 카테고리를 삭제하시겠습니까?`)) {
      const updated = categories.filter((c) => c !== catToDelete);
      saveCategories(updated);
    }
  };

  // 2. Brand Add / Delete
  const handleAddBrand = (e: FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    if (brands.includes(newBrandInput.trim())) {
      alert('이미 존재하는 브랜드입니다.');
      return;
    }
    const updated = [...brands, newBrandInput.trim()];
    saveBrands(updated);
    setNewBrandInput('');
  };

  const handleDeleteBrand = (brandToDelete: string) => {
    if (window.confirm(`'${brandToDelete}' 브랜드를 삭제하시겠습니까?`)) {
      const updated = brands.filter((b) => b !== brandToDelete);
      saveBrands(updated);
    }
  };

  // 3. Quick Bestseller Toggle
  const handleToggleBestseller = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, isBestseller: !p.isBestseller };
      }
      return p;
    });
    saveProducts(updated);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('정말 이 제품을 삭제하시겠습니까?')) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
    }
  };

  // Open Modal for Add/Edit
  const openProductModal = (prd?: Product) => {
    if (prd) {
      setEditingProduct(prd);
      setFormName(prd.name);
      setFormCategory(prd.category);
      setFormBrand(prd.brand);
      setFormPrice(prd.price);
      setFormSalePrice(prd.salePrice || 0);
      setFormStock(prd.stock);
      setFormStatus(prd.status);
      setFormIsBestseller(prd.isBestseller);
      setFormImageUrl(prd.imageUrl);
      setFormDescription(prd.description || '');
    } else {
      setEditingProduct(null);
      setFormName('');
      setFormCategory(categories[0] || '기타');
      setFormBrand(brands[0] || '기타');
      setFormPrice(20000);
      setFormSalePrice(0);
      setFormStock(100);
      setFormStatus('판매중');
      setFormIsBestseller(false);
      setFormImageUrl('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');
      setFormDescription('');
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('제품명을 입력해주세요.');
      return;
    }

    if (editingProduct) {
      // Edit
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName.trim(),
            category: formCategory,
            brand: formBrand,
            price: Number(formPrice),
            salePrice: Number(formSalePrice) || undefined,
            stock: Number(formStock),
            status: formStatus,
            isBestseller: formIsBestseller,
            imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            description: formDescription,
          };
        }
        return p;
      });
      saveProducts(updated);
    } else {
      // Add
      const newPrd: Product = {
        id: `prd-${Date.now()}`,
        code: `PRD-BOJ-${Math.floor(100 + Math.random() * 900)}`,
        name: formName.trim(),
        category: formCategory || categories[0] || '기타',
        brand: formBrand || brands[0] || '기타',
        price: Number(formPrice),
        salePrice: Number(formSalePrice) || undefined,
        stock: Number(formStock),
        status: formStatus,
        isBestseller: formIsBestseller,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        description: formDescription,
      };
      saveProducts([newPrd, ...products]);
    }

    setShowProductModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesKeyword = p.name.toLowerCase().includes(searchKeyword.toLowerCase()) || p.code.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCatFilter === 'All' || p.category === selectedCatFilter;
    const matchesBrand = selectedBrandFilter === 'All' || p.brand === selectedBrandFilter;
    return matchesKeyword && matchesCategory && matchesBrand;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">제품 및 쇼핑몰 관리 (Product Management)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            제품 카테고리/브랜드 관리, 신규 제품 등록, **베스트셀러 지정/수정**을 총괄 제어합니다.
          </p>
        </div>
        <button
          onClick={() => openProductModal()}
          className="px-5 py-2.5 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          신규 제품 등록 (Add Product)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-outline-variant overflow-x-auto hide-scrollbar">
        {(['제품 목록', '카테고리 관리', '브랜드 관리', '베스트셀러 관리'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {tab}
            {tab === '제품 목록' && ` (${products.length})`}
            {tab === '베스트셀러 관리' && ` (${products.filter((p) => p.isBestseller).length})`}
          </button>
        ))}
      </div>

      {/* Tab Content 1: 제품 목록 (Product List) */}
      {activeTab === '제품 목록' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">제품명 / 제품코드 검색</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어 입력..."
                className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">카테고리 필터</label>
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:border-secondary"
              >
                <option value="All">전체 카테고리 (All)</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">브랜드 필터</label>
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:border-secondary"
              >
                <option value="All">전체 브랜드 (All)</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider border-b border-outline-variant">
                  <tr>
                    <th className="p-3.5 font-semibold text-center w-28">베스트셀러</th>
                    <th className="p-3.5 font-semibold">제품 정보</th>
                    <th className="p-3.5 font-semibold">카테고리 / 브랜드</th>
                    <th className="p-3.5 font-semibold text-right">판매가</th>
                    <th className="p-3.5 font-semibold text-center">재고수량</th>
                    <th className="p-3.5 font-semibold text-center">판매 상태</th>
                    <th className="p-3.5 font-semibold text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant">
                  {filteredProducts.map((prd) => (
                    <tr key={prd.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Bestseller Toggle Switch */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleBestseller(prd.id)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-full border transition-all flex items-center gap-1 mx-auto ${
                            prd.isBestseller
                              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: prd.isBestseller ? "'FILL' 1" : "'FILL' 0" }}>
                            star
                          </span>
                          {prd.isBestseller ? 'Best' : '일반'}
                        </button>
                      </td>

                      {/* Info */}
                      <td className="p-3.5 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={prd.imageUrl}
                            alt={prd.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 leading-snug line-clamp-1">{prd.name}</p>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">{prd.code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <p className="text-xs font-bold text-slate-800">{prd.category}</p>
                        <p className="text-[11px] text-slate-400">{prd.brand}</p>
                      </td>

                      <td className="p-3.5 text-right font-medium">
                        {prd.salePrice ? (
                          <div>
                            <span className="text-xs text-rose-600 font-bold mr-1.5">{prd.salePrice.toLocaleString()}원</span>
                            <span className="text-xs text-slate-400 line-through">{prd.price.toLocaleString()}원</span>
                          </div>
                        ) : (
                          <span>{prd.price.toLocaleString()}원</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center text-xs font-semibold text-slate-700">
                        {prd.stock}개
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          prd.status === '판매중'
                            ? 'bg-emerald-100 text-emerald-700'
                            : prd.status === '품절'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {prd.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => openProductModal(prd)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                          title="제품 수정"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prd.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="제품 삭제"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: 카테고리 관리 (Category Management) */}
      {activeTab === '카테고리 관리' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-outline-variant shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">신규 제품 카테고리 등록</h3>
            <p className="text-xs text-slate-500 mb-4">쇼핑몰 및 제품 분류에 사용될 신규 카테고리를 추가합니다.</p>
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="예: 에센스/앰플 (Ampoule)"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                카테고리 추가
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">등록된 카테고리 리스트 ({categories.length})</h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <div key={cat} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">folder</span>
                      <span className="text-sm font-bold text-slate-800">{cat}</span>
                      <span className="text-xs text-slate-400">({count}개 제품)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="삭제"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: 브랜드 관리 (Brand Management) */}
      {activeTab === '브랜드 관리' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-outline-variant shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">신규 브랜드 등록</h3>
            <p className="text-xs text-slate-500 mb-4">입점 및 취급 브랜드를 신규로 등록합니다.</p>
            <form onSubmit={handleAddBrand} className="flex gap-2">
              <input
                type="text"
                value={newBrandInput}
                onChange={(e) => setNewBrandInput(e.target.value)}
                placeholder="예: Joseon Rice Line"
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                브랜드 추가
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">등록된 브랜드 리스트 ({brands.length})</h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {brands.map((brand) => {
                const count = products.filter((p) => p.brand === brand).length;
                return (
                  <div key={brand} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">sell</span>
                      <span className="text-sm font-bold text-slate-800">{brand}</span>
                      <span className="text-xs text-slate-400">({count}개 제품)</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBrand(brand)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="삭제"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: 베스트셀러 관리 (Bestseller Management) */}
      {activeTab === '베스트셀러 관리' && (
        <div className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">현재 등록된 베스트셀러 제품 리스트</h3>
              <p className="text-xs text-slate-500">쇼핑몰 메인 및 베스트셀러 전용 섹션에 즉시 노출되는 대표 제품입니다.</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              총 {products.filter((p) => p.isBestseller).length}개 지정됨
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.isBestseller)
              .map((prd) => (
                <div key={prd.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex gap-4 items-center relative group">
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    BEST
                  </span>
                  <img src={prd.imageUrl} alt={prd.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{prd.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{prd.price.toLocaleString()}원</p>
                    <button
                      onClick={() => handleToggleBestseller(prd.id)}
                      className="mt-2 text-xs text-rose-600 font-bold hover:underline"
                    >
                      베스트셀러 해제
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? '제품 정보 수정' : '신규 제품 등록'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">제품명 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="예: 맑은쌀선크림 50ml"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">카테고리 선택</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">브랜드 선택</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">정상가 (원)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">할인가 (원)</label>
                  <input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                    placeholder="없으면 0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">재고 수량 (개)</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">판매 상태</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  >
                    <option value="판매중">판매중</option>
                    <option value="품절">품절</option>
                    <option value="숨김">숨김</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-800">
                    <input
                      type="checkbox"
                      checked={formIsBestseller}
                      onChange={(e) => setFormIsBestseller(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    ⭐ 베스트셀러(Bestseller) 지정
                  </label>
                </div>
              </div>

              {/* Image Upload & URL Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  제품 대표 이미지 등록 (Direct File Upload & URL)
                </label>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  {/* File Upload Box */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      1. 컴퓨터에서 파일 직접 선택 (Max 2MB - 쇼핑몰 최적 표준)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const MAX_SIZE = 2 * 1024 * 1024; // 2MB
                          if (file.size > MAX_SIZE) {
                            alert(`이미지 용량이 2MB를 초과합니다. (${(file.size / (1024 * 1024)).toFixed(2)}MB)\n쇼핑몰 모바일/웹 로딩 속도 최적화를 위해 2MB 이하의 이미지 파일(JPG, PNG, WebP)을 선택해주세요.`);
                            e.target.value = '';
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormImageUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      ※ 모바일/웹 페이지 로딩 속도 최적화를 위해 **최대 2MB 이하**의 이미지(JPG, PNG, WebP)만 허용됩니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">OR</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  {/* URL Input Box */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      2. 이미지 웹 URL 주소 직접 입력
                    </label>
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  {/* Image Preview Box */}
                  {formImageUrl && (
                    <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                      <div className="text-xs text-slate-500 truncate">
                        <p className="font-bold text-slate-800">이미지 미리보기 (Live Preview)</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{formImageUrl.slice(0, 50)}...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">제품 설명</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="제품 특징 및 사용법 요약"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 shadow-md"
                >
                  {editingProduct ? '수정 완료' : '제품 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
