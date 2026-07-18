@echo off
start "Discovery Server" cmd /k "cd backend\discovery-server && mvnw.cmd spring-boot:run"
timeout /t 15
start "API Gateway" cmd /k "cd backend\api-gateway && mvnw.cmd spring-boot:run"
timeout /t 10
start "User Service" cmd /k "cd backend\user-service && mvnw.cmd spring-boot:run"