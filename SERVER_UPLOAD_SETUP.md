# دليل إعداد رفع الصور على السيرفر (Linux + Nginx)

## التعديلات التي تمت

### 1. ملف `server/middleware/upload.js`
- ✅ استخدام مسارات مطلقة (`path.resolve`) بدلاً من المسارات النسبية
- ✅ إضافة دالة `ensureDirectoryExists` لإنشاء المجلدات بصلاحيات صحيحة (755)
- ✅ إضافة معالجة أخطاء شاملة مع logging مفصل
- ✅ تنظيف أسماء الملفات من الأحرف الخاصة

### 2. ملف `server/server.js`
- ✅ استخدام مسار مطلق لـ `express.static`
- ✅ إنشاء المجلدات بصلاحيات صحيحة عند بدء التشغيل
- ✅ إضافة endpoint للاختبار: `/api/test-upload`
- ✅ إضافة logging مفصل لعرض المسارات والصلاحيات

## خطوات الإعداد على السيرفر

### 1. التأكد من وجود المجلدات
```bash
# تأكد من وجود المجلدات
cd /path/to/your/project/server
mkdir -p uploads/products uploads/order-proofs
```

### 2. تعيين الصلاحيات الصحيحة
```bash
# تعيين صلاحيات 755 للمجلدات (rwxr-xr-x)
chmod 755 uploads
chmod 755 uploads/products
chmod 755 uploads/order-proofs

# تعيين صلاحيات الكتابة للملفات الموجودة (إن وجدت)
chmod 644 uploads/products/*
chmod 644 uploads/order-proofs/*
```

### 3. التأكد من أن المستخدم الذي يشغل Node.js لديه صلاحيات الكتابة
```bash
# إذا كنت تستخدم PM2 أو systemd، تأكد من أن المستخدم لديه صلاحيات
# مثال: إذا كان المستخدم هو "nodeuser"
sudo chown -R nodeuser:nodeuser uploads/
```

### 4. إعداد Nginx (اختياري - إذا كنت تستخدم Nginx كـ reverse proxy)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Proxy للـ API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # خدمة الملفات الثابتة مباشرة من Nginx (أسرع)
    location /uploads {
        alias /path/to/your/project/server/uploads;
        expires 1d;
        add_header Cache-Control "public, immutable";
        
        # السماح بجميع أنواع الصور
        location ~* \.(jpg|jpeg|png|gif|webp)$ {
            access_log off;
        }
    }

    # أو يمكنك ترك Express يخدم الملفات (أبسط)
    # في هذه الحالة لا تحتاج location /uploads في Nginx
}
```

## اختبار الرفع على السيرفر

### طريقة 1: استخدام endpoint الاختبار المدمج

#### باستخدام curl:
```bash
curl -X POST http://yourdomain.com/api/test-upload \
  -F "image=@/path/to/test-image.jpg" \
  -H "Content-Type: multipart/form-data"
```

#### باستخدام Postman:
1. افتح Postman
2. اختر `POST`
3. أدخل الرابط: `http://yourdomain.com/api/test-upload`
4. اذهب إلى `Body` → `form-data`
5. أضف حقل باسم `image` واختر نوع `File`
6. اختر صورة للرفع
7. أرسل الطلب

#### باستخدام JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://yourdomain.com/api/test-upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => {
  console.log('Upload successful:', data);
  // ستجد رابط الصورة في data.file.fullUrl
  window.open(data.file.fullUrl);
});
```

### طريقة 2: التحقق من الـ Logs
عند رفع صورة، ستجد في logs السيرفر:
```
📁 Product upload destination: /path/to/server/uploads/products
📝 Generated filename: image-1234567890-987654321.jpg
✅ Test upload successful: { filename: '...', path: '...', url: '...' }
```

### طريقة 3: التحقق المباشر من الملفات
```bash
# التحقق من وجود الملفات
ls -la /path/to/your/project/server/uploads/products/
ls -la /path/to/your/project/server/uploads/order-proofs/

# التحقق من الصلاحيات
stat /path/to/your/project/server/uploads/products/
```

## حل المشاكل الشائعة

### المشكلة: 404 عند الوصول للصور
**الحل:**
1. تأكد من أن `express.static` يعمل بشكل صحيح
2. تحقق من أن المسار في `express.static` صحيح
3. إذا كنت تستخدم Nginx، تأكد من إعداد `location /uploads` بشكل صحيح

### المشكلة: الصور لا تُحفظ
**الحل:**
1. تحقق من صلاحيات المجلدات:
   ```bash
   ls -la uploads/
   ```
2. تأكد من أن المستخدم الذي يشغل Node.js لديه صلاحيات الكتابة:
   ```bash
   sudo chown -R $USER:$USER uploads/
   chmod -R 755 uploads/
   ```

### المشكلة: خطأ "EACCES: permission denied"
**الحل:**
```bash
# إعطاء صلاحيات كاملة للمجلدات
sudo chmod -R 755 uploads/
sudo chown -R $USER:$USER uploads/
```

### المشكلة: الصور تظهر محليًا لكن لا تظهر على السيرفر
**الحل:**
1. تحقق من أن المسار في `express.static` مطلق وليس نسبي
2. تحقق من أن Nginx (إن وجد) يخدم الملفات بشكل صحيح
3. تحقق من الـ CORS settings

## نصائح إضافية

1. **استخدم PM2** لإدارة العملية:
   ```bash
   pm2 start server.js --name "ecommerce-api"
   pm2 logs ecommerce-api
   ```

2. **راقب الـ Logs** عند الرفع:
   ```bash
   # إذا كنت تستخدم PM2
   pm2 logs ecommerce-api --lines 50
   ```

3. **اختبار الصلاحيات**:
   ```bash
   # اختبار الكتابة
   touch uploads/products/test.txt
   rm uploads/products/test.txt
   ```

4. **التحقق من المسارات**:
   عند بدء السيرفر، ستجد في الـ logs:
   ```
   📁 Upload base directory: /path/to/server/uploads
   📁 Products upload directory: /path/to/server/uploads/products
   📁 Order proofs upload directory: /path/to/server/uploads/order-proofs
   ```

## مثال على Response من endpoint الاختبار

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "test-1234567890-987654321.jpg",
    "originalName": "test.jpg",
    "path": "/path/to/server/uploads/products/test-1234567890-987654321.jpg",
    "size": 123456,
    "mimetype": "image/jpeg",
    "url": "/uploads/products/test-1234567890-987654321.jpg",
    "fullUrl": "http://yourdomain.com/uploads/products/test-1234567890-987654321.jpg"
  },
  "uploadPaths": {
    "products": "/path/to/server/uploads/products",
    "orderProofs": "/path/to/server/uploads/order-proofs",
    "base": "/path/to/server/uploads"
  },
  "instructions": {
    "testImage": "Visit: http://yourdomain.com/uploads/products/test-1234567890-987654321.jpg",
    "verifyFile": "Check if file exists at: /path/to/server/uploads/products/test-1234567890-987654321.jpg"
  }
}
```

## ملاحظات مهمة

- ✅ الكود الآن يستخدم مسارات مطلقة، لذا سيعمل بغض النظر عن مكان تشغيل التطبيق
- ✅ الصلاحيات تُعيّن تلقائيًا عند إنشاء المجلدات (755)
- ✅ يوجد logging مفصل لتتبع أي مشاكل
- ✅ endpoint الاختبار `/api/test-upload` متاح للاختبار السريع

---

**تم التعديل بواسطة:** AI Agent  
**التاريخ:** 2024

