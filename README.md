Here is the **English translation** of your document:

---

# 🏥 Hospital Management System

A complete online hospital management system with user registration, login, and appointment booking facilities.

**Status:** ✅ Fully functional and ready

---

## 🎯 Key Features

* ✅ **User Management** – Registration and Login
* ✅ **Appointment Booking** – Select date and department
* ✅ **Appointment Management** – View and cancel
* ✅ **Responsive Design** – Works on all devices
* ✅ **Bangla Interface** – Fully in Bengali
* ✅ **Fast Performance** – Instant response

---

## 🚀 Quick Start

### Step 1: Start XAMPP

```bash
1. Open XAMPP Control Panel
2. Start Apache (should turn green)
3. Start MySQL (should turn green)
```

### Step 2: Set Up Database

```bash
1. Open http://localhost/phpmyadmin
2. Create a new database: hp_db
3. Run SQL from src/db_connect/hp_db.sql
```

### Step 3: Start Server

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend
npm run dev

# Open browser
# http://localhost:5173
npm install

# 3. Run verification
.\verify-setup.ps1

# 04. Open XAMPP and start MySQL (Important!)
# Windows: C:\xampp\xampp-control.exe
```

### Database Setup (First Time)

```
1. Open http://localhost/phpmyadmin
2. Create new Database: hp_db
3. Import: src/db_connect/hp_db.sql
```

### Run Servers

**Terminal 1 – Backend:**

```bash
npm run backend
```

✅ You should see:

```
MySQL Connected Successfully ✅
Backend Server running on http://localhost:5000
```

**Terminal 2 – Frontend:**

```bash
npm run dev
```

✅ You should see:

```
VITE v6.0.5 ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 📱 Using the System

### Registration

1. Open [http://localhost:5173/register](http://localhost:5173/register)
2. Fill in:

   * Full Name
   * Phone Number
   * Address (Optional)
   * Username
   * Password (At least 6 characters)
3. Click Register
4. After success, you will be redirected to the login page

### Login

1. Open [http://localhost:5173/login](http://localhost:5173/login)
2. Enter username and password
3. Click Login
4. You will see a welcome message and be redirected to home

---

## 📊 Verify Data

### In phpMyAdmin

```
http://localhost/phpmyadmin
Database: hp_db
```

**users table:**

```
| user_id | full_name | phone       | address   |
|---------|-----------|-------------|-----------|
| 1       | Samir     | 01712345678 | Dhaka, BD |
```

**login table:**

```
| login_id | user_id | username | password               |
|----------|---------|----------|------------------------|
| 1        | 1       | samir    | $2b$10$xxxx... (hashed)|
```

---

## 📁 File Structure

```
Hospital_Button/
├── src/
│   ├── db_connect/
│   │   ├── db.ts          ← MySQL connection
│   │   └── hp_db.sql      ← Database script
│   ├── routes/
│   │   └── auth.ts        ← Login/Register API
│   ├── pages/
│   │   ├── LoginPage.tsx      ← Login form
│   │   └── RegisterPage.tsx   ← Registration form
│   ├── server.ts          ← Express server
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json           ← Dependencies
├── vite.config.ts
├── tsconfig.json
├── XAMPP_SETUP.md        ← XAMPP setup guide
├── TESTING_GUIDE.md      ← Detailed testing guide
├── SUMMARY.md            ← Change summary
├── verify-setup.ps1      ← Verification script
└── README.md             ← This file
```

---

## 🔐 Security

✅ **Bcrypt Password Hashing**

* Passwords are not stored directly
* Uses sha256/bcrypt

✅ **SQL Injection Prevention**

* Uses parameterized queries

✅ **CORS Enabled**

* Secure frontend-backend communication

---

## 🛠️ Command Reference

```bash
# Start backend
npm run backend

# Start frontend
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run verification
.\verify-setup.ps1
```

---

## 🔧 Common Problems

| Problem                          | Cause                   | Solution              |
| -------------------------------- | ----------------------- | --------------------- |
| `Cannot POST /api/auth/register` | Backend not running     | Run `npm run backend` |
| `MySQL Connection Failed`        | MySQL is stopped        | Start MySQL in XAMPP  |
| `Data not saving`                | Missing database/tables | Import hp_db.sql      |
| `CORS Error`                     | Port/server issue       | Restart both servers  |

📖 See details: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 📱 Port Table

| Service    | URL                                                        | Port |
| ---------- | ---------------------------------------------------------- | ---- |
| Frontend   | [http://localhost:5173](http://localhost:5173)             | 5173 |
| Backend    | [http://localhost:5000](http://localhost:5000)             | 5000 |
| phpMyAdmin | [http://localhost/phpmyadmin](http://localhost/phpmyadmin) | 80   |
| MySQL      | localhost                                                  | 3306 |

---

## 📚 Documentation

| File             | Description                |
| ---------------- | -------------------------- |
| XAMPP_SETUP.md   | Complete XAMPP setup guide |
| TESTING_GUIDE.md | Testing & troubleshooting  |
| SUMMARY.md       | List of changes            |

---

## 🎯 Upcoming Features

* [ ] JWT-based sessions
* [ ] Password recovery
* [ ] Email verification
* [ ] Profile page
* [ ] Appointment booking
* [ ] Admin panel

---

## 📞 Need Help?

1. Read **TESTING_GUIDE.md**
2. Check **XAMPP_SETUP.md**
3. Run `.\verify-setup.ps1` to verify everything

---

## 📄 License

This project is for educational purposes.

---

## 🎉 Signs of Successful Setup

✅ `npm run backend` shows: `MySQL Connected Successfully ✅`
✅ `npm run dev` shows: `VITE ready in XXX ms`
✅ [http://localhost:5173/register](http://localhost:5173/register) opens
✅ Registration works and data appears in phpMyAdmin
✅ Login works and welcome message appears

**Everything is ready! Enjoy!** 🚀

---

If you want, I can now help you format this as a professional README for GitHub.
