# 🏆 TÔNG MÔN TRANH BÁ (Soul Land: Awakening World) - PVP Tournament Platform

Hệ thống quản trị và phát sóng trực tiếp giải đấu PvP đỉnh cao Đấu La Đại Lục (Single Elimination Tournament) với giao diện Esports MMORPG Dark Theme, âm thanh Web Audio và thuật toán phân nhánh tự động.

---

## 🌟 Tính Năng Nổi Bật

- **3 Bảng Đấu Phân Hạng**:
  - **Bảng A (Hải Thần Truyền Nhân)**: 13 Tuyển thủ cấp Thần Vương.
  - **Bảng B (Sâm Lâm Bá Chủ)**: 8 Hồn Sư cấp Phong Hào Đấu La.
  - **Bảng C (Sử Lai Khắc Tân Tinh)**: 6 Tân Tinh Hồn Sư.
- **Thuật Toán Phân Nhánh Tự Động**:
  - Tự động tính toán số trận Byes đặc cách vòng 1 theo công thức $K = 2^{\lceil \log_2 N \rceil}$.
  - Tự động định tuyến người thua Bán Kết xuống trận **Tranh Hạng Ba**.
  - Tự động bốc thăm và xếp ngẫu nhiên khi thêm thí sinh mới.
- **Bảo Mật & Phân Quyền Quản Trị**:
  - **Khán giả**: Xem trực tiếp nhánh đấu, bục vinh danh, thông số tuyển thủ mà không cần tài khoản.
  - **Ban Tổ Chức**: Đăng nhập quản trị với 3 tài khoản điều hành (`parker`, `nguyen`, `hieu`).
- **An Toàn Điều Hành (Safety & Rollback)**:
  - Hộp thoại **Xác Nhận Người Thắng (Confirm Modal)** tránh ấn nhầm.
  - Cơ chế **Hoàn Tác / Hủy Kết Quả Đệ Quy (Rollback)** rút lại toàn bộ kết quả vòng sau an toàn.
- **Trải Nghiệm Esports Đỉnh Cao**:
  - Phông nền Áp Phích toàn màn hình (Full-Bleed Widescreen Posters).
  - Bục Vinh Danh 3D (Champion Podium) và pháo hoa ăn mừng (Confetti).
  - Hệ thống hạt linh lực (Canvas Particle Engine) và âm thanh võ hồn (Web Audio API).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Icons & Animation**: Lucide React, Canvas 2D Particles, Canvas Confetti
- **Audio Engine**: Web Audio API Sound Synthesizer
- **State & Sync**: React Context, BroadcastChannel, LocalStorage Sync

---

## 🚀 Cài Đặt & Chạy Cục Bộ

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Build sản phẩm
npm run build
```

---

## 🔑 Tài Khoản Quản Trị (Mặc Định)

| Tài Khoản | Mật Khẩu | Quyền Hạn |
|---|---|---|
| `parker` | `parker123` | Parker (BTC) - Trưởng Ban Tổ Chức |
| `nguyen` | `nguyen123` | Nguyễn (Trọng Tài) - Trọng Tài Trưởng |
| `hieu` | `hieu123` | Hiếu (Kỹ Thuật) - Điều Hành Kỹ Thuật |
