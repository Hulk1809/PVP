# Deploy script to AWS EC2
$key = "d:\PVP\HULK1809.pem"
$ip = "3.1.210.184"
$user = "ec2-user"
$remoteDest = "${user}@${ip}:/home/${user}/deploy_payload.tar.gz"
$remoteHost = "${user}@${ip}"

Write-Host "1. Đang đóng gói dữ liệu deploy..." -ForegroundColor Cyan
tar -czf "d:\PVP\deploy_payload.tar.gz" dist server.js package.json package-lock.json

Write-Host "2. Đang tải lên máy chủ EC2 (3.1.210.184)..." -ForegroundColor Cyan
scp -i $key -o StrictHostKeyChecking=no "d:\PVP\deploy_payload.tar.gz" $remoteDest

Write-Host "3. Đang cài đặt và khởi chạy trên EC2..." -ForegroundColor Cyan
$cmd = 'sudo mkdir -p /var/www/soul-land-pvp && sudo chown -R ec2-user:ec2-user /var/www/soul-land-pvp && cd /var/www/soul-land-pvp && tar -xzf /home/ec2-user/deploy_payload.tar.gz && rm -f /home/ec2-user/deploy_payload.tar.gz && npm install --omit=dev && sudo pm2 restart soul-land-pvp && sudo pm2 status'

ssh -i $key -o StrictHostKeyChecking=no $remoteHost $cmd

Remove-Item "d:\PVP\deploy_payload.tar.gz" -Force

Write-Host "`n🎉 HOÀN TẤT! Web đang chạy tại: http://$ip" -ForegroundColor Green
