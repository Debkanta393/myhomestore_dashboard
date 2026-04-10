import React, { useEffect, useState } from "react";
import {
  Upload, X, Image as ImageIcon, DollarSign,
  Package, Droplets, Footprints, Shield, CheckCircle,
  Link, Tag, Layers, Flame, Award, Beaker,
} from "lucide-react";
import { Toster } from "../utils/Toster";
import { useParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { uploadProduct, getProductById, updateProduct } from "../features/product/product";

function normalizeProductFromApi(payload) {
  const body = payload?.data ?? payload;
  const raw =
    body?.products ??
    body?.product ??
    body?.data?.products ??
    body?.data?.product;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  // Basic
  category: "", type: "", brand: "", productName: "", description: "",
  range: "", productDetails: "", productTypeLabel: "",
  // Specs
  thickness: [], pattern: "", color: [], dimensions: "", packSize: "",
  wearLayerThickness: "", coating: "", jankaRating: "",
  // Resistance
  petfriendly: "", waterresistant: "", scratchresistant: "", fireTested: "",
  // Compliance
  vocCompliance: "", certification: "", brochurelink: "",
  // Pricing
  supplyPrice: "", supplyInstallPrice: "", sku: "",
  // Warranty
  Warrenty: "",
  // Details object
  details: { dimensions: "", installation: "", warranty: "", delivery: "" },
  // Features array
  features: [],
  // Images
  productImage: [], functionsImage: [],
  // Dynamic specs
  specifications: {},
};

const TYPES     = ["Flooring", "Tiles", "Bathroom", "Kitchen & Laundry", "Other"];
const BRANDS    = [
  "Clever Choice", "Preference Floors", "Herford Flooring", "Signature Flooring",
  "Terra Mater", "Create Floors", "Elegance Collection", "Masa Imports",
  "DW Tiles", "Designer Stone & Tiles", "Fienza", "Bella Vista",
  "Evia Bathware", "Nero Bathware", "Kuroma",
];
const THICKNESS = ["4mm","5mm","6mm","7mm","8mm","10mm","12mm"];
const PATTERNS  = ["Long Board","Chevron","Herringbone","Longboard","Standard"];
const COLORS    = ["Light","Medium","Ash","Dark"];

// ─── Component ───────────────────────────────────────────────────────────────
const UploadProduct = () => {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData,               setFormData]               = useState(EMPTY_FORM);
  const [productImagePreview,    setProductImagePreview]    = useState([]);
  const [functionsImagePreview,  setFunctionsImagePreview]  = useState([]);
  const [removedProductImages,   setRemovedProductImages]   = useState([]);
  const [removedFunctionsImages, setRemovedFunctionsImages] = useState([]);
  const [productImageUrl,        setProductImageUrl]        = useState("");
  const [functionsImageUrl,      setFunctionsImageUrl]      = useState("");
  const [specificationFields,    setSpecificationFields]    = useState([{ id: Date.now(), key: "", value: "" }]);
  const [featureFields,          setFeatureFields]          = useState([{ id: Date.now(), icon: "", title: "", description: "" }]);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", message: "" });

  const showToast = (msg, type) => setToast({ message: msg, type });

  // ── Fetch product in edit mode ──────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const res = await dispatch(getProductById(id));
        console.log(res)
        if (getProductById.rejected.match(res)) {
          throw new Error(
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Failed to load product",
          );
        }
        const p = normalizeProductFromApi(res.payload);
        if (!p) throw new Error("Product not found");

        const parseArray = (val) => {
          if (!val) return [];
        
          if (Array.isArray(val)) {
            if (val.length === 1 && typeof val[0] === "string") {
              try {
                return JSON.parse(val[0]);
              } catch {
                return val;
              }
            }
            return val;
          }
        
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return [val];
            }
          }
      
          return [];
        };

        setFormData({
          category:         p.category         || "",
          type:             p.type             || "",
          brand:            p.brand            || "",
          productName:      p.productName      || "",
          description:      p.description      || "",
          range:            p.range            || "",
          productDetails:   p.productDetails   || "",
          productTypeLabel: p.productTypeLabel || "",
          thickness:  parseArray(p.thickness),
          pattern:          p.pattern          || "",
          color: parseArray(p.color),
          dimensions:       p.dimensions       || "",
          packSize:         p.packSize         || "",
          wearLayerThickness: p.wearLayerThickness || "",
          coating:          p.coating          || "",
          jankaRating:      p.jankaRating      || "",
          petfriendly:      p.petfriendly      || "",
          waterresistant:   p.waterresistant   || "",
          scratchresistant: p.scratchresistant || "",
          fireTested:       p.fireTested       || "",
          vocCompliance:    p.vocCompliance    || "",
          certification:    p.certification   || "",
          brochurelink:     p.brochurelink     || "",
          supplyPrice:      p.supplyPrice      || "",
          supplyInstallPrice: p.supplyInstallPrice || "",
          sku:              p.sku              || "",
          Warrenty:         p.Warrenty         || "",
          details: {
            dimensions:   p.details?.dimensions   || "",
            installation: p.details?.installation || "",
            warranty:     p.details?.warranty     || "",
            delivery:     p.details?.delivery     || "",
          },
          productImage:   [],
          functionsImage: [],
          specifications: p.specifications || {},
          features:       p.features || [],
        });

        // Image previews
        const toPreview = (arr) =>
          (arr || []).map((img) => ({
            url: img.url, public_id: img.public_id || null,
            file: null, isExisting: true,
          }));
        setProductImagePreview(toPreview(p.productImage));
        setFunctionsImagePreview(toPreview(p.functionsImage));

        // Specification fields
        const specs = p.specifications || {};
        const specEntries = Object.entries(specs);
        setSpecificationFields(
          specEntries.length > 0
            ? specEntries.map(([key, value]) => ({ id: Date.now() + Math.random(), key, value }))
            : [{ id: Date.now(), key: "", value: "" }]
        );

        // Feature fields
        const feats = p.features || [];
        setFeatureFields(
          feats.length > 0
            ? feats.map((f) => ({ id: Date.now() + Math.random(), icon: f.icon || "", title: f.title || "", description: f.description || "" }))
            : [{ id: Date.now(), icon: "", title: "", description: "" }]
        );
      } catch (err) {
        showToast("Failed to load product data.", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, isEdit, dispatch]);

  console.log(formData)


  // ── Generic input change ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Nested details object ───────────────────────────────────────────────
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, details: { ...prev.details, [name]: value } }));
  };

  // ── Multi-select ────────────────────────────────────────────────────────
  const handleMultiSelect = (e, field) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, [field]: selected }));
  };

  // ── Image upload ────────────────────────────────────────────────────────
  const handleImageUpload = (e, imageType) => {
    const files     = Array.from(e.target.files);
    const isProduct = imageType === "product";
    files.forEach((file) => {
      if (file.size > 5_000_000) { showToast("Image size must be under 5MB", "error"); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const entry = { url: reader.result, file, isExisting: false, isUrl: false };
        if (isProduct) {
          setProductImagePreview((prev) => [...prev, entry]);
          setFormData((prev) => ({ ...prev, productImage: [...prev.productImage, file] }));
        } else {
          setFunctionsImagePreview((prev) => [...prev, entry]);
          setFormData((prev) => ({ ...prev, functionsImage: [...prev.functionsImage, file] }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleImageUrlAdd = (imageType) => {
    const isProduct = imageType === "product";
    const url = (isProduct ? productImageUrl : functionsImageUrl).trim();
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (!/^https?:$/i.test(parsed.protocol)) throw new Error("Invalid protocol");
    } catch {
      showToast("Please enter a valid image URL (http/https).", "error");
      return;
    }

    const entry = {
      url,
      public_id: null,
      file: null,
      isExisting: true,
      isUrl: true,
    };

    if (isProduct) {
      setProductImagePreview((prev) => [...prev, entry]);
      setProductImageUrl("");
    } else {
      setFunctionsImagePreview((prev) => [...prev, entry]);
      setFunctionsImageUrl("");
    }
  };

  const removeImage = (index, imageType) => {
    const isProduct = imageType === "product";
    const previews  = isProduct ? productImagePreview : functionsImagePreview;
    const removed   = previews[index];
    if (removed.isExisting && removed.public_id) {
      if (isProduct) setRemovedProductImages((p)   => [...p, removed.public_id]);
      else           setRemovedFunctionsImages((p)  => [...p, removed.public_id]);
    }
    if (isProduct) {
      setProductImagePreview((p) => p.filter((_, i) => i !== index));
      if (!removed.isExisting) {
        const newFileIndex = previews
          .slice(0, index)
          .filter((p) => !p.isExisting).length;
        setFormData((prev) => ({
          ...prev,
          productImage: prev.productImage.filter((_, i) => i !== newFileIndex),
        }));
      }
    } else {
      setFunctionsImagePreview((p) => p.filter((_, i) => i !== index));
      if (!removed.isExisting) {
        const newFileIndex = previews
          .slice(0, index)
          .filter((p) => !p.isExisting).length;
        setFormData((prev) => ({
          ...prev,
          functionsImage: prev.functionsImage.filter((_, i) => i !== newFileIndex),
        }));
      }
    }
  };

  // ── Specification key-value rows ────────────────────────────────────────
  const handleSpecFieldChange = (id, field, value) => {
    const updated = specificationFields.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setSpecificationFields(updated);
    const specs = {};
    updated.forEach(({ key, value: val }) => { if (key.trim()) specs[key.trim()] = val; });
    setFormData((prev) => ({ ...prev, specifications: specs }));
  };
  const addSpecField    = () => setSpecificationFields((prev) => [...prev, { id: Date.now(), key: "", value: "" }]);
  const removeSpecField = (id) => {
    if (specificationFields.length === 1) return;
    const remaining = specificationFields.filter((item) => item.id !== id);
    setSpecificationFields(remaining);
    const specs = {};
    remaining.forEach(({ key, value }) => { if (key.trim()) specs[key.trim()] = value; });
    setFormData((prev) => ({ ...prev, specifications: specs }));
  };

  // ── Feature rows ────────────────────────────────────────────────────────
  const handleFeatureChange = (id, field, value) => {
    const updated = featureFields.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFeatureFields(updated);
    setFormData((prev) => ({
      ...prev,
      features: updated.map(({ icon, title, description }) => ({ icon, title, description })),
    }));
  };
  const addFeatureField    = () => setFeatureFields((prev) => [...prev, { id: Date.now(), icon: "", title: "", description: "" }]);
  const removeFeatureField = (id) => {
    if (featureFields.length === 1) return;
    const remaining = featureFields.filter((item) => item.id !== id);
    setFeatureFields(remaining);
    setFormData((prev) => ({
      ...prev,
      features: remaining.map(({ icon, title, description }) => ({ icon, title, description })),
    }));
  };

  // ── Reset ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setProductImagePreview([]);
    setFunctionsImagePreview([]);
    setRemovedProductImages([]);
    setRemovedFunctionsImages([]);
    setProductImageUrl("");
    setFunctionsImageUrl("");
    setSpecificationFields([{ id: Date.now(), key: "", value: "" }]);
    setFeatureFields([{ id: Date.now(), icon: "", title: "", description: "" }]);
    setStatusMsg({ type: "", message: "" });
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", message: "" });
  
    if (productImagePreview.length === 0) {
      showToast("Please upload at least one product image.", "error");
      setLoading(false);
      return;
    }
  
    try {
      const data = new FormData();
  
      // ── Scalar string fields (backend expects specific keys) ─────────────
      const scalarMap = {
        category: "category",
        type: "type",
        brand: "brand",
        productName: "productName",
        description: "description",
        range: "range",
        productDetails: "productDetails",
        productTypeLabel: "productTypeLabel",
        dimensions: "dimensions",
        packSize: "packsize", // backend uses packsize (see old thunk)
        wearLayerThickness: "wearLayerThickness",
        coating: "coating",
        jankaRating: "jankaRating",
        petfriendly: "petfriendly",
        waterresistant: "waterresistant",
        scratchresistant: "scratchresistant",
        fireTested: "fireTested",
        vocCompliance: "vocCompliance",
        certification: "certification",
        brochurelink: "brochurelink",
        supplyPrice: "supplyPrice",
        supplyInstallPrice: "supplyInstallPrice",
        sku: "sku",
        Warrenty: "Warrenty",
        pattern: "pattern",
      };
      Object.entries(scalarMap).forEach(([k, backendKey]) => {
        data.append(backendKey, formData[k] ?? "");
      });

      // ── Arrays as JSON strings (matches backend expectations) ────────────
      data.append("thickness", JSON.stringify(formData.thickness || []));
      data.append("color", JSON.stringify(formData.color || []));
  
      // ── Nested objects / arrays as JSON strings ──────────────────────────
      data.append("details",        JSON.stringify(formData.details));
      data.append("features",       JSON.stringify(formData.features));
      data.append("specifications", JSON.stringify(formData.specifications));
  
      // ── New image files ──────────────────────────────────────────────────
      formData.productImage.forEach((f)   => data.append("productImage",   f));
      formData.functionsImage.forEach((f) => data.append("functionsImage", f));

      
  
      // ── Existing images to keep (edit mode) ─────────────────────────────
      const keepProduct = productImagePreview
        .filter((p) => p.isExisting && !p.isUrl)
        .map((p) => ({ url: p.url, public_id: p.public_id }));
      const keepFunctions = functionsImagePreview
        .filter((p) => p.isExisting && !p.isUrl)
        .map((p) => ({ url: p.url, public_id: p.public_id }));
      const productUrlImages = productImagePreview
        .filter((p) => p.isUrl)
        .map((p) => p.url);
      const functionsUrlImages = functionsImagePreview
        .filter((p) => p.isUrl)
        .map((p) => p.url);

      if (keepProduct.length) {
        data.append("existingProductImages", JSON.stringify(keepProduct));
      }
      if (keepFunctions.length) {
        data.append("existingFunctionsImages", JSON.stringify(keepFunctions));
      }
      if (productUrlImages.length) {
        data.append("productImageUrls", JSON.stringify(productUrlImages));
      }
      if (functionsUrlImages.length) {
        data.append("functionsImageUrls", JSON.stringify(functionsUrlImages));
      }
  
      // ── Removed images ───────────────────────────────────────────────────
      if (removedProductImages.length)
        data.append("removedProductImages",   JSON.stringify(removedProductImages));
      if (removedFunctionsImages.length)
        data.append("removedFunctionsImages", JSON.stringify(removedFunctionsImages));
  
      console.log(data)
      if (isEdit) {
        await dispatch(updateProduct({ id, formdata: data })).unwrap();
      } else {
        await dispatch(uploadProduct(data)).unwrap();
      }
  
      showToast(
        isEdit ? "Product updated successfully!" : "Product uploaded successfully!",
        "success"
      );
      setStatusMsg({ type: "success", message: isEdit ? "Product updated!" : "Product uploaded!" });
  
      if (!isEdit) {
        resetForm();
      } else {
        setFormData((prev) => ({ ...prev, productImage: [], functionsImage: [] }));
        setRemovedProductImages([]);
        setRemovedFunctionsImages([]);
      }
    } catch (error) {
      const finalMsg =
        typeof error === "string"
          ? error
          : error?.message ||
            error?.msg ||
            error?.error ||
            error?.data?.message ||
            (typeof error?.detail === "string" ? error.detail : null) ||
            "Something went wrong.";
      showToast(finalMsg, "error");
      setStatusMsg({ type: "error", message: finalMsg });
    } finally {
      setLoading(false);
    }
  };

  // ── Shared styles ───────────────────────────────────────────────────────
  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A] focus:border-transparent outline-none transition text-sm";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── Image grid ──────────────────────────────────────────────────────────
  const ImageGrid = ({ previews, type, columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" }) => (
    <div className={`grid ${columns} gap-4 mt-4`}>
      {previews.map((img, index) => (
        <div key={index} className="relative group">
          <img src={img.url} alt={`${type} ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" />
          {img.isExisting && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px]
                             font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" /> Saved
            </span>
          )}
          <button type="button" onClick={() => removeImage(index, type)}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white
                       rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100
                       group-hover:scale-110 transition-all">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Loading ─────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8A6A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading product data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {toast && <Toster message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Update Product" : "Upload Product"}
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              {isEdit ? "Modify product details and save changes." : "Add a new product to your inventory."}
            </p>
          </div>
          {isEdit && (
            <button type="button" onClick={() => navigate("/products")}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {/* Status */}
        {statusMsg.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            statusMsg.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <span className="flex-1">{statusMsg.message}</span>
            <button onClick={() => setStatusMsg({ type: "", message: "" })}
              className="ml-4 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 lg:p-8 space-y-10">

          {/* ══ 1. BASIC INFORMATION ══════════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8A6A5A]" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelCls}>Category *</label>
                <input type="text" name="category" value={formData.category}
                  onChange={handleInputChange} required placeholder="e.g. laminate"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Type *</label>
                <select name="type" value={formData.type} onChange={handleInputChange}
                  required className={`${inputCls} bg-white`}>
                  <option value="">Select type</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Brand *</label>
                <select name="brand" value={formData.brand} onChange={handleInputChange}
                  required className={`${inputCls} bg-white`}>
                  <option value="">Select brand</option>
                  {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelCls}>Product Name *</label>
                <input type="text" name="productName" value={formData.productName}
                  onChange={handleInputChange} required placeholder="Full product name"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input type="text" name="slug" value={formData.slug || formData.productName.toLowerCase().replace(/ /g, '-')}
                  onChange={handleInputChange} placeholder="e.g. water-resistant-laminate"
                  className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelCls}>Range</label>
                <input type="text" name="range" value={formData.range}
                  onChange={handleInputChange} placeholder="e.g. Aspect Range"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Product Details</label>
                <input type="text" name="productDetails" value={formData.productDetails}
                  onChange={handleInputChange} placeholder="Short summary / subheading"
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea name="description" value={formData.description}
                onChange={handleInputChange} required rows={5}
                placeholder="Full product description"
                className={`${inputCls} resize-none`} />
            </div>
          </section>

          {/* ══ 2. PHYSICAL SPECIFICATIONS ═══════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8A6A5A]" /> Physical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelCls}>Thickness (Multiple)</label>
                <select name="thickness" value={formData.thickness}
                  onChange={(e) => handleMultiSelect(e, "thickness")}
                  multiple size={4} className={`${inputCls} bg-white`}>
                  {THICKNESS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <div>
                <label className={labelCls}>Pattern</label>
                <select name="pattern" value={formData.pattern}
                  onChange={handleInputChange} className={`${inputCls} bg-white`}>
                  <option value="">Select pattern</option>
                  {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Color (Multiple)</label>
                <select name="color" value={formData.color}
                  onChange={(e) => handleMultiSelect(e, "color")} 
                  multiple size={4} className={`${inputCls} bg-white`}>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelCls}>Dimensions</label>
                <input type="text" name="dimensions" value={formData.dimensions}
                  onChange={handleInputChange} placeholder="e.g. 236mm x 2260mm x 12mm"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Pack Size</label>
                <input type="text" name="packSize" value={formData.packSize}
                  onChange={handleInputChange} placeholder="e.g. 2.13m² - 4 Full Length"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Wear Layer Thickness</label>
                <input type="text" name="wearLayerThickness" value={formData.wearLayerThickness}
                  onChange={handleInputChange} placeholder="e.g. AC3"
                  className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Coating / Surface</label>
                <input type="text" name="coating" value={formData.coating}
                  onChange={handleInputChange} placeholder="e.g. Melamine Surface with AC3 Wear Protection"
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Janka Rating</label>
                <input type="text" name="jankaRating" value={formData.jankaRating}
                  onChange={handleInputChange} placeholder="e.g. N/A - HDF Lo-Swell Black Core"
                  className={inputCls} />
              </div>
            </div>
          </section>

          {/* ══ 3. RESISTANCE & COMPLIANCE ════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8A6A5A]" /> Resistance & Compliance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Footprints className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Pet Friendly
                </label>
                <input type="text" name="petfriendly" value={formData.petfriendly}
                  onChange={handleInputChange} placeholder="Yes / 4/6"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Water Resistant
                </label>
                <input type="text" name="waterresistant" value={formData.waterresistant}
                  onChange={handleInputChange} placeholder="e.g. Up to 72 Hours"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Scratch Resistant
                </label>
                <input type="text" name="scratchresistant" value={formData.scratchresistant}
                  onChange={handleInputChange} placeholder="Yes / 4/6"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Flame className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Fire Tested
                </label>
                <input type="text" name="fireTested" value={formData.fireTested}
                  onChange={handleInputChange} placeholder="e.g. Yes - Fire Rated"
                  className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Award className="w-4 h-4 mr-2 text-[#8A6A5A]" /> VOC Compliance
                </label>
                <input type="text" name="vocCompliance" value={formData.vocCompliance}
                  onChange={handleInputChange} placeholder="e.g. E1"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Award className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Certification
                </label>
                <input type="text" name="certification" value={formData.certification}
                  onChange={handleInputChange} placeholder="e.g. PEFC Certified, CARB2 Compliant"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Award className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Warranty
                </label>
                <input type="text" name="Warrenty" value={formData.Warrenty}
                  onChange={handleInputChange} placeholder="e.g. Residential Warranty"
                  className={inputCls} />
              </div>
            </div>
          </section>

          {/* ══ 4. DETAIL PARAGRAPHS ══════════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b">
              Detail Paragraphs
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              These are the long-form detail sections shown on the product page (dimensions overview, installation guide, warranty terms, delivery info).
            </p>

            {[
              { key: "dimensions",   label: "Dimensions Detail",   placeholder: "Describe board dimensions and format in detail…" },
              { key: "installation", label: "Installation Detail",  placeholder: "Describe installation method and requirements…" },
              { key: "warranty",     label: "Warranty Detail",      placeholder: "Describe warranty terms and conditions…" },
              { key: "delivery",     label: "Delivery Detail",      placeholder: "Describe delivery packaging and process…" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="mb-5">
                <label className={labelCls}>{label}</label>
                <textarea name={key} value={formData.details[key]}
                  onChange={handleDetailsChange} rows={3} placeholder={placeholder}
                  className={`${inputCls} resize-none`} />
              </div>
            ))}
          </section>

          {/* ══ 5. FEATURES ══════════════════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b">
              Product Features
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Each feature has an icon name (Lucide), a title, and a description.
            </p>

            <div className="space-y-4">
              {featureFields.map((field, index) => (
                <div key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg relative">
                  {featureFields.length > 1 && (
                    <button type="button" onClick={() => removeFeatureField(field.id)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white
                                 rounded-full p-1 shadow-lg transition z-10">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div>
                    <label className={labelCls}>Icon {index + 1}</label>
                    <input type="text" value={field.icon} placeholder="e.g. Shield"
                      onChange={(e) => handleFeatureChange(field.id, "icon", e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Title {index + 1}</label>
                    <input type="text" value={field.title} placeholder="e.g. Water Resistant"
                      onChange={(e) => handleFeatureChange(field.id, "title", e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Description {index + 1}</label>
                    <input type="text" value={field.description} placeholder="Short feature description"
                      onChange={(e) => handleFeatureChange(field.id, "description", e.target.value)}
                      className={inputCls} />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addFeatureField}
              className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-[#8A6A5A]
                         text-gray-600 hover:text-[#8A6A5A] px-4 py-3 rounded-lg transition
                         flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </section>

          {/* ══ 6. DYNAMIC SPECIFICATIONS ════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b">
              Additional Specifications (Key → Value)
            </h2>

            <div className="space-y-4">
              {specificationFields.map((field, index) => (
                <div key={field.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative">
                  {specificationFields.length > 1 && (
                    <button type="button" onClick={() => removeSpecField(field.id)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white
                                 rounded-full p-1 shadow-lg transition z-10">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div>
                    <label className={labelCls}>Key {index + 1}</label>
                    <input type="text" value={field.key} placeholder="e.g. Board Size"
                      onChange={(e) => handleSpecFieldChange(field.id, "key", e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Value {index + 1}</label>
                    <input type="text" value={field.value} placeholder="e.g. 236mm x 2260mm"
                      onChange={(e) => handleSpecFieldChange(field.id, "value", e.target.value)}
                      className={inputCls} />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addSpecField}
              className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-[#8A6A5A]
                         text-gray-600 hover:text-[#8A6A5A] px-4 py-3 rounded-lg transition
                         flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Specification
            </button>
          </section>

          {/* ══ 7. PRICING & LINKS ════════════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#8A6A5A]" /> Pricing & Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-1 text-[#8A6A5A]" /> Supply Price *
                </label>
                <input type="number" name="supplyPrice" value={formData.supplyPrice}
                  onChange={handleInputChange} required step="0.01" placeholder="0.00"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-1 text-[#8A6A5A]" /> Supply + Install Price *
                </label>
                <input type="number" name="supplyInstallPrice" value={formData.supplyInstallPrice}
                  onChange={handleInputChange} required step="0.01" placeholder="0.00"
                  className={inputCls} />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-1 text-[#8A6A5A]" /> SKU
                </label>
                <input type="text" name="sku" value={formData.sku}
                  onChange={handleInputChange} placeholder="e.g. SKU-001"
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Link className="w-4 h-4 mr-2 text-[#8A6A5A]" /> Brochure / Image Link
              </label>
              <input type="url" name="brochurelink" value={formData.brochurelink}
                onChange={handleInputChange}
                placeholder="https://example.com/brochure.pdf or image URL"
                className={inputCls} />
            </div>
          </section>

          {/* ══ 8. IMAGES ════════════════════════════════════════════════════ */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#8A6A5A]" /> Images
            </h2>

            {/* Product Images */}
            <div className="mb-8">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                Product Images
                {productImagePreview.length > 0 && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {productImagePreview.length} image{productImagePreview.length !== 1 ? "s" : ""}
                    {isEdit && ` · ${productImagePreview.filter(p => p.isExisting).length} saved`}
                  </span>
                )}
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2
                                border-dashed border-gray-300 rounded-lg cursor-pointer
                                hover:border-[#8A6A5A] hover:bg-amber-50 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-600">
                  {isEdit ? "Add more product images" : "Click to upload product images"}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · max 5MB each</p>
                <input type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => handleImageUpload(e, "product")} />
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  type="url"
                  value={productImageUrl}
                  onChange={(e) => setProductImageUrl(e.target.value)}
                  placeholder="Or paste product image URL (https://...)"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => handleImageUrlAdd("product")}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
                >
                  Add URL
                </button>
              </div>
              {productImagePreview.length > 0 && <ImageGrid previews={productImagePreview} type="product" />}
            </div>

            {/* Functions Images */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                Function / Feature Images
                {functionsImagePreview.length > 0 && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {functionsImagePreview.length} image{functionsImagePreview.length !== 1 ? "s" : ""}
                    {isEdit && ` · ${functionsImagePreview.filter(p => p.isExisting).length} saved`}
                  </span>
                )}
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2
                                border-dashed border-gray-300 rounded-lg cursor-pointer
                                hover:border-[#8A6A5A] hover:bg-amber-50 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-600">
                  {isEdit ? "Add more function images" : "Click to upload function/feature images"}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · max 5MB each</p>
                <input type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => handleImageUpload(e, "functions")} />
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  type="url"
                  value={functionsImageUrl}
                  onChange={(e) => setFunctionsImageUrl(e.target.value)}
                  placeholder="Or paste function image URL (https://...)"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => handleImageUrlAdd("functions")}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
                >
                  Add URL
                </button>
              </div>
              {functionsImagePreview.length > 0 && (
                <ImageGrid previews={functionsImagePreview} type="functions"
                  columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
              )}
            </div>
          </section>

          {/* ══ ACTIONS ══════════════════════════════════════════════════════ */}
          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#998E8A]/80 hover:bg-[#998E8A] text-white font-semibold
                         py-3 px-6 rounded-lg transition disabled:opacity-50
                         disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEdit ? "Saving…" : "Uploading…"}
                </>
              ) : (
                isEdit ? "Save Changes" : "Upload Product"
              )}
            </button>
            <button type="button" onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700
                         font-semibold hover:bg-gray-50 transition">
              {isEdit ? "Reset" : "Clear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;