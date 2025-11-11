import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading wishlist from localStorage:", err);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    const serializedState = JSON.stringify(wishlist);
    localStorage.setItem("wishlist", serializedState);
  } catch (err) {
    console.error("Error saving wishlist to localStorage:", err);
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      // Check if product already exists
      const existingItem = state.items.find(
        (item) => (item._id || item.id) === productId
      );
      
      if (!existingItem) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => (item._id || item.id) !== productId
      );
      saveWishlistToStorage(state.items);
    },
    
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
    
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      const existingIndex = state.items.findIndex(
        (item) => (item._id || item.id) === productId
      );
      
      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push(product);
      }
      
      saveWishlistToStorage(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some(
    (item) => (item._id || item.id) === productId
  );

export default wishlistSlice.reducer;

