import express from "express"
import cors from "cors"
import fileRoutes from "./modules/File/file.rout.js";
import authRoutes from "./modules/Auth/auth.route.js";
import adminRoutes from "./modules/Admin/admin.auth.js"


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);



app.get("/", (req, res) => {
  res.send("File Share App Backend is running! 🚀");
});
export default app