import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.ts";
import appointmentRoutes from "./routes/appointments.ts";
import roomRoutes from "./routes/rooms.ts";
import pharmacyRoutes from "./routes/pharmacy.ts";
import patientcareRoutes from "./routes/patientcare.ts";

import testreportsRoutes from "./routes/testreports.ts";
import patientcenteredRoutes from "./routes/patientcentered.ts";
import chatbotRoutes from "./routes/chatbot.ts";



import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());


// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve public folder for PDF and static files
app.use("/public", express.static(path.resolve(__dirname, "../../public")));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/patientcare", patientcareRoutes);
app.use("/api/patientcentered", patientcenteredRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use("/api/testreports", testreportsRoutes);

app.listen(5000, () => {
  console.log("Backend Server running on http://localhost:5000");
});
