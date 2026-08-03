@echo off
echo Starting GreenCart Services...
start "Discovery Server" cmd /k "cd backend\discovery-server && mvnw.cmd spring-boot:run"
powershell -Command "Start-Sleep -Seconds 15"
start "API Gateway" cmd /k "cd backend\api-gateway && mvnw.cmd spring-boot:run"
powershell -Command "Start-Sleep -Seconds 10"
start "User Service" cmd /k "cd backend\user-service && mvnw.cmd spring-boot:run"
powershell -Command "Start-Sleep -Seconds 10"
start "Product Service" cmd /k "cd backend\product-service && mvnw.cmd spring-boot:run"
powershell -Command "Start-Sleep -Seconds 10"
start "Admin Service" cmd /k "cd ""backend\admin_service(.NET)\GreenCart_Admin_Service(.NET)"" && dotnet run"
powershell -Command "Start-Sleep -Seconds 10"
start "Buyer Service" cmd /k "cd backend\buyer-service && mvnw.cmd spring-boot:run"
powershell -Command "Start-Sleep -Seconds 10"
start "Frontend React" cmd /k "cd frontend && npm start"
echo All GreenCart backend services and React frontend launched!