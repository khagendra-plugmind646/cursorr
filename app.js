const express = require("express");
const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const cookieParser=require('cookie-parser');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
dotenv.config();
connectDB();
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/user", userRouter);
app.use("/",indexRouter);



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
