# XAMPP Hospital Management System - সম্পূর্ণ সেটআপ গাইড

## ১. XAMPP ডাটাবেস সেটআপ

### Step 1: XAMPP শুরু করুন
1. XAMPP Control Panel খুলুন
2. Apache এবং MySQL চালু করুন (Start বাটন ক্লিক করুন)

### Step 2: phpMyAdmin এ ডাটাবেস তৈরি করুন
1. ব্রাউজার খুলুন এবং `http://localhost/phpmyadmin` যান
2. নতুন ডাটাবেস তৈরি করুন: **hp_db**
3. Charset: `utf8mb4_general_ci` নির্বাচন করুন
4. Create বাটন ক্লিক করুন

### Step 3: SQL ডাম্প ইম্পোর্ট করুন
1. phpMyAdmin এ **hp_db** ডাটাবেস খুলুন
2. **Import** ট্যাব ক্লিক করুন
3. `src/db_connect/hp_db.sql` ফাইল নির্বাচন করুন
4. Go বাটন ক্লিক করুন

### Step 4: ডাটাবেস ভেরিফাই করুন
- Tables দেখুন: `users`, `login`, `appointments`, `departments`
- সবকিছু সঠিকভাবে তৈরি হয়েছে কিনা নিশ্চিত করুন

---

## ২. প্রকল্প সেটআপ

### Dependencies ইনস্টল করুন:
```bash
npm install
```

### Backend চালান:
```bash
npm run backend
```
(এটি টার্মিনালে রাখুন, বন্ধ করবেন না)

### Frontend চালান (নতুন টার্মিনালে):
```bash
npm run dev
```

---

## ৩. পোর্ট তথ্য
- **Backend Server**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **PHPMyAdmin**: http://localhost/phpmyadmin

---

## ৪. পরীক্ষা করুন

### রেজিস্ট্রেশন:
1. http://localhost:5173/register যান
2. ফর্ম পূরণ করুন এবং সাবমিট করুন
3. phpMyAdmin এ দেখুন - ডাটা সেভ হয়েছে কিনা?

### লগইন:
1. http://localhost:5173/login যান
2. সঠিক ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন
3. সফল হলে Welcome মেসেজ পাবেন

---

## ৫. সাধারণ সমস্যার সমাধান

### MySQL সংযোগ ত্রুটি:
- XAMPP এ MySQL চলছে কিনা চেক করুন
- Terminal এ `npm run backend` চালান

### ডাটা সংরক্ষিত হচ্ছে না:
- phpMyAdmin এ tables আছে কিনা দেখুন
- DB credentials ঠিক আছে কিনা চেক করুন (db.ts)

### CORS ত্রুটি:
- backend server চলছে কিনা নিশ্চিত করুন
- Firewall বাধা দিচ্ছে না কিনা চেক করুন
