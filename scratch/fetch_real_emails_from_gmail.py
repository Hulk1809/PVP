import imaplib, email, re, json
from email.header import decode_header

user = 'voquocthang1809@gmail.com'
password = 'tilv lzjg qghn ndkf'

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login(user, password)

status, folder_list = mail.list()
sent_folder = None
for f in folder_list:
    f_str = f.decode('utf-8')
    if '\\Sent' in f_str or 'Sent Mail' in f_str or 'Thư đã gửi' in f_str:
        match = re.search(r'"([^"]+)"$', f_str) or re.search(r' (\S+)$', f_str)
        if match:
            sent_folder = match.group(1)
            break

if not sent_folder:
    sent_folder = '[Gmail]/Sent Mail'

status, count = mail.select(f'"{sent_folder}"')
status, data = mail.search(None, 'ALL')
mail_ids = data[0].split()

claimed_accounts = {}

# Fetch all sent emails
for num in reversed(mail_ids):
    res, msg_data = mail.fetch(num, '(RFC822)')
    if res != 'OK':
        continue
    
    raw_email = msg_data[0][1]
    msg = email.message_from_bytes(raw_email)
    
    subject_raw = msg['Subject'] or ''
    to_email = msg['To'] or ''
    
    # Get HTML / text body
    body = ''
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if 'attachment' not in cdispo and (ctype == 'text/html' or ctype == 'text/plain'):
                payload = part.get_payload(decode=True)
                if payload:
                    body += payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            body = payload.decode('utf-8', errors='ignore')
    
    player_match = re.search(r'Tên Tuyển Thủ:.*?<td[^>]*>(?:<strong>)?(.*?)(?:</strong>)?</td>', body, re.DOTALL | re.IGNORECASE)
    user_match = re.search(r'Tên Đăng Nhập:.*?<td[^>]*>(?:<span[^>]*>)?(.*?)(?:</span>)?</td>', body, re.DOTALL | re.IGNORECASE)
    pass_match = re.search(r'Mật Khẩu:.*?<td[^>]*>(?:<span[^>]*>)?(.*?)(?:</span>)?</td>', body, re.DOTALL | re.IGNORECASE)
    bracket_match = re.search(r'Bảng Đấu:.*?<td[^>]*>(.*?)</td>', body, re.DOTALL | re.IGNORECASE)
    
    if user_match and pass_match:
        clean_player = re.sub(r'<[^>]+>', '', player_match.group(1) if player_match else '').strip()
        clean_user = re.sub(r'<[^>]+>', '', user_match.group(1)).strip()
        clean_pass = re.sub(r'<[^>]+>', '', pass_match.group(1)).strip()
        clean_bracket = re.sub(r'<[^>]+>', '', bracket_match.group(1) if bracket_match else '').strip()
        
        email_clean_match = re.search(r'<([^>]+)>', to_email) or re.search(r'([\w\.-]+@[\w\.-]+)', to_email)
        clean_email_addr = email_clean_match.group(1) if email_clean_match else to_email.strip()
        
        claimed_accounts[clean_user] = {
            'playerName': clean_player,
            'username': clean_user,
            'password': clean_pass,
            'bracketName': clean_bracket,
            'email': clean_email_addr,
            'claimedAt': str(msg['Date'] or '2026-08-17T20:00:00Z')
        }

mail.close()
mail.logout()

# 1. Save to JSON
with open('danh_sach_tai_khoan_tuyen_thu.json', 'w', encoding='utf-8') as f:
    json.dump(claimed_accounts, f, ensure_ascii=False, indent=2)

# 2. Update DANH_SACH_TAI_KHOAN_TUYEN_THU.md
# Load default participants to merge
with open('backup_tournament_data_aws.json', 'r', encoding='utf-8') as f:
    backup = json.load(f)

# Update playerAccounts in backup
backup['playerAccounts'] = claimed_accounts

with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(backup, f, ensure_ascii=False, indent=2)

# Generate Markdown
md = "# 🏆 DANH SÁCH TÀI KHOẢN TUYỂN THỦ THỰC TẾ (KHỚP 100% GMAIL ĐÃ GỬI)\n\n"
md += f"> Tổng cộng: **{len(claimed_accounts)}** tuyển thủ đã nhận tài khoản và mật khẩu qua Gmail.\n\n"
md += "---\n\n## 👑 TÀI KHOẢN ADMIN\n| Tài Khoản | Mật Khẩu | Vai Trò |\n| :--- | :--- | :--- |\n| `parker` | `parker123` | Parker (Ban Tổ Chức) |\n| `nguyen` | `nguyen123` | Nguyễn (Trọng Tài) |\n| `hieu` | `hieu123` | Hiếu (Kỹ Thuật) |\n\n---\n\n"
md += "## 🔱 DANH SÁCH TOÀN BỘ TÀI KHOẢN & MẬT KHẨU ĐÃ GỬI QUA GMAIL\n\n"
md += "| STT | Tên Tuyển Thủ | Bảng Đấu | Tên Đăng Nhập | Mật Khẩu Đã Gửi | Email Nhận |\n"
md += "| :--- | :--- | :--- | :--- | :--- | :--- |\n"

for idx, (u, acc) in enumerate(claimed_accounts.items(), 1):
    md += f"| {idx} | **{acc['playerName']}** | {acc['bracketName']} | `{acc['username']}` | `{acc['password']}` | `{acc['email']}` |\n"

with open('DANH_SACH_TAI_KHOAN_TUYEN_THU.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("EXPORT_FINISHED_TOTAL_ACCOUNTS:", len(claimed_accounts))
