import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UPLOAD_PRODUCT,
  ALL_PRODUCT,
  PRODUCT_BY_ID,
  PRODUCT_BY_TYPE_NAME,
  PRODUCT_BY_RANGE,
  SEARCH_PRODUCT,
  UPDATE_PRODUCT,
} from "../../api/api";
import api from "../../api/axios";

const initialState = {
  upload: {
    loading: false,
    success: false,
    error: null,
  },
  list: {
    loading: false,
    data: [],
    searchResults: [],
    error: null,
    fetched: false,
  },
};

export const uploadProduct = createAsyncThunk(
  "product/uploadProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // text fields
      formData.append("category", productData.category);
      formData.append("type", productData.type);
      formData.append("brand", productData.brand);
      formData.append("range", productData.range);
      formData.append("productName", productData.productName);
      formData.append("productDetails", productData.productDetails);
      formData.append("sku", productData.sku);
      formData.append("petfriendly", productData.petfriendly);
      formData.append("waterresistant", productData.waterresistant);
      formData.append("scratchresistant", productData.scratchresistant);
      formData.append("pattern", productData.pattern);
      formData.append("dimensions", productData.dimensions);
      formData.append("packsize", productData.packsize);
      formData.append("brochurelink", productData.brochurelink);
      formData.append("thickness", productData.thickness);
      formData.append("description", productData.description);

      // arrays → stringify
      formData.append("color", JSON.stringify(productData.color));

      // product images
      productData.productImage?.forEach((file) => {
        formData.append("productImage", file);
      });

      // function images
      productData.functionsImage?.forEach((file) => {
        formData.append("functionsImage", file);
      });

      console.log(formData);

      const { data } = await api.post(UPLOAD_PRODUCT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "product/getallProduct",
  async (_, { rejectWithValue }) => {
    console.log("THUNK HIT");
    console.log(import.meta.env.VITE_BACKEND_URI + "" + ALL_PRODUCT);
    try {
      const data = await api.get(ALL_PRODUCT);
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (proId, { rejectWithValue }) => {
    try {
      const data = await api.post(`${PRODUCT_BY_ID}/${proId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getProductByTypeName = createAsyncThunk(
  "product/getProductbyTypeandBrand",
  async ({ type, productName }, { rejectWithValue }) => {
    try {
      const productData = { type, productName };
      console.log(productData);
      console.log("Product id:", productData);
      const data = await api.post(PRODUCT_BY_TYPE_NAME, productData);
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getProductByRange = createAsyncThunk(
  "product/getProductByRange",
  async (range, { rejectWithValue }) => {
    try {
      const data = await api.post(PRODUCT_BY_RANGE, { range });
      console.log(data.data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const searchProduct = createAsyncThunk(
  "product/searchProduct",
  async (name, { rejectWithValue }) => {
    try {
      const res = await api.post(SEARCH_PRODUCT, { name: name });
      console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateproduct",
  async ({ id, formdata }, { rejectWithValue }) => {
    console.log(formdata);
    try {
      console.log(id);
      const res = await api.put(`${UPDATE_PRODUCT}/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProduct.pending, (state) => {
        state.upload.loading = true;
        state.upload.success = false;
      })
      .addCase(uploadProduct.fulfilled, (state) => {
        state.upload.loading = false;
        state.upload.success = true;
      })
      .addCase(uploadProduct.rejected, (state, action) => {
        state.upload.loading = false;
        state.upload.error = action.payload;
      });

    builder
      .addCase(getAllProducts.pending, (state) => {
        state.list.loading = true;
        state.list.fetched = false;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.fetched = true;
        state.list.data = action.payload.data;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.fetched = false;
        state.list.error = action.payload;
      });

    builder
      .addCase(getProductById.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.data;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });

    builder
      .addCase(getProductByTypeName.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(getProductByTypeName.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.data;
      })
      .addCase(getProductByTypeName.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });

    builder
      .addCase(getProductByRange.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(getProductByRange.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.data;
      })
      .addCase(getProductByRange.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });

    builder
      .addCase(searchProduct.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.searchResults = action.payload;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.searchResults = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });
  },
});

export default productSlice.reducer;
