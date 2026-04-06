import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/product"



const store = configureStore({
  reducer: {
    product: productReducer,
  }
});

export default store;
