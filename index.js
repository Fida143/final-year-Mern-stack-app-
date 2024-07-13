import express, { json } from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import AuthRoute from "./routes/auth.js";
import CategoryRoute from "./routes/category.js";
import ProductRoute from "./routes/product.js";
import cors from "cors";
 import path from "path";

// cofig env
const app = express();

dotenv.config();

// dbconfig
connectDB();

// rest object

// middle ware

app.use(cors());
app.use(json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend/build")));

// routers
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/category", CategoryRoute);
app.use("/api/v1/product", ProductRoute);

// rest api
app.get("/", (req, res) => {
  res.send("welcome to ecommerce website");
});

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${PORT}`.bgCyan.white.bold);
});
