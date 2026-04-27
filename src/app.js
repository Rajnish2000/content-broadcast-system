const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
  res.send("Content Broadcasting System API Running");
});

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/content", contentRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
