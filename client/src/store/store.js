
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth-slice';


import AdminProductsSlice from './admin/product-slice'
import AdminOrderSlice from './admin/order-slice.js'
import AdminAnalysisSlice from './admin/analysis'
import AdminCouponSlice from './admin/coupon'
import AdminBannerSlice from './admin/banner-slice'
import AdminUsersSlice from './admin/users-slice'
import brandsReducer from './admin/brands-slice'


import shopProductsSlice from './shop/products-slice'
import shopCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice.js'
import shopOrderSlice from './shop/order-slice.js'
import shopSearchSlice from './shop/search-slice'
import shopReviewSlice from './shop/reviews-slice'
import checkoutSlice from './shop/checkout-slice'
import commonFeatureSlice from './shop/common-slice'
import wishlistSlice from './shop/wishlist-slice'

const store = configureStore({
    reducer:{
        auth: authReducer,

        adminProducts :AdminProductsSlice,
        adminOrder :AdminOrderSlice,
        adminAnalysis: AdminAnalysisSlice,
        adminCoupon:AdminCouponSlice,
        adminBanner: AdminBannerSlice,
        adminUsers: AdminUsersSlice,
        adminBrands: brandsReducer,
        
        shopProducts : shopProductsSlice,
        shopCart:shopCartSlice,
        shopAddress:shopAddressSlice,
        shopOrder:shopOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewSlice,
        checkout: checkoutSlice,
        wishlist: wishlistSlice,
        
        commonFeature:commonFeatureSlice,
    }
})
export default store;