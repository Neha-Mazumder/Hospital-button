import { Router } from "express";
import db from "../db_connect/db";

const router = Router();

// Helper function to promisify callback-based db.query
const query = (sql: string, params?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results as any[]);
    });
  });
};

// Patient Login (using login table)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username এবং Password দিতে হবে",
      });
    }

    const users = await query(
      `SELECT l.login_id, l.user_id, l.username, u.full_name, u.phone, u.address 
       FROM login l 
       JOIN users u ON l.user_id = u.user_id 
       WHERE l.username = ? AND l.password = ?`,
      [username, password]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Username বা Password ভুল হয়েছে",
      });
    }

    res.json({
      success: true,
      message: "লগইন সফল",
      userId: users[0].user_id,
      user: users[0],
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "সার্ভার এরর হয়েছে",
    });
  }
});

// Get Patient Dashboard (all data)
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user profile
    const profile = await query(
      `SELECT u.user_id, u.full_name, u.phone, u.address, l.username
       FROM users u
       JOIN login l ON u.user_id = l.user_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (profile.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User পাওয়া যায়নি",
      });
    }

    // Get appointments
    const appointments = await query(
      `SELECT a.appointment_id, d.department_name, a.appointment_date, 
              a.additional_message, a.status
       FROM appointments a
       JOIN departments d ON a.department_id = d.department_id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC`,
      [userId]
    );

    // Get room bookings
    const roomBookings = await query(
      `SELECT rb.booking_id, r.room_name, r.room_type, rb.admission_date,
              rb.duration_days, rb.total_price, rb.status, rb.booking_date
       FROM room_bookings rb
       JOIN rooms r ON rb.room_id = r.room_id
       WHERE rb.user_id = ?
       ORDER BY rb.booking_date DESC`,
      [userId]
    );

    // Get pharmacy orders with items
    const orders = await query(
      `SELECT po.order_id, po.order_date, po.total_amount, po.status, po.delivery_address
       FROM pharmacy_orders po
       WHERE po.user_id = ?
       ORDER BY po.order_date DESC`,
      [userId]
    );

    // Get order items for each order
    const pharmacyOrders = await Promise.all(
      orders.map(async (order: any) => {
        const items = await query(
          `SELECT m.name as medicine_name, poi.quantity, poi.price
           FROM pharmacy_order_items poi
           JOIN medicines m ON poi.medicine_id = m.medicine_id
           WHERE poi.order_id = ?`,
          [order.order_id]
        );
        return { ...order, items };
      })
    );

    res.json({
      success: true,
      data: {
        profile: profile[0],
        appointments,
        roomBookings,
        pharmacyOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "ডাটা লোড করতে সমস্যা হয়েছে",
    });
  }
});

// Get Appointments only
router.get("/appointments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await query(
      `SELECT a.appointment_id, d.department_name, a.appointment_date, 
              a.additional_message, a.status
       FROM appointments a
       JOIN departments d ON a.department_id = d.department_id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC`,
      [userId]
    );

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Appointments error:", error);
    res.status(500).json({ success: false, message: "ডাটা লোড করতে সমস্যা হয়েছে" });
  }
});

// Get Room Bookings only
router.get("/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const roomBookings = await query(
      `SELECT rb.booking_id, r.room_name, r.room_type, rb.admission_date,
              rb.duration_days, rb.total_price, rb.status, rb.booking_date
       FROM room_bookings rb
       JOIN rooms r ON rb.room_id = r.room_id
       WHERE rb.user_id = ?
       ORDER BY rb.booking_date DESC`,
      [userId]
    );

    res.json({ success: true, data: roomBookings });
  } catch (error) {
    console.error("Bookings error:", error);
    res.status(500).json({ success: false, message: "ডাটা লোড করতে সমস্যা হয়েছে" });
  }
});

// Get Pharmacy Orders only
router.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await query(
      `SELECT po.order_id, po.order_date, po.total_amount, po.status, po.delivery_address
       FROM pharmacy_orders po
       WHERE po.user_id = ?
       ORDER BY po.order_date DESC`,
      [userId]
    );

    const pharmacyOrders = await Promise.all(
      orders.map(async (order: any) => {
        const items = await query(
          `SELECT m.name as medicine_name, poi.quantity, poi.price
           FROM pharmacy_order_items poi
           JOIN medicines m ON poi.medicine_id = m.medicine_id
           WHERE poi.order_id = ?`,
          [order.order_id]
        );
        return { ...order, items };
      })
    );

    res.json({ success: true, data: pharmacyOrders });
  } catch (error) {
    console.error("Orders error:", error);
    res.status(500).json({ success: false, message: "ডাটা লোড করতে সমস্যা হয়েছে" });
  }
});

export default router;
