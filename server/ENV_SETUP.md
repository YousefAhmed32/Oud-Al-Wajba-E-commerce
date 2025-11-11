# إعداد ملف .env - Environment Variables

## 📝 إنشاء ملف .env

قم بإنشاء ملف `.env` في مجلد `server/` واكتب فيه المتغيرات التالية:

```env
# MongoDB Connection - رابط قاعدة البيانات
# للتخزين المحلي (MongoDB على الجهاز):
MONGODB_URI=mongodb://localhost:27017/ecommerce

# أو لـ MongoDB Atlas (السحابي):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration - إعدادات السيرفر
PORT=5000

# CORS Origin - رابط الواجهة الأمامية
CORS_ORIGIN=http://localhost:5173

# JWT Secret - مفتاح الأمان للتوكينات (اختر مفتاح قوي)
JWT_SECRET=your-secret-key-here-change-in-production

# Environment - بيئة التشغيل
NODE_ENV=development
```

## 🔧 التخزين المحلي (Local Storage)

### قاعدة البيانات (MongoDB)
للتخزين المحلي، تحتاج لتثبيت MongoDB على جهازك:

**Windows:**
```bash
# تحميل MongoDB من الموقع الرسمي
# https://www.mongodb.com/try/download/community

# أو استخدام Chocolatey
choco install mongodb

# تشغيل MongoDB
mongod
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### ملفات الصور
الصور يتم تخزينها محلياً في:
```
server/uploads/products/
```

هذا المجلد يتم إنشاؤه تلقائياً عند أول رفع صورة.

## 📦 متغيرات البيئة المدعومة

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `MONGODB_URI` | رابط قاعدة البيانات | `mongodb://localhost:27017/ecommerce` |
| `PORT` | منفذ السيرفر | `5000` |
| `CORS_ORIGIN` | رابط الواجهة الأمامية | `http://localhost:5173` |
| `JWT_SECRET` | مفتاح الأمان | (مطلوب في الإنتاج) |
| `NODE_ENV` | بيئة التشغيل | `development` |

## 🚀 البدء

بعد إنشاء ملف `.env`:

```bash
cd server
npm install
npm run dev
```

## ⚠️ ملاحظات مهمة

1. **لا تقم برفع ملف `.env` إلى Git** - هو موجود في `.gitignore`
2. **استخدم مفتاح JWT قوي في الإنتاج**
3. **تأكد من تشغيل MongoDB قبل تشغيل السيرفر** (للتخزين المحلي)
4. **في الإنتاج، غيّر `NODE_ENV` إلى `production`**

## 🔐 الأمان

- احتفظ بملف `.env` بشكل آمن
- لا تشارك مفتاح JWT أو كلمات مرور قاعدة البيانات
- استخدم متغيرات بيئة منفصلة لكل بيئة (تطوير، اختبار، إنتاج)

