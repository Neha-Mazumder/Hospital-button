import express, { Router, Request, Response } from "express";
import db from "../db_connect/db.ts";

const router = Router();

// Get all medicines
router.get("/medicines", async (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM medicines", (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to fetch medicines" });
        return;
      }

      if (!results || (results as any[]).length === 0) {
        console.log("No medicines found in database");
        res.json([]);
        return;
      }

      console.log("Fetched medicines:", (results as any[]).length);
      res.json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get medicines by category
router.get("/medicines/category/:category", async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    
    if (category === 'all') {
      db.query("SELECT * FROM medicines", (err, results) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch medicines" });
          return;
        }
        res.json(results);
      });
    } else {
      db.query("SELECT * FROM medicines WHERE category = ?", [category], (err, results) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch medicines" });
          return;
        }
        res.json(results);
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search medicines
router.get("/medicines/search/:query", async (req: Request, res: Response) => {
  try {
    const query = `%${req.params.query}%`;
    
    db.query(
      "SELECT * FROM medicines WHERE name LIKE ? OR generic_name LIKE ?",
      [query, query],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Failed to search medicines" });
          return;
        }
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Place order
router.post("/orders", async (req: Request, res: Response) => {
  try {
    const { userId, items, totalAmount, deliveryAddress } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Start transaction
    db.beginTransaction((err) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
        return;
      }

      // Insert order
      db.query(
        "INSERT INTO pharmacy_orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, 'Pending')",
        [userId, totalAmount, deliveryAddress],
        (err, result) => {
          if (err) {
            db.rollback();
            res.status(500).json({ error: "Failed to create order" });
            return;
          }

          const orderId = (result as any).insertId;

          // Insert order items
          let insertedCount = 0;
          items.forEach((item: any) => {
            db.query(
              "INSERT INTO pharmacy_order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)",
              [orderId, item.medicine_id, item.quantity, item.price],
              (err) => {
                if (err) {
                  db.rollback();
                  res.status(500).json({ error: "Failed to add order items" });
                  return;
                }

                insertedCount++;
                if (insertedCount === items.length) {
                  // Commit transaction
                  db.commit((err) => {
                    if (err) {
                      db.rollback();
                      res.status(500).json({ error: "Database error" });
                      return;
                    }

                    res.json({
                      success: true,
                      orderId: orderId,
                      message: "Order placed successfully",
                      totalAmount: totalAmount
                    });
                  });
                }
              }
            );
          });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user orders
router.get("/orders/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    db.query(
      `SELECT po.*, 
              GROUP_CONCAT(CONCAT(m.name, ' x', poi.quantity) SEPARATOR ', ') as items
       FROM pharmacy_orders po
       LEFT JOIN pharmacy_order_items poi ON po.order_id = poi.order_id
       LEFT JOIN medicines m ON poi.medicine_id = m.medicine_id
       WHERE po.user_id = ?
       GROUP BY po.order_id
       ORDER BY po.order_date DESC`,
      [userId],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch orders" });
          return;
        }
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get order details
router.get("/orders/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;

    db.query(
      `SELECT po.*, u.full_name, u.phone, u.address
       FROM pharmacy_orders po
       JOIN users u ON po.user_id = u.user_id
       WHERE po.order_id = ?`,
      [orderId],
      (err, results) => {
        if (err || !results || (results as any[]).length === 0) {
          res.status(404).json({ error: "Order not found" });
          return;
        }

        const order = (results as any[])[0];

        // Get order items
        db.query(
          `SELECT poi.*, m.name, m.generic_name, m.manufacturer
           FROM pharmacy_order_items poi
           JOIN medicines m ON poi.medicine_id = m.medicine_id
           WHERE poi.order_id = ?`,
          [orderId],
          (err, itemResults) => {
            if (err) {
              res.status(500).json({ error: "Failed to fetch order items" });
              return;
            }

            res.json({
              ...order,
              items: itemResults
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel order
router.put("/orders/:orderId/cancel", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;

    db.query(
      "UPDATE pharmacy_orders SET status = 'Cancelled' WHERE order_id = ?",
      [orderId],
      (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to cancel order" });
          return;
        }

        res.json({
          success: true,
          message: "Order cancelled successfully"
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
