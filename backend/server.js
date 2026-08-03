import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';
import connectCloudinary from "./lib/cloudinary.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

app.use(cors({
      origin:[ 
        'http://localhost:5173',
        'https://aebookify.vercel.app'
    ], // your frontend URL

    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!'); 
})

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);



//port 
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    connectCloudinary();
    await connectDB(); // make sure DB is connected first
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};
startServer();
