Write-Host "=================================="
Write-Host "Hospital System - সেটআপ যাচাইকরণ" -ForegroundColor Cyan
Write-Host "=================================="
Write-Host ""

# १. Node.js চেক করুন
Write-Host "१️⃣ Node.js চেক করছি..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js ইনস্টল করা আছে: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js ইনস্টল করা নেই" -ForegroundColor Red
}

# २. npm চেক করুন
Write-Host ""
Write-Host "०२️⃣ npm চেক করছি..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm ইনস্টল করা আছে: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm ইনস্টল করা নেই" -ForegroundColor Red
}

# ३. ডিপেন্ডেন্সি চেক করুন
Write-Host ""
Write-Host "०३️⃣ ডিপেন্ডেন্সি চেক করছি..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules ফোল্ডার পাওয়া গেছে" -ForegroundColor Green
    if (Test-Path "node_modules/bcrypt") {
        Write-Host "✅ bcrypt ইনস্টল করা আছে" -ForegroundColor Green
    } else {
        Write-Host "❌ bcrypt ইনস্টল করা নেই - npm install চালান" -ForegroundColor Red
    }
} else {
    Write-Host "❌ node_modules ফোল্ডার নেই - npm install চালান" -ForegroundColor Red
}

# ४. ফাইল কাঠামো চেক করুন
Write-Host ""
Write-Host "०४️⃣ ফাইল কাঠামো চেক করছি..." -ForegroundColor Yellow
$files = @(
    "src\db_connect\db.ts",
    "src\server.ts",
    "src\routes\auth.ts",
    "src\pages\LoginPage.tsx",
    "src\pages\RegisterPage.tsx"
)
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file পাওয়া গেছে" -ForegroundColor Green
    } else {
        Write-Host "❌ $file পাওয়া যায়নি" -ForegroundColor Red
    }
}

# ५. ডকুমেন্টেশন চেক করুন
Write-Host ""
Write-Host "०५️⃣ ডকুমেন্টেশন চেক করছি..." -ForegroundColor Yellow
$docs = @(
    "XAMPP_SETUP.md",
    "TESTING_GUIDE.md",
    "SUMMARY.md",
    ".env.example"
)
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "✅ $doc পাওয়া গেছে" -ForegroundColor Green
    } else {
        Write-Host "❌ $doc পাওয়া যায়নি" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "যাচাইকরণ সম্পূর্ণ!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "পরবর্তী ধাপ:" -ForegroundColor Yellow
Write-Host "१. XAMPP খুলুন এবং MySQL চালু করুন"
Write-Host "०२. npm run backend চালান (Terminal 1)"
Write-Host "०३. npm run dev চালান (Terminal 2)"
Write-Host "०४. http://localhost:5173 খুলুন"
