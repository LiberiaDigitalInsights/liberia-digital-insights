import express from "express";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint works" });
});

app.post("/test-upload", (req, res) => {
  console.log("Request body:", req.body);
  res.json({ received: req.body });
});

app.listen(5001, () => {
  console.log("Test server running on port 5001");
});
