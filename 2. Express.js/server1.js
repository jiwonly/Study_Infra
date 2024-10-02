import fs from "fs";
import os from "os";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// 현재 파일의 URL을 가져와서 경로로 변환
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json()); // JSON 요청을 파싱하는 미들웨어
app.use(cookieParser()); // 쿠키를 파싱하는 미들웨어

// 임시 토큰을 저장하는 배열
const sessions = {};

// GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST /api/signup
app.post("/api/signup", (req, res) => {
  const { username, password, email } = req.body;

  const users = fs.existsSync("users.json")
    ? JSON.parse(fs.readFileSync("users.json"))
    : [];

  users.push({ username, password, email });

  // JSON.stringify : JavaScript 객체를 JSON 문자열로 변환
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.status(201).send("회원가입 완료");
});

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  const isUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (isUser) {
    // 인증 토큰 생성
    const token = `${username}-${Date.now()}`;
    sessions[token] = username;

    // 토큰을 쿠키로 설정 (httpOnly : js에서 접근 X, 1시간 유지))
    res.cookie("auth_token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    res.status(200).send("로그인 성공");
  } else {
    res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
  }
});

// 인증 미들웨어 (API 접근 전 토큰 확인)
function authenticate(req, res, next) {
  const token = req.cookies.auth_token;

  if (token && sessions[token]) {
    req.username = sessions[token];
    next();
  } else {
    res.status(401).send("인증되지 않은 사용자입니다.");
  }
}

// GET /api/users
app.get("/api/users", authenticate, (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  const safeUsers = users.map(({ username, email }) => ({ username, email }));
  res.json(safeUsers);
});

// GET /api/os
app.get("/api/os", authenticate, (req, res) => {
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
