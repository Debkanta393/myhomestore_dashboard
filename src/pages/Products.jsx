import { useState, useEffect } from "react";
import { getAllProducts, searchProduct } from "../features/product/product";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit,
  Trash,
  X,
  Search,
  Filter,
  Package,
  ChevronDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { useNavigate } from "react-router";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProduct, setVisibleProduct] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [productBrands, setProductBrands] = useState([]);
  const [filterBrand, setFilterBrand] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await dispatch(getAllProducts());
      const products = res?.payload?.data?.products || [];
      setAllProducts(products);
      setVisibleProduct(products);
      const uniqueBrands = [...new Set(products.map((item) => item.brand))];
      setProductBrands(uniqueBrands);
    };
    fetchProduct();
  }, [dispatch]);

  useEffect(() => {
    let filtered = allProducts.filter((item) =>
      item.productName.toLowerCase().includes(filterName.toLowerCase()),
    );
    if (filterBrand.trim()) {
      filtered = filtered.filter(
        (item) => item.brand.toLowerCase() === filterBrand.toLowerCase(),
      );
    }
    setVisibleProduct(filtered);
  }, [filterName, filterBrand, allProducts]);

  const loadMore = () => setVisibleCount((prev) => prev + 8);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
    exit: {},
  };

  const productHeaders = [
    { label: "Product", col: "col-span-2" },
    { label: "Brand", col: "col-span-1" },
    { label: "Category", col: "col-span-1" },
    { label: "Actions", col: "col-span-1 text-right pr-4" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 md:px-8">
      {/* ── Page Header ── */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Products
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {visibleProduct.length} product
            {visibleProduct.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-10">
          <button onClick={() => navigate(`/uploadproduct`)} className="py-3 px-10 rounded-xl shadow-sm font-semibold text-md hover:bg-gray-900 hover:text-white cursor-pointer">
            Add Product
          </button>
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <LayoutList size={17} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <LayoutGrid size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white
                         text-gray-800 placeholder-gray-400 text-sm shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                         transition-all duration-200"
              placeholder="Search products..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            {filterName && (
              <button
                onClick={() => setFilterName("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="relative sm:w-56">
            <Filter
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full appearance-none pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-white
                         text-sm text-gray-700 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
                         transition-all duration-200 cursor-pointer"
            >
              <option value="">All Brands</option>
              {productBrands.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto">
        {visibleProduct?.length > 0 ? (
          <>
            {/* ── LIST VIEW ── */}
            {viewMode === "list" && (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-5 items-center px-5 py-3 mb-2 rounded-xl bg-gray-100 border border-gray-200">
                  {productHeaders.map((h, i) => (
                    <p
                      key={i}
                      className={`text-xs font-semibold uppercase tracking-widest text-gray-400 ${h.col}`}
                    >
                      {h.label}
                    </p>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={filterName + filterBrand}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex flex-col gap-2"
                  >
                    {visibleProduct.slice(0, visibleCount).map((item) => (
                      <motion.div
                        key={item._id}
                        variants={cardVariants}
                        className="group grid grid-cols-5 items-center bg-white border border-gray-200
                                   rounded-2xl px-5 py-3.5 hover:border-gray-400 hover:shadow-md
                                   transition-all duration-300 cursor-pointer"
                      >
                        {/* Image + Name */}
                        <div className="col-span-2 flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                            <img
                              src={item.productImage[0].url}
                              alt={item.productName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                            {item.productName}
                          </p>
                        </div>

                        {/* Brand */}
                        <div className="col-span-1">
                          <span className="inline-block text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {item.brand}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="col-span-1">
                          <span className="inline-block text-xs font-medium bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-end gap-2 pr-1">
                          <button
                            className="p-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600
                                       text-gray-400 border border-gray-100 hover:border-blue-200
                                       transition-all duration-200"
                            onClick={() => navigate(`/editproduct/${item._id}`)}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setShowConfirmModal(true)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-500
                                       text-gray-400 border border-gray-100 hover:border-red-200
                                       transition-all duration-200"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}

            {/* ── GRID VIEW ── */}
            {viewMode === "grid" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={filterName + filterBrand + "grid"}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {visibleProduct.slice(0, visibleCount).map((item) => (
                    <motion.div
                      key={item._id}
                      variants={cardVariants}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden
                                 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
                        <img
                          src={item.productImage[0].url}
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Hover overlay actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-end gap-2 p-3 opacity-0 group-hover:opacity-100">
                          <button className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-600 shadow-sm transition-all">
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowConfirmModal(true)}
                            className="p-2 rounded-xl bg-white/90 hover:bg-white text-red-500 shadow-sm transition-all"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1 mb-2">
                          {item.productName}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
                            {item.brand}
                          </span>
                          <span className="text-[11px] font-medium bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        ) : (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-gray-400"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <Package size={28} className="text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-600">
              No products found
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your filters or search term
            </p>
            {(filterName || filterBrand) && (
              <button
                onClick={() => {
                  setFilterName("");
                  setFilterBrand("");
                }}
                className="mt-5 text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 transition"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* ── Load More ── */}
        {visibleCount < visibleProduct?.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={loadMore}
              className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800
                         text-white text-sm font-medium px-8 py-3 rounded-xl
                         shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20
                         active:scale-[0.97] transition-all duration-200"
            >
              Load More
              <ChevronDown
                size={16}
                className="group-hover:translate-y-0.5 transition-transform duration-200"
              />
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowConfirmModal(false)}
            />

            <motion.div
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[400px] rounded-2xl bg-white
                         shadow-[0_24px_64px_rgba(0,0,0,0.15)]
                         border border-gray-100 p-7"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              {/* Close */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400
                           hover:bg-gray-100 hover:text-gray-600 transition-all duration-150"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <Trash size={22} className="text-red-500" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                Delete this product?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-7">
                This action cannot be undone. The product will be permanently
                removed from your catalog.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-medium
                             bg-gray-100 text-gray-700 hover:bg-gray-200
                             active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-medium
                             bg-red-500 hover:bg-red-600 text-white
                             shadow-lg shadow-red-500/25 hover:shadow-red-500/40
                             active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
