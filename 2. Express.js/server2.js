import http from "http";
import fs from "fs";
import os from "os";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

// 현재 파일의 URL을 가져와서 경로로 변환
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// JSON 요청 바디 파싱 미들웨어
app.use(express.json());

// GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST /api/signup
app.post("/api/signup", (req, res) => {
  const { username, password, email } = req.body;

  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).send("서버 오류 발생");
    }

    const users = data ? JSON.parse(data) : [];

    users.push({ username, password, email });

    // JSON.stringify : JavaScript 객체를 JSON 문자열로 변환
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send("회원 정보 저장 중 오류 발생");
      }
      res.status(201).send("회원가입 완료");
    });
  });
});

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("서버 오류 발생");
    }

    const users = JSON.parse(data);
    const isUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (isUser) {
      res.status(200).send("로그인 성공");
    } else {
      res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  });
});

// GET /api/users
app.get("/api/users", (req, res) => {
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("서버 오류 발생");
    }

    const users = JSON.parse(data);
    const safeUsers = users.map((user) => {
      return {
        username: user.username,
        email: user.email,
      };
    });
    res.json(safeUsers);
  });
});

// GET /api/os
app.get("/api/os", (req, res) => {
  const osInfo = {
    type: os.type(),
    hostname: os.hostname(),
    cpu_num: os.cpus().length,
    total_mem: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
  };
  res.json(osInfo);
});

app.listen(port, () => {
  console.log(`서버 실행 중`);
});
