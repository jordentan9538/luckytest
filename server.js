import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== 内存数据库（重启会清空） =====
let scores = [];

// ===== 健康检查（Render 必须要有） =====
app.get("/health", (req, res) => {
  res.send("OK");
});

// ===== 🎡 抽奖接口 =====
app.get("/api/spin", (req, res) => {
  const prizes = ["🍎 Apple", "🍌 Banana", "🍇 Grape", "🍒 Cherry", "💎 Diamond"];
  const result = prizes[Math.floor(Math.random() * prizes.length)];
  res.json({ prize: result, timestamp: Date.now() });
});

// ===== 🏆 提交分数 =====
app.post("/api/score", (req, res) => {
  const { user, score } = req.body;
  if (!user || typeof score !== "number") {
    return res.status(400).json({ error: "Missing user or score" });
  }
  scores.push({ user, score, time: Date.now() });
  res.json({ message: "Score saved!", scores });
});

// ===== 📊 排行榜 =====
app.get("/api/scores", (req, res) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  res.json(sorted);
});

// ===== 启动服务 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body, at: new Date().toISOString() });
});
