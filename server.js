const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.set('trust proxy', true);
// middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://mdaman9939:A123456@cluster0.5kgahgx.mongodb.net/location?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/", async (req, res) => {
  res.send("Hello, World!");
});
app.use("/api", userRoutes);
app.use("/api", locationRoutes);
// Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

