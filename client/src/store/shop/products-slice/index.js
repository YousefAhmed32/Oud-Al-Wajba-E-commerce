import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}




export const fetchAllFilteredProducts = createAsyncThunk(
  'products/fetchAllProduct',
  async ({ filtersParams, sortParams }) => {
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filtersParams)) {
  if (Array.isArray(value) && value.length > 0) {
    params.set(key, value.join(','));
  }
}
    
    if (sortParams) {
      params.set("sortBy", sortParams);
    }
    
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${params.toString()}`
    );
    
    return result?.data;
  }
);



export const fetchProductDetails = createAsyncThunk(
  'pro ducts/fetchProductDetails',
  async (id) => {
  
    
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );
    
    return result?.data;
  }
);


const shoppingProductSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers: {
    setProductDetails: (state)=>{
      state.productDetails = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
      state.isLoading = true
    }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
      console.log(action.payload)
      state.isLoading = false;
      state.productList = action.payload.data
    }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.productList = []
    }).addCase(fetchProductDetails.pending, (state, action) => {
      state.isLoading = true
    }).addCase(fetchProductDetails.fulfilled, (state, action) => {
      console.log(action.payload)
      state.isLoading = false;
      state.productDetails = action.payload.data
    }).addCase(fetchProductDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.productDetails = null
    })
  }
})

export const {setProductDetails } =shoppingProductSlice.actions
export default shoppingProductSlice.reducer
