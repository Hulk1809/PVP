# ====================================================================
# SCRIPT DEPLOY TỰ ĐỘNG GIẢI ĐẤU ĐẤU LA ĐẠI LỤC LÊN AWS EC2
# ====================================================================

param(
    [string]$EC2_IP,
    [string]$EC2_USER = "ubuntu", # "ubuntu" (cho Ubuntu OS) hoặc "ec2-user" (cho Amazon Linux)
    [string]$KEY_PATH = "$PSScriptRoot\HULK1809.pem"
)

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "⚔️  BẮT ĐẦU QUÁ TRÌNH DEPLOY LÊN MÁY CHỦ AWS EC2" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Kiểm tra File Key PEM
if (-not (Test-Path $KEY_PATH)) {
    Write-Host "❌ Không tìm thấy file key: $KEY_PATH" -ForegroundColor Red
    Write-Host "Vui lòng đặt file HULK1809.pem vào cùng thư mục dự án!" -ForegroundColor Red
    exit 1
}

# 2. Nhập IP nếu chưa truyền vào
if (-not $EC2_IP) {
    $EC2_IP = Read-Host "👉 Nhập địa chỉ Public IPv4 của máy chủ EC2 (Ví dụ: 54.255.120.88)"
}

if (-not $EC2_IP) {
    Write-Host "❌ Chưa nhập IP máy chủ. Hủy quá trình deploy." -ForegroundColor Red
    exit 1
}

Write-Host "`n🔹 Mục tiêu: $EC2_USER@$EC2_IP" -ForegroundColor Green
Write-Host "🔹 Key SSH: $KEY_PATH" -ForegroundColor Green

# 3. Build lại source code mới nhất
Write-Host "`n🔨 [1/4] Đang biên dịch Production Bundle (npm run build)..." -ForegroundColor Cyan
Set-Location $PSScriptRoot
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Lỗi khi build dự án! Hủy deploy." -ForegroundColor Red
    exit 1
}

# 4. Nén các file cần thiết để deploy
Write-Host "`n📦 [2/4] Đang đóng gói dữ liệu deploy..." -ForegroundColor Cyan
$deployZip = "$PSScriptRoot\deploy_payload.zip"
if (Test-Path $deployZip) { Remove-Item $deployZip -Force }

# Nén dist, server.js, package.json, package-lock.json, data
Compress-Archive -Path "dist", "server.js", "package.json", "package-lock.json", "backup_tournament_data_aws.json", "danh_sach_tai_khoan_tuyen_thu.json" -DestinationPath $deployZip -Force

# 5. Upload lên máy chủ EC2 qua SCP
Write-Host "`n🚀 [3/4] Đang tải source code lên máy chủ EC2 ($EC2_IP)..." -ForegroundColor Cyan
# Phân quyền cho file pem nếu cần
icacls.exe $KEY_PATH /inheritance:r /grant:r "$($env:USERNAME):(R)" | Out-Null

scp -i $KEY_PATH -o StrictHostKeyChecking=no $deployZip "$($EC2_USER)@$($EC2_IP):/home/$($EC2_USER)/deploy_payload.zip"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Không thể kết nối SCP lên EC2. Kiểm tra lại IP, User hoặc Security Group (Port 22 SSH)!" -ForegroundColor Red
    Remove-Item $deployZip -Force
    exit 1
}
Remove-Item $deployZip -Force

# 6. Thiết lập và khởi chạy Server trên EC2 bằng SSH
Write-Host "`n⚡ [4/4] Đang cài đặt môi trường và khởi chạy ứng dụng 24/7 trên EC2..." -ForegroundColor Cyan

$remoteCommands = @"
set -e
echo '--- [EC2] Cài đặt Node.js & PM2 ---'
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs unzip || sudo yum install -y nodejs unzip
fi

if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

sudo mkdir -p /var/www/soul-land-pvp
sudo chown -R `$USER:`$USER /var/www/soul-land-pvp
cd /var/www/soul-land-pvp

echo '--- [EC2] Giải nén code ---'
unzip -o /home/$EC2_USER/deploy_payload.zip
rm -f /home/$EC2_USER/deploy_payload.zip

echo '--- [EC2] Cài đặt dependencies ---'
npm install --omit=dev

echo '--- [EC2] Cho phép chạy Port 80 không cần root ---'
sudo setcap 'cap_net_bind_service=+ep' `which node` || true

echo '--- [EC2] Khởi chạy PM2 ---'
PORT=80 pm2 restart soul-land-pvp || PORT=80 pm2 start server.js --name soul-land-pvp
pm2 save

echo '--- [EC2] HOÀN TẤT THÀNH CÔNG ---'
"@

ssh -i $KEY_PATH -o StrictHostKeyChecking=no "$($EC2_USER)@$($EC2_IP)" $remoteCommands

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "🎉 DEPLOY LÊN AWS EC2 THÀNH CÔNG RỰC RỠ!" -ForegroundColor Green
Write-Host "🌐 Trang Web Giải Đấu Đang Chạy Trực Tiếp Tại: http://$EC2_IP" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green
