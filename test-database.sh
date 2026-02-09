#!/bin/bash
# Hospital Management System - Complete Testing Script

echo "════════════════════════════════════════════════════════"
echo "🏥 Hospital Management System - সম্পূর্ণ চেক করছি"
echo "════════════════════════════════════════════════════════"
echo ""

# ১. Database টেবিলস চেক করুন
echo "१. Database টেবিলস চেক করছি..."
mysql -u root hp_db -e "SHOW TABLES;" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Database সংযোগ সফল"
else
  echo "❌ Database সংযোগ ব্যর্থ"
  echo "সমাধান: XAMPP MySQL Start করুন"
  exit 1
fi

echo ""
echo "२. users টেবিল কলাম চেক করছি..."
mysql -u root hp_db -e "DESC users;" 2>/dev/null

echo ""
echo "३. login টেবিল কলাম চেক করছি..."
mysql -u root hp_db -e "DESC login;" 2>/dev/null

echo ""
echo "४. ডাটা রেকর্ড চেক করছি..."
mysql -u root hp_db -e "SELECT * FROM users;" 2>/dev/null

echo ""
echo "५. হ্যাশড পাসওয়ার্ড চেক করছি..."
mysql -u root hp_db -e "SELECT login_id, user_id, username, SUBSTR(password, 1, 20) as password_hash FROM login;" 2>/dev/null

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ সব চেক সম্পূর্ণ!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Backend চালু করতে:"
echo "npm run backend"
echo ""
echo "Frontend চালু করতে:"
echo "npm run dev"
echo ""
