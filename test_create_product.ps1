$login = Invoke-RestMethod -Uri "http://localhost:8080/user/login" -Method POST -Body '{"username":"farmer_john","password":"password123"}' -ContentType "application/json"
$token = $login.token
$headers = @{ Authorization = "Bearer $token" }
$body = '{"subCategoryId":1,"description":"Farm fresh organic juicy tomatoes harvested daily","price":45.0,"quantity":100,"imageUrl":"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80"}'
$res = Invoke-RestMethod -Uri "http://localhost:8080/api/products/create" -Method POST -Body $body -Headers $headers -ContentType "application/json"
$res | ConvertTo-Json
