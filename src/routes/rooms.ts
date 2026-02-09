import express, { Router, Request, Response } from "express";
import db from "../db_connect/db.ts";

const router = Router();

// Get all rooms
router.get("/all", async (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM rooms", (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to fetch rooms", details: err.message });
        return;
      }
      
      if (!results || (results as any[]).length === 0) {
        console.log("No rooms found in database");
        res.json([]);
        return;
      }
      
      // Format amenities from string to array
      const formattedRooms = (results as any[]).map(room => ({
        ...room,
        amenities: room.amenities ? room.amenities.split(',') : [],
        isAvailable: room.is_available === 1
      }));
      
      console.log("Fetched rooms:", formattedRooms.length);
      res.json(formattedRooms);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Get single room
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    db.query("SELECT * FROM rooms WHERE room_id = ?", [roomId], (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch room" });
        return;
      }
      
      if (!results || (results as any[]).length === 0) {
        res.status(404).json({ error: "Room not found" });
        return;
      }
      
      const room = (results as any[])[0];
      res.json({
        ...room,
        amenities: room.amenities ? room.amenities.split(',') : [],
        isAvailable: room.is_available === 1
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Book a room
router.post("/book", async (req: Request, res: Response) => {
  try {
    const { userId, roomId, admissionDate, durationDays } = req.body;

    // Validate required fields
    if (!userId || !roomId || !admissionDate || !durationDays) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Generate random 6-digit booking ID
    const randomBookingId = Math.floor(100000 + Math.random() * 900000);

    // Get room price
    db.query("SELECT price_per_day FROM rooms WHERE room_id = ?", [roomId], (err, results) => {
      if (err || !results || (results as any[]).length === 0) {
        res.status(500).json({ error: "Room not found" });
        return;
      }

      const pricePerDay = (results as any[])[0].price_per_day;
      const totalPrice = pricePerDay * durationDays;

      // Insert booking with random booking_id
      db.query(
        "INSERT INTO room_bookings (booking_id, user_id, room_id, admission_date, duration_days, total_price, status) VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')",
        [randomBookingId, userId, roomId, admissionDate, durationDays, totalPrice],
        (err, result) => {
          if (err) {
            console.error("Booking error:", err);
            res.status(500).json({ error: "Failed to create booking" });
            return;
          }

          res.json({
            success: true,
            bookingId: randomBookingId,
            message: "Booking confirmed successfully",
            totalPrice: totalPrice
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get user bookings
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    db.query(
      `SELECT rb.*, r.room_name, r.room_type, r.price_per_day
       FROM room_bookings rb
       JOIN rooms r ON rb.room_id = r.room_id
       WHERE rb.user_id = ?
       ORDER BY rb.booking_date DESC`,
      [userId],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch bookings" });
          return;
        }
        res.json(results);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel booking
router.put("/:bookingId/cancel", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    
    db.query(
      "UPDATE room_bookings SET status = 'Cancelled' WHERE booking_id = ?",
      [bookingId],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: "Failed to cancel booking" });
          return;
        }
        
        res.json({
          success: true,
          message: "Booking cancelled successfully"
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Download receipt
router.get("/:bookingId/receipt", async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    
    db.query(
      `SELECT rb.*, r.room_name, r.room_type, r.price_per_day, u.full_name, u.phone, u.address
       FROM room_bookings rb
       JOIN rooms r ON rb.room_id = r.room_id
       JOIN users u ON rb.user_id = u.user_id
       WHERE rb.booking_id = ?`,
      [bookingId],
      (err, results) => {
        if (err || !results || (results as any[]).length === 0) {
          res.status(404).json({ error: "Booking not found" });
          return;
        }

        const booking = (results as any[])[0];

        // Generate HTML receipt
        const receiptHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Booking Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .header { text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
              .header h1 { color: #007bff; margin: 0; font-size: 28px; }
              .header p { color: #666; margin: 5px 0; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .label { color: #666; font-weight: bold; }
              .value { color: #333; }
              .total-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #007bff; border-bottom: 2px solid #007bff; font-weight: bold; font-size: 16px; color: #007bff; margin: 15px 0; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
              .booking-id { background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏥 Hospital Room Booking Receipt</h1>
                <p>Booking Confirmation</p>
              </div>

              <div class="booking-id">
                Booking ID: ${booking.booking_id}
              </div>

              <div class="section">
                <div class="section-title">Patient Information</div>
                <div class="row">
                  <span class="label">Full Name:</span>
                  <span class="value">${booking.full_name}</span>
                </div>
                <div class="row">
                  <span class="label">Phone:</span>
                  <span class="value">${booking.phone}</span>
                </div>
                <div class="row">
                  <span class="label">Address:</span>
                  <span class="value">${booking.address || 'N/A'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Room Details</div>
                <div class="row">
                  <span class="label">Room Name:</span>
                  <span class="value">${booking.room_name}</span>
                </div>
                <div class="row">
                  <span class="label">Room Type:</span>
                  <span class="value">${booking.room_type}</span>
                </div>
                <div class="row">
                  <span class="label">Price per Day:</span>
                  <span class="value">৳ ${booking.price_per_day}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Booking Information</div>
                <div class="row">
                  <span class="label">Admission Date:</span>
                  <span class="value">${booking.admission_date}</span>
                </div>
                <div class="row">
                  <span class="label">Duration:</span>
                  <span class="value">${booking.duration_days} days</span>
                </div>
                <div class="row">
                  <span class="label">Status:</span>
                  <span class="value" style="color: ${booking.status === 'Confirmed' ? '#28a745' : '#dc3545'}; font-weight: bold;">${booking.status}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Price Breakdown</div>
                <div class="row">
                  <span class="label">Daily Rate:</span>
                  <span class="value">৳ ${booking.price_per_day}</span>
                </div>
                <div class="row">
                  <span class="label">Number of Days:</span>
                  <span class="value">${booking.duration_days}</span>
                </div>
                <div class="total-row">
                  <span>Total Price:</span>
                  <span>৳ ${booking.total_price}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Additional Information</div>
                <div class="row">
                  <span class="label">Booking Date:</span>
                  <span class="value">${new Date(booking.booking_date).toLocaleDateString('en-US')}</span>
                </div>
              </div>

              <div class="footer">
                <p>Thank you for using our hospital services</p>
                <p style="margin-top: 15px; font-size: 10px;">This receipt is proof of your booking</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send HTML as downloadable file
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="Receipt_${booking.booking_id}.html"`);
        res.send(receiptHTML);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
