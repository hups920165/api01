import express from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECERT_KEY;

let whitelist = ["http://localhost:5500", "http://localhost:3000"];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("不允許傳遞資料 CORS"));
    }
  },
};
const upload = multer();

const defaultData = { products: [], user: [] };
const db = new Low(new JSONFile("db.json"), defaultData);
await db.read();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("首頁");
});

// -- 產品products -- (start)
app.get("/api/products", (req, res) => {
  res.send("獲取所有產品");
});

app.get("/api/products/category/:cid", (req, res) => {
res.send(`獲取特定類別 ID 的產品 ${req.params.cid}`);
});

app.get("/api/products/search", (req, res) => {
  res.send("使用 ID 作為搜尋條件來搜尋產品");
});

app.get("/api/products/:id", (req, res) => {
  res.send(`獲取特定 ID 產品 ${req.params.id}`);
});

app.post("/api/products", (req, res) => {
  res.send("新增一個產品");
});

app.put("/api/products/:id", (req, res) => {
  res.send(`更新特定 ID 的產品 ${req.params.id}`);
});

app.delete("/api/products/:id", (req, res) => {
  res.send(`刪除特定 ID 的產品 ${req.params.id}`);
});

// -- 產品products -- (end)

// -- 使用者user -- (start)
app.get("/api/users", (req, res) => {
  res.send("獲取所有使用者");
});

app.get("/api/users/search", (req, res) => {
  res.send("使用 ID 作為搜尋條件來搜尋使用者");
});

app.get("/api/users/status", (req, res) => {
  res.send("檢查使用者登入登出狀態");
});

app.get("/api/users/:id/", (req, res) => {
  res.send(`獲取特定 ID 的使用者 ${req.params.id}`);
});

app.post("/api/users/", (req, res) => {
  res.send("新增一個使用者");
});

app.put("/api/users/:id/", (req, res) => {
  res.send(`更新特定 ID 的使用者 ${req.params.id}`);
});

app.delete("/api/users/:id/", (req, res) => {
  res.send(`刪除特定 ID 的使用者 ${req.params.id}`);
});

app.post("/api/users/login", (req, res) => {
  res.send("使用者登入");
});

app.post("/api/users/logout", (req, res) => {
  res.send("使用者登出");
});
// -- 使用者user -- (end)

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});

function checkToken(req, res, next) {
  let token = req.get("Authorization");

  if (token && token.indexOf("Bearer ") === 0) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", message: "登入驗證失效，請重新登入。" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ status: "error", message: "無登入驗證資料，請重新登入。" });
  }
}
