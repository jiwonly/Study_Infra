// 모듈 불러오기
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

// http 서버 생성
const server = http
  .createServer((req, res) => {
    // req : 요청에 관한 정보
    // res: 응답에 관한 정보

    // HTML 파일 읽기
    fs.readFile("index.html", "utf8", (err, htmlData) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" }); // 응답의 상태 코드를 500(서버 오류)로 설정, 일반 텍스트 형식
        res.end("Error"); //http 응답을 완료하고 클라이언트와의 연결을 종료
        return;
      }

      let changedHtmlData = htmlData
        .replace("{{type}}", os.type()) // 운영체제 유형
        .replace("{{hostname}}", os.hostname()) // 호스트 이름
        .replace("{{cpu_num}}", os.cpus().length) // CPU 코어 개수
        .replace(
          "{{total_mem}}",
          Math.floor(os.totalmem() / 1024 / 1024) + " MB" // 총 메모리 용량, Math.floor로 소수점 없앰
        );
      res.writeHead(200, { "Content-Type": "text/html" }); // 응답의 상태 코드를 200(성공)으로 설정, html 보내기
      res.end(changedHtmlData);
    });
  })
  // 서버를 3000번 포트에서 실행
  .listen(3000, () => {
    console.log("서버 실행 중");
  });
