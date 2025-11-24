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
        const adminBrandRoutes = require('./routes/admin/brand-routes');



        const shopProductsRouter =require('./routes/shop/products-routes')
        const shopCartRouter = require('./routes/shop/cart-routes');
        const shopAddressRouter= require('./routes/shop/Address')
        const shopOrderRouter= require('./routes/shop/order-routers')
        const shopSearchRouter= require('./routes/shop/search-routes')
        const shopReviewRouter= require('./routes/shop/review-routes')
        
        // New checkout and sample routes
        const shopCheckoutRouter = require('./routes/shop/checkout-routes');
        const shopSampleRouter = require('./routes/shop/samples-routes');
        const shopCouponRouter = require('./routes/shop/coupon-routes');

        const commonFeatureRouter= require('./routes/common/feature-routes')
        
        // Admin routes
        const adminOrdersRouter = require('./routes/admin/admin-orders-routes');
        const adminSamplesRouter = require('./routes/admin/admin-samples-routes');
        const adminUsersRouter = require('./routes/admin/users-routes');


        //         mongoose.connect('mongodb+srv://my1042423:11112006%40My@cluster0.24cyuxm.mongodb.net/')
        //.then(() => console.log('MongoDB connected successfully'))
        //.catch(err => console.log('MongoDB connection error:', err));


        
        // Connect to MongoDB using environment variable
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
        
        mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err);
            process.exit(1);
        });




        const app = express();
        const PORT = process.env.PORT || 5000;
        
        // Socket.io setup for real-time notifications
        const http = require('http');
        const server = http.createServer(app);
        const { Server } = require('socket.io');
        const io = new Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        
        // Store io instance in app for use in controllers
        app.set('io', io);
        
        // Socket.io connection handling
        io.on('connection', (socket) => {
            console.log('✅ Client connected:', socket.id);
            
            // Handle admin authentication and room joining
            socket.on('joinAdminRoom', (data) => {
                // Verify admin token if needed
                // For now, allow joining admin room
                socket.join('admin');
                console.log(`👤 Admin joined room: ${socket.id}`);
            });
            
            // Handle user authentication and room joining
            socket.on('joinUserRoom', (userId) => {
                socket.join(`user_${userId}`);
                console.log(`👤 User ${userId} joined room: ${socket.id}`);
            });
            
            socket.on('disconnect', () => {
                console.log('❌ Client disconnected:', socket.id);
            });
        });

        // CORS configuration from environment variable
        // const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
        
        // app.use(
        //     cors({
        //         origin: CORS_ORIGIN,
        //         methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        //         allowedHeaders: [
        //             "Content-type",
        //             "Authorization",
        //             "Cache-Control",
        //             "expires",
        //             "Pragma",
        //         ],
        //         credentials: true

        //     })
        // )

        const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-type",
      "Authorization",
      "Cache-Control",
      "expires",
      "Pragma",
    ],
  })
);

        app.use(cookiesParser());
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true }));
        
        // Serve uploaded files statically
        const path = require('path');
        const fs = require('fs');
        
        // Get absolute path for uploads directory
        const uploadsBasePath = path.resolve(__dirname, 'uploads');
        const uploadsDirs = [
            path.join(uploadsBasePath, 'products'),
            path.join(uploadsBasePath, 'order-proofs')
        ];
        
        // Ensure upload directories exist with proper permissions
        uploadsDirs.forEach(dir => {
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
                    console.log(`✅ Created upload directory: ${dir}`);
                } else {
                    // Ensure directory has correct permissions (755 = rwxr-xr-x)
                    try {
                        fs.chmodSync(dir, 0o755);
                    } catch (chmodError) {
                        console.warn(`⚠️ Could not set permissions for ${dir}:`, chmodError.message);
                    }
                }
                
                // Verify directory is writable
                fs.accessSync(dir, fs.constants.W_OK);
                console.log(`✅ Upload directory is writable: ${dir}`);
            } catch (error) {
                console.error(`❌ Error setting up upload directory ${dir}:`, error);
                // Don't exit - let the app start but log the error
            }
        });
        
        // Serve static files from uploads directory
        // This allows accessing files via: http://domain.com/uploads/products/filename.jpg
        app.use('/uploads', express.static(uploadsBasePath, {
            dotfiles: 'deny',
            index: false,
            maxAge: '1d', // Cache for 1 day
            etag: true,
            lastModified: true
        }));
        
        console.log(`📁 Serving static files from: ${uploadsBasePath}`);
        
        app.use('/api/auth', authRoutes);
        app.use('/api/admin/products',adminProductsRoutes)
        app.use('/api/admin/orders',adminOrderRoutes)
        app.use('/api/admin/analysis',adminAnalysisRoutes)
        app.use("/api/admin/coupons", adminCouponRoutes);
        app.use('/api/admin', adminBrandRoutes);
        
        // New admin routes
        app.use('/api/admin/orders-new', adminOrdersRouter);
        app.use('/api/admin/samples', adminSamplesRouter);
        app.use('/api/admin/users', adminUsersRouter);




        app.use('/api/shop/products',shopProductsRouter)
        app.use('/api/shop/cart',shopCartRouter)
        app.use('/api/shop/address', shopAddressRouter)
        app.use('/api/shop/order', shopOrderRouter)
        app.use('/api/shop/search', shopSearchRouter)
        app.use('/api/shop/review', shopReviewRouter)
        
        // New shop routes
        app.use('/api/checkout', shopCheckoutRouter);
        app.use('/api/samples', shopSampleRouter);
        app.use('/api/coupons', shopCouponRouter);
        
        // New orders routes
        const shopOrdersRouter = require('./routes/shop/orders-routes');
        const userOrdersRouter = require('./routes/shop/user-orders-routes');
        app.use('/api/orders', shopOrdersRouter);
        app.use('/api/users', userOrdersRouter);
        
        // Order details route (legacy compatibility)
        // app.use('/api/orders', shopCheckoutRouter); // Commented out - using new route above

        app.use('/api/common/feature', commonFeatureRouter) 

        // Health check endpoint
        app.get('/health', (req, res) => {
            console.log('Server is running');
            res.status(200).send('Server is running');
        });
        
        // Test upload endpoint - for testing file uploads on server
        // Usage: POST /api/test-upload with multipart/form-data field "testImage"
        app.post('/api/test-upload', (req, res) => {
            const { uploadSingleImage, getUploadPaths } = require('./middleware/upload');
            
            uploadSingleImage(req, res, (err) => {
                if (err) {
                    console.error('❌ Upload test error:', err);
                    return res.status(400).json({
                        success: false,
                        error: err.message || 'Upload failed',
                        details: err.toString()
                    });
                }
                
                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: 'No file uploaded',
                        message: 'Please send a file with field name "image"'
                    });
                }
                
                const uploadPaths = getUploadPaths();
                const fileUrl = `/uploads/products/${req.file.filename}`;
                
                console.log('✅ Test upload successful:', {
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    url: fileUrl
                });
                
                res.json({
                    success: true,
                    message: 'File uploaded successfully',
                    file: {
                        filename: req.file.filename,
                        originalName: req.file.originalname,
                        path: req.file.path,
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                        url: fileUrl,
                        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
                    },
                    uploadPaths: uploadPaths,
                    instructions: {
                        testImage: `Visit: ${req.protocol}://${req.get('host')}${fileUrl}`,
                        verifyFile: `Check if file exists at: ${req.file.path}`
                    }
                });
            });
        });

        server.listen(PORT, ()=> {
            // Import upload utilities for logging
            const { getUploadPaths } = require('./middleware/upload');
            const uploadPaths = getUploadPaths();
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📁 Upload base directory: ${uploadPaths.base}`);
            console.log(`📁 Products upload directory: ${uploadPaths.products}`);
            console.log(`📁 Order proofs upload directory: ${uploadPaths.orderProofs}`);
            console.log(`🌐 Static files URL: http://localhost:${PORT}/uploads/`);
            console.log(`🌐 CORS Origin: ${CORS_ORIGIN}`);
            console.log(`🔌 Socket.io ready for real-time notifications`);
        });