# Hospital Management System - Complete Testing & Status Check
# এটি Windows PowerShell এ চালান

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🏥 Hospital Management System - সম্পূর্ণ সিস্টেম চেক" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Node.js ভার্সন চেক করুন
Write-Host "१. Node.js ভার্সন চেক করছি..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js ইনস্টল করা নেই" -ForegroundColor Red
}

# npm ভার্সন চেক করুন
Write-Host ""
Write-Host "०२. npm ভার্সন চেক করছি..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm ইনস্টল করা নেই" -ForegroundColor Red
}

# ফাইল স্ট্রাকচার চেক করুন
Write-Host ""
Write-Host "०३. প্রজেক্ট ফাইল স্ট্রাকচার চেক করছি..." -ForegroundColor Yellow
$files = @(
    "src/server.ts",
    "src/db_connect/db.ts",
    "src/db_connect/hp_db.sql",
    "src/routes/auth.ts",
    "src/pages/LoginPage.tsx",
    "src/pages/RegisterPage.tsx",
    "package.json",
    "tsconfig.json",
    "vite.config.ts"
)

$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - পাওয়া যায়নি" -ForegroundColor Red
        $allExist = $false
    }
}

# ডকুমেন্টেশন ফাইল চেক করুন
Write-Host ""
Write-Host "०४. ডকুমেন্টেশন ফাইল চেক করছি..." -ForegroundColor Yellow
$docs = @(
    "README.md",
    "XAMPP_SETUP.md",
    "TESTING_GUIDE.md",
    "SUMMARY.md",
    "CHECKLIST.md",
    "ARCHITECTURE.md",
    "COMPLETE_PACKAGE.md",
    "FINAL_SUMMARY.md",
    "INDEX.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $doc" -ForegroundColor Red
    }
}

# ডিপেন্ডেন্সি চেক করুন
Write-Host ""
Write-Host "०५. মূল ডিপেন্ডেন্সি চেক করছি..." -ForegroundColor Yellow

$dependencies = @("express", "cors", "mysql2", "bcrypt", "react", "react-router-dom")

foreach ($dep in $dependencies) {
    if (Test-Path "node_modules/$dep") {
        Write-Host "  ✅ $dep" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $dep - ইনস্টল করা নেই" -ForegroundColor Red
    }
}

# সার্ভার পোর্ট চেক করুন
Write-Host ""
Write-Host "០६. পোর্ট স্ট্যাটাস চেক করছি..." -ForegroundColor Yellow

$ports = @(
    @{Port = 5000; Name = "Backend"},
    @{Port = 5173; Name = "Frontend (Primary)"},
    @{Port = 5174; Name = "Frontend (Alternate)"},
    @{Port = 3306; Name = "MySQL"},
    @{Port = 80; Name = "Apache/phpMyAdmin"}
)

foreach ($port in $ports) {
    $tcpProcess = Get-NetTCPConnection -LocalPort $port.Port -ErrorAction SilentlyContinue
    if ($tcpProcess) {
        Write-Host "  ✅ Port $($port.Port) ($($port.Name)): استخدام মধ্যে" -ForegroundColor Green
    } else {
        Write-Host "  ⚪ Port $($port.Port) ($($port.Name)): উপলব্ধ" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ সিস্টেম চেক সম্পূর্ণ!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host ""
Write-Host "📚 পরবর্তী ধাপ:" -ForegroundColor Yellow
Write-Host ""
Write-Host "१. Backend চালু করুন (Terminal 1):" -ForegroundColor White
Write-Host "   npm run backend" -ForegroundColor Cyan
Write-Host ""
Write-Host "२. Frontend চালু করুন (Terminal 2):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "३. ব্রাউজার খুলুন:" -ForegroundColor White
Write-Host "   🌐 http://localhost:5174/register" -ForegroundColor Cyan
Write-Host ""
Write-Host "४. phpMyAdmin দেখুন:" -ForegroundColor White
Write-Host "   🌐 http://localhost/phpmyadmin" -ForegroundColor Cyan
Write-Host ""
