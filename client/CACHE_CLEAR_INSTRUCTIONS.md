# تعليمات مسح الكاش وإصلاح المشاكل

إذا واجهت مشكلة `getProductImageUrl is not defined` رغم أن الاستيراد موجود:

## الحلول:

### 1. مسح كاش المتصفح
- اضغط `Ctrl + Shift + R` (أو `Cmd + Shift + R` على Mac)
- أو `Ctrl + F5`

### 2. مسح كاش Vite
أوقف السيرفر ثم شغّل:
```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

### 3. إعادة تحميل كاملة
1. أوقف السيرفر (Ctrl + C)
2. شغّل: `npm run dev`

