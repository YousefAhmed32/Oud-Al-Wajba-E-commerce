
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth-slice';


import AdminProductsSlice from './admin/product-slice'
import AdminOrderSlice from './admin/order-slice.js'
import AdminAnalysisSlice from './admin/analysis'
import AdminCouponSlice from './admin/coupon'


import shopProductsSlice from './shop/products-slice'
import shopCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice.js'
import shopOrderSlice from './shop/order-slice.js'
import shopSearchSlice from './shop/search-slice'
import shopReviewSlice from './shop/reviews-slice'
import commonFeatureSlice from './shop/common-slice'

const store = configureStore({
    reducer:{
        auth: authReducer,

        adminProducts :AdminProductsSlice,
        adminOrder :AdminOrderSlice,
        adminAnalysis: AdminAnalysisSlice,
        adminCoupon:AdminCouponSlice,
        
        shopProducts : shopProductsSlice,
        shopCart:shopCartSlice,
        shopAddress:shopAddressSlice,
        shopOrder:shopOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewSlice,
        
        commonFeature:commonFeatureSlice,
    }
})
export default store;