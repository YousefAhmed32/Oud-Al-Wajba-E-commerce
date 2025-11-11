# Quick Start Guide - Checkout System

## 🚀 Server Setup

The server is already configured. Just make sure:

1. **Install dependencies** (if needed):
```bash
cd server
npm install
```

2. **Environment variables** (`.env` file):
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
```

3. **Start server**:
```bash
npm start
# or
node server.js
```

## 📋 New API Endpoints

### User Checkout
- `POST /api/checkout/create-order` - Create order with payment proof
- `GET /api/checkout/:id` - Get order details

### Admin Orders
- `GET /api/admin/orders-new` - List all orders (with filters)
- `PUT /api/admin/orders-new/:id/approve` - Approve order
- `PUT /api/admin/orders-new/:id/reject` - Reject order
- `PUT /api/admin/orders-new/:id/status` - Update status

### Samples
- `POST /api/samples/request` - Request free sample
- `GET /api/samples` - User's samples
- `GET /api/admin/samples` - All samples (admin)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code

## 🎨 Frontend Integration

### Use the New Checkout Page

Navigate to the new checkout page:
```jsx
import ShoppingCheckoutNew from '@/Pages/shopping-view/checkout-new';
```

Or add route in your router:
```jsx
{
  path: '/shop/checkout',
  element: <ShoppingCheckoutNew />
}
```

### Redux Store

The checkout slice is already added to store. Use in components:
```jsx
import { useDispatch, useSelector } from 'react-redux';
import { createCheckoutOrder, validateCoupon } from '@/store/shop/checkout-slice';

const { isLoading, orderId, couponDiscount } = useSelector(state => state.checkout);
const dispatch = useDispatch();
```

## 📤 Example: Create Order

```javascript
const orderData = {
  items: [
    {
      productId: 'product-id',
      title: 'Product Name',
      price: 100,
      quantity: 2,
      productImage: 'image-url'
    }
  ],
  address: {
    addressId: 'address-id',
    address: 'Street Address',
    city: 'Doha',
    pincode: '12345',
    phone: '+97412345678',
    country: 'Qatar'
  },
  paymentMethod: 'phone', // or 'card'
  couponCode: 'DISCOUNT10' // optional
};

// paymentProof is a File object
dispatch(createCheckoutOrder({ orderData, paymentProof: file }));
```

## ✅ Testing Checklist

1. ✅ Server starts without errors
2. ✅ Upload directories created (`/uploads/products`, `/uploads/order-proofs`)
3. ✅ MongoDB connection successful
4. ⏳ Test order creation with payment proof
5. ⏳ Test coupon validation
6. ⏳ Test admin approve/reject flow

## 🔧 Troubleshooting

**Issue**: Routes not found
- ✅ Check that all route files exist in correct paths
- ✅ Verify server.js has all route imports

**Issue**: File upload fails
- ✅ Check multer middleware is installed
- ✅ Verify upload directories exist
- ✅ Check file size limit (5MB max)

**Issue**: Authentication errors
- ✅ Ensure auth middleware is applied to protected routes
- ✅ Check `req.user` is set by middleware

## 📁 File Structure

```
server/
├── controllers/
│   ├── shop/
│   │   ├── checkout-controller.js ✨ NEW
│   │   ├── sample-controller.js ✨ NEW
│   │   └── coupon-controller.js ✨ NEW
│   └── admin/
│       ├── admin-order-controller.js ✨ NEW
│       └── sample-controller.js ✨ NEW
├── routes/
│   ├── shop/
│   │   ├── checkout-routes.js ✨ NEW
│   │   ├── samples-routes.js ✨ NEW
│   │   └── coupon-routes.js ✨ NEW
│   └── admin/
│       ├── admin-orders-routes.js ✨ NEW
│       └── admin-samples-routes.js ✨ NEW
└── middleware/
    └── upload.js ✨ UPDATED

client/src/
├── Pages/shopping-view/
│   └── checkout-new.jsx ✨ NEW
└── store/shop/
    └── checkout-slice/ ✨ NEW
```

## 🎯 Next Steps

1. Test the checkout flow end-to-end
2. Add authentication middleware to protected routes
3. Build admin UI for order management
4. Add sample request UI to product pages
5. Implement order notifications

---

**Status**: ✅ Backend implementation complete
**Ready for**: Frontend testing and UI completion

