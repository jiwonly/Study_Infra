// 모듈 불러오기
const http = require("http");
const fs = require("fs").promises; // 비동기 방식
const os = require("os");
const path = require("path");

// http 서버 생성
const server = http
  .createServer(async (req, res) => {
    // req : 요청에 관한 정보
    // res: 응답에 관한 정보

    // HTML 파일 읽기
    try {
      const htmlData = await fs.readFile("index.html", "utf-8");
      let changedHtmlData = htmlData
        .replace("{{type}}", os.type()) // 운영체제 유형
        .replace("{{hostname}}", os.hostname()) // 호스트 이름
        .replace("{{cpu_num}}", os.cpus().length) // CPU 코어 개수
        .replace(
          "{{total_mem}}",
          Math.floor(os.totalmem() / 1024 / 1024) + " MB" // 총 메모리 용량, Math.floor로 소수점 없앰
        );
      res.writeHead(200, { "Content-Type": "text/html" }); // 응답의 상태 코드를 200(성공)으로 설정, html 보내기
      res.end(changedHtmlData); // 처리된 HTML 데이터를 응답으로 보냄
    } catch (err) {
      // 에러 발생 시
      res.writeHead(500, { "Content-Type": "text/plain" }); // 응답의 상태 코드를 500(서버 오류)로 설정, 일반 텍스트 형식
      res.end(err.message); // 에러 메시지 응답으로 보냄
    }
  })
  // 서버를 3000번 포트에서 실행
  .listen(3000, () => {
    console.log("서버 실행 중");
  });
