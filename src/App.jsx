import React, { useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  Package,
  Droplets,
  Footprints,
  Shield,
} from "lucide-react";
import {Toster} from "./utils/Toster"

const ProductUploadDashboard = () => {
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    brand: "",
    productImage: [],
    functionsImage: [],
    thickness: "",
    pattern: "",
    color: [],
    productName: "",
    description: "",
    sku: "",
    price: "",
    range: "",
    productDetails: "",
    petfriendly: "",
    waterresistant: "",
    scratchresistant: "",
    specifications: {},
  });

  const [productImagePreview, setProductImagePreview] = useState([]);
  const [functionsImagePreview, setFunctionsImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [toast, setToast] = useState(null);
  const showToast = (message, type) => {
    setToast({ message, type });
  };
  const closeToast = () => {
    setToast(null);
  };

  const types = ["Flooring", "Tiles", "Bathroom", "Kitchen & Laundry", "Other"];
  const brands = [
    "Clever Choice",
    "Preference Floors",
    "Herford Flooring",
    "Signature Flooring",
    "Terra Mater",
    "Create Floors",
    "Elegance Collection",
    "Masa Imports",
    "DW Tiles",
    "Designer Stone & Tiles",
    "Fienza",
    "Bella Vista",
    "Evia Bathware",
    "Nero Bathware",
    "Kuroma",
  ];
  const thicknessOptions = ["4mm", "5mm", "6mm", "7mm", "8mm", "10mm", "12mm"];
  const patternOptions = ["Long Board", "Chevron", "Herringbone"];
  const colorOptions = ["Light", "Medium", "Ash", "Dark"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleColorChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({
      ...prev,
      color: selectedOptions,
    }));
  };

  const handleImageUpload = (e, imageType) => {
    const files = Array.from(e.target.files);
    const isProduct = imageType === "product";

    files.forEach((file) => {
      if (file.size > 5000000) {
        setUploadStatus({
          type: "error",
          message: "Image size should be less than 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (isProduct) {
          setProductImagePreview((prev) => [
            ...prev,
            { url: reader.result, file },
          ]);
          setFormData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, file],
          }));
        } else {
          setFunctionsImagePreview((prev) => [
            ...prev,
            { url: reader.result, file },
          ]);
          setFormData((prev) => ({
            ...prev,
            functionsImage: [...prev.functionsImage, file],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear file input
    e.target.value = "";
  };

  const removeImage = (index, imageType) => {
    if (imageType === "product") {
      setProductImagePreview((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        productImage: prev.productImage.filter((_, i) => i !== index),
      }));
    } else {
      setFunctionsImagePreview((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        functionsImage: prev.functionsImage.filter((_, i) => i !== index),
      }));
    }
  };

  // Add new state for specification fields
  const [specificationFields, setSpecificationFields] = useState([
    { id: Date.now(), key: "", value: "" },
  ]);

  // Add handler for specification key-value changes
  const handleSpecificationKeyValueChange = (id, field, value) => {
    setSpecificationFields((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );

    // Update formData
    const updatedSpecs = {};
    specificationFields.forEach((item) => {
      if (item.id === id) {
        if (field === "key") {
          updatedSpecs[value] = item.value;
        } else {
          updatedSpecs[item.key] = value;
        }
      } else if (item.key) {
        updatedSpecs[item.key] = item.value;
      }
    });

    setFormData((prev) => ({
      ...prev,
      specifications: updatedSpecs,
    }));
  };

  // Add handler to add new specification field
  const addSpecificationField = () => {
    setSpecificationFields((prev) => [
      ...prev,
      { id: Date.now(), key: "", value: "" },
    ]);
  };

  // Add handler to remove specification field
  const removeSpecificationField = (id) => {
    if (specificationFields.length === 1) return; // Keep at least one field

    const fieldToRemove = specificationFields.find((item) => item.id === id);
    setSpecificationFields((prev) => prev.filter((item) => item.id !== id));

    // Update formData
    if (fieldToRemove && fieldToRemove.key) {
      setFormData((prev) => {
        const newSpecs = { ...prev.specifications };
        delete newSpecs[fieldToRemove.key];
        return {
          ...prev,
          specifications: newSpecs,
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus({ type: "", message: "" });

    // Validation: Product name required if more than one product image
    if (formData.productImage.length > 1 && !formData.productName.trim()) {
      setUploadStatus({
        type: "error",
        message:
          "Product name is required when uploading multiple product images",
      });
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "productImage" || key === "functionsImage") {
          return;
        } else if (key === "color") {
          uploadData.append(key, JSON.stringify(formData[key]));
        } else if (key === "specifications") {
          uploadData.append(key, JSON.stringify(formData[key]));
        } else {
          uploadData.append(key, formData[key]);
        }
      });

      // Append product images
      formData.productImage.forEach((image) => {
        uploadData.append("productImage", image);
      });

      // Append function images
      formData.functionsImage.forEach((image) => {
        uploadData.append("functionsImage", image);
      });

      const response = await fetch(
        "http://localhost:3000/api/product/uploadProduct",
        {
          method: "POST",
          body: uploadData,
        },
      );

      if (response.ok) {
        showToast("Product uploaded successfully! 🎉", "success");
        setUploadStatus({
          type: "success",
          message: "Product uploaded successfully!",
        });
        // Reset form
        setFormData({
          category: "",
          type: "",
          brand: "",
          productImage: [],
          functionsImage: [],
          thickness: "",
          pattern: "",
          color: [],
          productName: "",
          description: "",
          sku: "",
          price: "",
          range: "",
          productDetails: "",
          petfriendly: "",
          waterresistant: "",
          scratchresistant: "",
          specifications: {
            warranty: "",
            installation: "",
            maintenance: "",
            dimensions: "",
          },
        });
        setProductImagePreview([]);
        setFunctionsImagePreview([]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: "Failed to upload product. Please try again.",
      });
      showToast(
        error.message || "Failed to upload product. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toster message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Upload Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Add new flooring products to your inventory
          </p>
        </div>

        {/* Status Alert */}
        {uploadStatus.message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              uploadStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <span className="flex-1">{uploadStatus.message}</span>
            <button
              onClick={() => setUploadStatus({ type: "", message: "" })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
        >
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-[#8A6A5A] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 mr-2" />
                Product Name{" "}
                {formData.productImage.length > 1 && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required={formData.productImage.length > 1}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                 focus:border-transparent outline-none transition"
              />
              {formData.productImage.length > 1 && (
                <p className="text-xs text-orange-600 mt-1">
                  Required when uploading multiple product images
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Enter product description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                 focus:border-transparent outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Product Specifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thickness
                </label>
                <select
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select thickness</option>
                  {thicknessOptions.map((thick) => (
                    <option key={thick} value={thick}>
                      {thick}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pattern
                </label>
                <select
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select pattern</option>
                  {patternOptions.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color (Multiple)
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleColorChange}
                  multiple
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition bg-white"
                  size="3"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Details
                </label>
                <input
                  type="text"
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleInputChange}
                  placeholder="e.g., Hybrid 1.c"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Range
                </label>
                <input
                  type="text"
                  name="range"
                  value={formData.range}
                  onChange={handleInputChange}
                  placeholder="Product range"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Resistance Ratings Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Resistance Ratings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Footprints className="w-4 h-4 mr-2" />
                  Pet Friendly (x/6)
                </label>
                <input
                  type="text"
                  name="petfriendly"
                  value={formData.petfriendly}
                  onChange={handleInputChange}
                  placeholder="4/6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 mr-2" />
                  Water Resistant (x/6)
                </label>
                <input
                  type="text"
                  name="waterresistant"
                  value={formData.waterresistant}
                  onChange={handleInputChange}
                  placeholder="5/6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Scratch Resistant (x/6)
                </label>
                <input
                  type="text"
                  name="scratchresistant"
                  value={formData.scratchresistant}
                  onChange={handleInputChange}
                  placeholder="4/6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                   focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Additional Specifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b flex items-center justify-between">
              <span>Additional Specifications</span>
            </h2>

            <div className="space-y-4">
              {specificationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative"
                >
                  {/* Remove button */}
                  {specificationFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecificationField(field.id)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Key Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Key {index + 1}
                    </label>
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        handleSpecificationKeyValueChange(
                          field.id,
                          "key",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Board Size"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                       focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Value Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value {index + 1}
                    </label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        handleSpecificationKeyValueChange(
                          field.id,
                          "value",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., 230mm x 1520mm x 6mm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A]
                       focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add button at bottom */}
            <button
              type="button"
              onClick={addSpecificationField}
              className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-[#8A6A5A] text-gray-600
               hover:text-[#8A6A5A] px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Specification
            </button>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Pricing & Identification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="SKU-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A6A5A] focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Images
            </h2>

            {/* Product Images */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 mr-2" />
                Product Images
                {productImagePreview.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({productImagePreview.length} selected)
                  </span>
                )}
              </label>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
               hover:border-[#8A6A5A] hover:bg-blue-50 transition">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      Click to upload product images
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP (MAX. 5MB each)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "product")}
                  className="hidden"
                />
              </label>

              {productImagePreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  {productImagePreview.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, "product")}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all opacity-90 group-hover:opacity-100 group-hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Functions Images */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 mr-2" />
                Functions Images
                {functionsImagePreview.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({functionsImagePreview.length} selected)
                  </span>
                )}
              </label>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
               hover:border-[#8A6A5A] hover:bg-blue-50 transition">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      Click to upload function/feature images
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP (MAX. 5MB each)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "functions")}
                  className="hidden"
                />
              </label>

              {functionsImagePreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                  {functionsImagePreview.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Function ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, "functions")}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all opacity-90 group-hover:opacity-100 group-hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#998E8A]/80 hover:bg-[#998E8A] text-white font-semibold py-3 px-6 rounded-lg 
              transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  category: "",
                  type: "",
                  brand: "",
                  productImage: [],
                  functionsImage: [],
                  thickness: "",
                  pattern: "",
                  color: [],
                  productName: "",
                  description: "",
                  sku: "",
                  price: "",
                  range: "",
                  productDetails: "",
                  petfriendly: "",
                  waterresistant: "",
                  scratchresistant: "",
                  specifications: {
                    warranty: "",
                    installation: "",
                    maintenance: "",
                    dimensions: "",
                  },
                });
                setProductImagePreview([]);
                setFunctionsImagePreview([]);
                setUploadStatus({ type: "", message: "" });
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUploadDashboard;
