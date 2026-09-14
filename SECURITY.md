# 🔒 دليل الأمان والحماية - ProVideoAI

## ⚠️ تحذير حماية حرج

**هذا التطبيق مخصص للاستخدام المحلي فقط ولم يتم نشره على الإنترنت بعد**
**لا تستخدم هذا التطبيق في بيئة إنتاجية بدون تطبيق إجراءات الأمان الكاملة**

---

## 🛡️ إجراءات الأمان المطلوبة

### 1️⃣ تأمين البيانات (Data Security)

#### ✅ تشفير كلمات المرور
```javascript
// استخدم bcrypt أو argon2
// لا تخزن كلمات المرور بدون تشفير أبداً
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

#### ✅ تشفير البيانات الحساسة
```javascript
// استخدم AES-256 للبيانات الحساسة
const crypto = require('crypto');
const cipher = crypto.createCipher('aes-256-cbc', secretKey);
```

#### ❌ لا تفعل أبداً:
- تخزين كلمات المرور بنص عادي
- حفظ بيانات العملاء بدون تشفير
- إرسال بيانات حساسة عبر HTTP (استخدم HTTPS فقط)

---

### 2️⃣ تأمين API (API Security)

#### ✅ استخدم JWT Tokens
```javascript
// توليد token آمن
const jwt = require('jsonwebtoken');
const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```

#### ✅ تحقق من الـ Tokens
```javascript
// تحقق من صحة كل طلب
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
```

#### ✅ Rate Limiting (منع الهجمات)
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100 // 100 طلب فقط
});
app.use(limiter);
```

#### ❌ لا تفعل أبداً:
- لا ترسل كلمات المرور في الـ URL
- لا تثق بـ input المستخدم بدون التحقق
- لا تعرض رسائل خطأ تفصيلية (قد تساعد الهاكرز)

---

### 3️⃣ التحقق من المدخلات (Input Validation)

#### ✅ تحقق من جميع المدخلات
```javascript
const validator = require('validator');

// التحقق من البريد الإلكتروني
if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'البريد غير صحيح' });
}

// التحقق من طول النص
if (text.length > 1000) {
    return res.status(400).json({ error: 'النص طويل جداً' });
}

// التحقق من نوع الملف
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: 'نوع الملف غير مسموح' });
}
```

#### ✅ منع SQL Injection
```javascript
// استخدم Prepared Statements
const result = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [userId]
);
```

#### ✅ منع XSS (Cross-Site Scripting)
```javascript
const xss = require('xss');
const cleanText = xss(userInput);

// أو في HTML
<div><%- userInput %></div> <!-- استخدم <%- %> بحذر -->
```

#### ❌ لا تفعل أبداً:
- لا تضع input المستخدم مباشرة في الـ SQL
- لا تثق بـ Content-Type من رأس الطلب
- لا تسمح برفع ملفات بصيغ خطرة (.exe, .bat, .sh)

---

### 4️⃣ حماية الـ Frontend

#### ✅ منع تخزين بيانات حساسة
```javascript
// لا تخزن كلمات المرور في localStorage
// استخدم httpOnly Cookies بدلاً منها
localStorage.removeItem('password'); // ❌ لا تفعل هذا
```

#### ✅ استخدم HTTPS فقط
```javascript
// أضف في رأس الاستجابة
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});
```

#### ✅ حماية ضد CSRF (Cross-Site Request Forgery)
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/video/create', csrfProtection, (req, res) => {
    // معالجة الطلب
});
```

#### ❌ لا تفعل أبداً:
- لا تعرض رموز الأخطاء الداخلية
- لا تخزن tokens في localStorage
- لا تترك console.log() مع بيانات حساسة

---

### 5️⃣ تأمين الملفات والمخزن

#### ✅ حماية رفع الملفات
```javascript
const multer = require('multer');
const upload = multer({
    dest: '/secure/uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('نوع الملف غير مسموح'));
        } else {
            cb(null, true);
        }
    }
});
```

#### ✅ تخزين آمن للملفات
```javascript
// قم بحفظ الملفات خارج الـ web root
// استخدم أسماء عشوائية للملفات
const filename = crypto.randomBytes(16).toString('hex') + '.jpg';
```

#### ✅ حماية البيانات في قاعدة البيانات
```javascript
// لا تخزن أسرار API في الكود
// استخدم environment variables
const API_KEY = process.env.GOOGLE_API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

#### ❌ لا تفعل أبداً:
- لا تخزن كلمات السر والمفاتيح في الكود
- لا تسمح برفع ملفات تنفيذية
- لا تحفظ الملفات في المجلد العام (public)

---

### 6️⃣ تأمين قاعدة البيانات

#### ✅ استخدم كلمات مرور قوية
```
كلمة سر قوية:
✓ 16+ حرف
✓ حروف كبيرة وصغيرة
✓ أرقام ورموز
✓ غير شبيهة بكلمات قاموس

مثال: K9$mP@x2nL#vQ8wR
```

#### ✅ قيود الوصول (Access Control)
```javascript
// أعط كل مستخدم صلاحيات محدودة
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON database.* TO 'app_user'@'localhost';
// لا تعط صلاحية DROP أو DELETE للـ app user
```

#### ✅ التشفير في قاعدة البيانات
```sql
-- قم بتفعيل Encryption
ALTER TABLE users MODIFY COLUMN password BINARY(60) NOT NULL;
```

#### ❌ لا تفعل أبداً:
- لا تستخدم كلمات سر ضعيفة (password123)
- لا تترك قاعدة البيانات متاحة على الإنترنت
- لا تستخدم حساب root للتطبيق

---

### 7️⃣ المراقبة والتسجيل (Logging)

#### ✅ سجل جميع العمليات المهمة
```javascript
const logger = require('winston');

// تسجيل محاولات الدخول الفاشلة
logger.warn(`Failed login attempt for user: ${email}`);

// تسجيل العمليات الحساسة
logger.info(`Video generated: ${videoId} by user: ${userId}`);
```

#### ✅ راقب الأنشطة المريبة
```javascript
// اكتشف محاولات الاختراق
if (loginAttempts > 5) {
    logger.error(`Possible brute force attack from IP: ${ip}`);
    // قفل الحساب مؤقتاً
}
```

#### ❌ لا تفعل أبداً:
- لا تخزن أسرار في السجلات
- لا تترك الوصول للسجلات للجميع
- لا تتجاهل الأنشطة المريبة

---

### 8️⃣ التحديثات والمراقبة المستمرة

#### ✅ حدّث المكتبات بانتظام
```bash
npm audit
npm audit fix
npm update
```

#### ✅ فحص الثغرات الأمنية
```bash
# استخدم OWASP Dependency-Check
dependency-check --project "ProVideoAI" --scan ./node_modules

# أو استخدم Snyk
snyk test
```

#### ✅ اختبر الأمان بانتظام
```bash
# فحص ثغرات SQL Injection
sqlmap -u "http://localhost:3000/api/videos" --data="id=1"

# اختبار XSS
npm install -g owasp-zap
```

---

## 🔐 قائمة التحقق الأمنية

قبل نشر التطبيق على الإنترنت:

### مستوى 1 (أساسي - إجباري):
- ✅ جميع كلمات المرور مشفرة بـ bcrypt أو argon2
- ✅ استخدام HTTPS فقط
- ✅ التحقق من جميع المدخلات
- ✅ استخدام JWT للمصادقة
- ✅ معرفات الجلسات آمنة (httpOnly, Secure)

### مستوى 2 (متقدم - موصى به):
- ✅ Rate Limiting فعّال
- ✅ CORS مُعد بشكل صحيح
- ✅ تسجيل وتتبع شامل
- ✅ اختبارات أمان دورية
- ✅ Backup مشفرة

### مستوى 3 (احترافي - اختياري):
- ✅ Web Application Firewall (WAF)
- ✅ مراقبة الأمان 24/7
- ✅ فريق استجابة للحوادث
- ✅ التدقيق الأمني الخارجي
- ✅ الامتثال لـ GDPR و CCPA

---

## 📋 ملفات الكود الآمنة المطلوبة

### 1. `.env` (لا تُرفع على GitHub)
```
# قاعدة البيانات
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=super_secure_password_123
DB_NAME=pro_video_ai

# المفاتيح السرية
JWT_SECRET=your_secret_key_here_very_long_random_string
ENCRYPTION_KEY=another_secret_key

# API المفاتيح
GOOGLE_API_KEY=xxxxxxxxxxxxxxxxxxxx
PIXAZO_API_KEY=xxxxxxxxxxxxxxxxxxxx

# البيئة
NODE_ENV=production
PORT=3000
HTTPS=true
```

### 2. `.gitignore` (تأكد من وجوده)
```
node_modules/
.env
.env.local
.env.*.local
*.log
uploads/
dist/
.DS_Store
*.swp
.vscode/
.idea/
config/secrets.js
private_keys/
```

### 3. `security.js` (ملف الأمان الرئيسي)
```javascript
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

module.exports = function(app) {
    // تأمين الرؤوس
    app.use(helmet());
    
    // حماية من NoSQL Injection
    app.use(mongoSanitize());
    
    // حماية من XSS
    app.use(xss());
    
    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    app.use(limiter);
    
    // منع CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        next();
    });
};
```

---

## ⚡ نصائح أمان إضافية

1. **استخدم VPN** عند التطوير
2. **قيّم الأذونات** بشكل منتظم
3. **قم بـ Backup** يومي للبيانات
4. **استخدم 2FA** لجميع الحسابات
5. **راجع السجلات** أسبوعياً
6. **دقق الكود** قبل كل نشر
7. **اختبر الأمان** قبل الإطلاق
8. **أبلغ عن الثغرات** فوراً

---

## 🚨 في حالة الاختراق

1. ✅ افصل الخادم فوراً
2. ✅ احفظ الأدلة (logs)
3. ✅ غيّر جميع كلمات المرور
4. ✅ افحص قاعدة البيانات
5. ✅ أعد البيانات من Backup
6. ✅ أبلغ المستخدمين
7. ✅ طلب مساعدة متخصص

---

**تاريخ الإنشاء:** سبتمبر 2024
**آخر تحديث:** سبتمبر 2024
**الحالة:** 🔒 آمن للاستخدام المحلي فقط