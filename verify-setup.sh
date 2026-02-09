#!/bin/bash

echo "=================================="
echo "Hospital System - সেটআপ যাচাইকরণ"
echo "=================================="
echo ""

# ১. Node.js চেক করুন
echo "1️⃣ Node.js চেক করছি..."
if command -v node &> /dev/null; then
    echo "✅ Node.js ইনস্টল করা আছে: $(node --version)"
else
    echo "❌ Node.js ইনস্টল করা নেই"
fi

# २. npm চেক করুন
echo ""
echo "२️⃣ npm চেক করছি..."
if command -v npm &> /dev/null; then
    echo "✅ npm ইনস্টল করা আছে: $(npm --version)"
else
    echo "❌ npm ইনস্টল করা নেই"
fi

# ३. ডিপেন্ডেন্সি চেক করুন
echo ""
echo "३️⃣ ডিপেন্ডেন্সি চেক করছি..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules ফোল্ডার পাওয়া গেছে"
    if [ -d "node_modules/bcrypt" ]; then
        echo "✅ bcrypt ইনস্টল করা আছে"
    else
        echo "❌ bcrypt ইনস্টল করা নেই - npm install চালান"
    fi
else
    echo "❌ node_modules ফোল্ডার নেই - npm install চালান"
fi

# ४. ফাইল কাঠামো চেক করুন
echo ""
echo "४️⃣ ফাইল কাঠামো চেক করছি..."
files=("src/db_connect/db.ts" "src/server.ts" "src/routes/auth.ts" "src/pages/LoginPage.tsx" "src/pages/RegisterPage.tsx")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file পাওয়া গেছে"
    else
        echo "❌ $file পাওয়া যায়নি"
    fi
done

# ५. ডকুমেন্টেশন চেক করুন
echo ""
echo "५️⃣ ডকুমেন্টেশন চেক করছি..."
docs=("XAMPP_SETUP.md" "TESTING_GUIDE.md" "SUMMARY.md" ".env.example")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc পাওয়া গেছে"
    else
        echo "❌ $doc পাওয়া যায়নি"
    fi
done

echo ""
echo "=================================="
echo "যাচাইকরণ সম্পূর্ণ!"
echo "=================================="
echo ""
echo "পরবর্তী ধাপ:"
echo "१. XAMPP খুলুন এবং MySQL চালু করুন"
echo "२. npm run backend চালান (Terminal 1)"
echo "३. npm run dev চালান (Terminal 2)"
echo "४. http://localhost:5173 খুলুন"
