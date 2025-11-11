# نظام الطلب والدفع المخصص - توثيق التنفيذ

## نظرة عامة
تم تنفيذ نظام طلب ودفع مخصص كامل لمشروع MERN E-commerce بدون PayPal، مع دعم كوبونات الخصم وإشعارات فورية للأدمن.

## التغييرات الرئيسية

### 1. Backend Changes

#### Models
- **Order Model** (`server/models/Order.js`):
  - إضافة دعم لطرق الدفع الجديدة: `COD`, `Free Sample`, `Transfer`
  - إضافة `transferInfo` مع: `fullName`, `amountTransferred`, `image`
  - إضافة `appliedCoupon` snapshot: `code`, `type`, `value`, `discountAmount`
  - إضافة `totalBeforeDiscount` و `totalAfterDiscount`
  - تحديث `orderStatus` لدعم: `pending`, `accepted`, `rejected`, `on the way`

#### Middleware
- **Auth Middleware** (`server/middleware/auth.js`):
  - `authMiddleware`: التحقق من JWT token
  - `isAdmin`: التحقق من صلاحيات الأدمن

#### Controllers
- **Checkout Controller** (`server/controllers/shop/checkout-controller.js`):
  - دعم طرق الدفع الثلاث (COD, Free Sample, Transfer)
  - التحقق من الكوبونات وحساب الخصم
  - حفظ snapshot للكوبون في الطلب
  - إشعارات Socket.io عند إنشاء طلب جديد

- **Admin Order Controller** (`server/controllers/admin/admin-order-controller.js`):
  - دعم الحالات الجديدة: `accepted`, `rejected`, `on the way`
  - عرض تفاصيل التحويل (Transfer details)

#### Routes
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders/:id` - تفاصيل الطلب
- `GET /api/users/:id/orders` - طلبات المستخدم
- `POST /api/coupons/validate` - التحقق من الكوبون

#### Socket.io
- إعداد Socket.io على Backend
- Event `newOrder` يُرسل للأدمن عند إنشاء طلب جديد

### 2. Frontend Changes

#### Redux Slices
- **Checkout Slice** (`client/src/store/shop/checkout-slice/index.js`):
  - `createCheckoutOrder`: إنشاء طلب مع دعم Transfer image
  - `validateCoupon`: التحقق من الكوبون عبر API

- **Order Slice** (`client/src/store/shop/order-slice.js/index.js`):
  - تحديث endpoints لاستخدام `/api/users/:id/orders` و `/api/orders/:id`

#### Pages & Components
- **Checkout Page** (`client/src/Pages/shopping-view/checkout.jsx`):
  - واجهة اختيار طريقة الدفع (COD, Free Sample, Transfer)
  - واجهة Transfer مع:
    - عرض رقم الهاتف والحساب البنكي الوهمي
    - إدخال الاسم الكامل والمبلغ المحوّل
    - رفع صورة التحويل
  - تطبيق الكوبون عبر API
  - ملخص الطلب مع الخصم والتوصيل

- **Order History** (`client/src/components/shopping-view/orders.jsx`):
  - عرض طلبات المستخدم مع:
    - طريقة الدفع
    - حالة الطلب
    - قيمة الخصم إن وُجدت

- **Admin Orders** (`client/src/components/admin-view/orders.jsx`):
  - فلترة حسب الحالة (pending, accepted, rejected, on the way, delivered)
  - عرض تفاصيل Transfer (اسم المرسل)
  - عرض طريقة الدفع

- **Admin Coupons** (`client/src/Pages/admin-view/coupon.jsx`):
  - موجودة وتعمل بالفعل

## طرق الدفع المدعومة

### 1. COD (الدفع عند الاستلام)
- لا يحتاج صورة أو معلومات إضافية
- الحالة الافتراضية: `pending`

### 2. Free Sample (تجربة مجانية)
- لا يحتاج صورة أو معلومات إضافية
- الحالة الافتراضية: `pending`
- `isSampleOrder: true`

### 3. Transfer (تحويل بنكي/هاتف)
- يحتاج:
  - `fullName`: الاسم الكامل
  - `amountTransferred`: المبلغ المحوّل
  - `transferImage`: صورة التحويل
- الحالة الافتراضية: `awaiting_admin_approval`
- رقم هاتف وهمي: `01012345678`
- رقم حساب بنكي وهمي: `1234567890123456`

## نظام الكوبونات

### التحقق من الكوبون
- Endpoint: `POST /api/coupons/validate`
- Input: `{ code, orderAmount, userId? }`
- Output: `{ valid, discountAmount, reason }`

### التحققات:
- صلاحية الكوبون (`isActive`)
- تاريخ الانتهاء (`expiresAt`)
- حد الاستخدام العام (`usageLimitGlobal`)
- حد الاستخدام لكل مستخدم (`usageLimitPerUser`)
- الحد الأدنى للطلب (`minOrderAmount`)

### حفظ الكوبون في الطلب
يتم حفظ snapshot للكوبون في `appliedCoupon`:
```javascript
{
  code: String,
  type: 'percent' | 'fixed',
  value: Number,
  discountAmount: Number
}
```

## الإشعارات (Socket.io)

### Backend
- Socket.io مُعد على `server.js`
- Event `newOrder` يُرسل عند إنشاء طلب جديد

### Client (Admin)
- يحتاج إعداد Socket.io client في لوحة الأدمن
- الاستماع لـ `newOrder` event

## ملاحظات مهمة

1. **تثبيت socket.io**: 
   ```bash
   cd server
   npm install socket.io
   ```

2. **مسار الصور**: 
   - يتم حفظ صور التحويل في `server/uploads/order-proofs/`
   - يتم الوصول إليها عبر `/uploads/order-proofs/filename`

3. **الأرقام الوهمية للتحويل**:
   - رقم الهاتف: `01012345678`
   - رقم الحساب: `1234567890123456`

4. **التوصيل المجاني**: 
   - عند الطلب >= 100 QR: توصيل مجاني
   - أقل من 100 QR: 10 QR رسوم توصيل

## Testing

### حالات الاختبار:
1. ✅ كوبون صالح - يجب أن يُطبق الخصم
2. ✅ كوبون منتهي - يجب أن يُرفض
3. ✅ استهلاك حد الاستخدام - يجب أن يُرفض
4. ✅ min order amount - يجب أن يُرفض إذا كان الطلب أقل
5. ✅ طلب Transfer مع رفع صورة - يجب أن يُنشأ بنجاح
6. ✅ طلب COD/Free Sample - يجب أن يُنشأ بدون صورة

## الخطوات التالية (اختياري)

1. إضافة Socket.io client في لوحة الأدمن للإشعارات الفورية
2. إضافة إيميل notifications عبر Nodemailer
3. إضافة collection `notifications` لتخزين الإشعارات
4. تحسين واجهة عرض تفاصيل Transfer في modal

## الملفات المعدلة/المضافة

### Backend:
- `server/models/Order.js`
- `server/middleware/auth.js` (جديد)
- `server/controllers/shop/checkout-controller.js`
- `server/controllers/admin/admin-order-controller.js`
- `server/routes/shop/orders-routes.js` (جديد)
- `server/routes/shop/user-orders-routes.js` (جديد)
- `server/server.js` (إضافة Socket.io)
- `server/package.json` (إضافة socket.io)

### Frontend:
- `client/src/Pages/shopping-view/checkout.jsx`
- `client/src/components/shopping-view/orders.jsx`
- `client/src/components/admin-view/orders.jsx`
- `client/src/store/shop/checkout-slice/index.js`
- `client/src/store/shop/order-slice.js/index.js`

