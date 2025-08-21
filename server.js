import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====== 内存存储分数（服务重启会清空） ======
let scores = [];

// ====== 健康检查（Render 用来检测服务是否存活） ======
app.get("/health", (req, res) => {
  res.send("OK");
});

// ====== 🎡 抽奖接口 ======
app.get("/api/spin", (req, res) => {
  const prizes = [
    "🍎 Apple",
    "🍌 Banana",
    "🍇 Grape",
    "🍒 Cherry",
    "💎 Diamond",
    "🎁 Gift"
  ];
  const prize = prizes[Math.floor(Math.random() * prizes.length)];
  res.json({ prize, ts: Date.now() });
});

// ====== 🏆 提交分数 ======
app.post("/api/score", (req, res) => {
  const { user, score } = req.body;

  if (!user || typeof score !== "number") {
    return res.status(400).json({ error: "Missing user or score" });
  }

  scores.push({ user, score, time: Date.now() });
  res.json({ message: "Score saved!", scores });
});

// ====== 📊 排行榜 ======
app.get("/api/scores", (req, res) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  res.json(sorted);
});

// ====== 启动服务器 ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Lucky Wheel backend running on http://localhost:${PORT}`);
});
