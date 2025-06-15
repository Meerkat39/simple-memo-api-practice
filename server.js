const express = require("express");
const mongoose = require("mongoose");
const Memo = require("./models/memo");

// mongooseの設定
mongoose
  .connect("mongodb://127.0.0.1:27017/memo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error");
    console.log(err);
  });

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// メモの新規作成
// POST /api/memos
app.post("/api/memos", async (req, res) => {
  const { title, content } = req.body;
  const newMemo = new Memo({ title, content });
  const createdMemo = await newMemo.save();
  console.log(createdMemo._id);
  res.json(newMemo);
});

// メモの一覧取得
// GET  /api/memos
app.get("/api/memos/:id", async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id);
  res.json(memo);
});

// メモの更新
app.put("/api/memos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  console.log(title, content);
  await Memo.findByIdAndUpdate(id, { title, content });
});

// メモの削除
app.delete("/api/memos/:id", async (req, res) => {
  const { id } = req.params;
  await Memo.findByIdAndDelete(id);
  res.status(204).send(); // 成功：204 No Content
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
