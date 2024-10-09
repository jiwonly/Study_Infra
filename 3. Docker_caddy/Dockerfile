FROM node 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# 첫번째 점 : 현재 디렉토리 (로컬경로)
# 두번째 점 : 컨테이너 내부의 현재 작업 디렉토리 (컨테이너 경로)
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

