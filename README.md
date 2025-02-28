[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 프로젝트 실행 방법

```bash
#패키지 설치
$ npm install

# watch mode
$ npm run start:dev
```

## MySQL Database
이 결과물은 데이터베이스만 도커에서 작동한다. 
도커 압축 파일은 이메일로 별도 첨부하였으며 실행 방법은 아래와 같다.

```bash
#압축 파일 로드
$ docker load -i mysql.tar

#도커 컨테이너 실행
$ docker run --name mysql -e MYSQL_ROOT_PASSWORD=mysql -d -p 3307:3306 mysql:8.0.22
```
