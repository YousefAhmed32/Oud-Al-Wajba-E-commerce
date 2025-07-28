        require('dotenv').config()

        const express = require('express');
        const mongoose = require('mongoose');
        const cookiesParser = require('cookie-parser');
        const cors = require('cors');

        const authRoutes = require('./routes/auth/auth-routes');
        const adminProductsRoutes = require('./routes/admin/products-routes'); 
        const adminOrderRoutes = require('./routes/admin/order-routes'); 
        const adminAnalysisRoutes = require('./routes/admin/analysis-routes');
        const adminCouponRoutes = require('./routes/admin/coupon-routes');



        const shopProductsRouter =require('./routes/shop/products-routes')
        const shopCartRouter = require('./routes/shop/cart-routes');
        const shopAddressRouter= require('./routes/shop/Address')
        const shopOrderRouter= require('./routes/shop/order-routers')
        const shopSearchRouter= require('./routes/shop/search-routes')
        const shopReviewRouter= require('./routes/shop/review-routes')

        const commonFeatureRouter= require('./routes/common/feature-routes')

        mongoose.connect('mongodb+srv://my1042423:11112006%40My@cluster0.24cyuxm.mongodb.net/')

        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => console.log('MongoDB connection error:', err));




        const app = express();
        const PORT = process.env.PORT || 5000;

        app.use(
            cors({
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST','PUT', 'DELETE'],
                allowedHeaders: [
                    "Content-type",
                    "Authorization",
                    "Cache-Control",
                    "expires",
                    "Pragma",
                ],
                credentials: true

            })
        )
        app.use(cookiesParser());
        app.use(express.json());
        app.use('/api/auth', authRoutes);
        app.use('/api/admin/products',adminProductsRoutes)
        app.use('/api/admin/orders',adminOrderRoutes)
        app.use('/api/admin/analysis',adminAnalysisRoutes)
        app.use("/api/admin/coupons", adminCouponRoutes);




        app.use('/api/shop/products',shopProductsRouter)
        app.use('/api/shop/cart',shopCartRouter)
        app.use('/api/shop/address', shopAddressRouter)
        app.use('/api/shop/order', shopOrderRouter)
        app.use('/api/shop/search', shopSearchRouter)
        app.use('/api/shop/review', shopReviewRouter)

        app.use('/api/common/feature', commonFeatureRouter)

        app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));