import re, json, unicodedata, os

def clean_username(name):
    # Remove GOD prefix
    clean = re.sub(r'^GOD[乄乂\.\s\-_]*', '', name, flags=re.IGNORECASE)
    # Remove diacritics
    clean = unicodedata.normalize('NFD', clean)
    clean = ''.join(c for c in clean if unicodedata.category(c) != 'Mn')
    clean = re.sub(r'[^a-zA-Z0-9]', '', clean).lower().strip()
    if not clean or len(clean) < 2:
        clean = re.sub(r'[^a-z0-9]', '', name.lower()) or 'tuyenthu'
    return clean

PASSWORD_SUFFIXES = [
    'mayman', 'top1', 'top2', 'top3', 'vodich', 'venhi', 'veque',
    'deptrai', 'badao', 'batbai', 'votri', 'quangthan', 'haithan',
    'tulamakiem', 'longthan', 'chienthan', 'kiemtien', 'tuthandao',
    'tuyettrieu', 'tranhba', 'honsu99', 'phongthan', 'sieucap',
    'thanma', 'phuonghoang', 'bachtieu', 'tamxoa', 'hoathu',
    'mahoang', 'chiensi', 'docco', 'bachthieu'
]

# Read defaultData.ts
with open('src/engine/defaultData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all participants
pattern = re.compile(r"\{\s*id:\s*'([^']+)',\s*bracketId:\s*'([^']+)',\s*name:\s*'([^']+)',\s*sect:\s*'([^']+)',\s*martialSoul:\s*'([^']+)',\s*soulRank:\s*'([^']+)',\s*soulLevel:\s*(\d+).*?seedRank:\s*(\d+).*?\}", re.DOTALL)

participants_list = []
for m in pattern.finditer(content):
    p_id, b_id, name, sect, soul, rank, level, seed = m.groups()
    username = clean_username(name)
    suffix = PASSWORD_SUFFIXES[int(seed) % len(PASSWORD_SUFFIXES)]
    password = f"{username}{suffix}"
    
    participants_list.append({
        'id': p_id,
        'bracketId': b_id,
        'name': name,
        'sect': sect,
        'martialSoul': soul,
        'soulRank': rank,
        'soulLevel': int(level),
        'seedRank': int(seed),
        'username': username,
        'password': password,
        'email': f"{username}@pvp.tournament",
        'claimed': True
    })

print(f"Extracted {len(participants_list)} participants.")

# Group by brackets
brackets_data = {
    'bracket-a': {'name': 'Bảng A (Tối Thượng > 50)', 'tier': 'Tối Thượng > 50', 'theme': 'ocean', 'players': []},
    'bracket-b': {'name': 'Bảng B (Tối Thượng < 10)', 'tier': 'Tối Thượng < 10', 'theme': 'forest', 'players': []},
    'bracket-c': {'name': 'Bảng C (Rực Rỡ Trở Xuống)', 'tier': 'Rực Rỡ Trở Xuống', 'theme': 'village', 'players': []},
}

player_accounts = {}
participants_map = {}

for p in participants_list:
    b_id = p['bracketId']
    if b_id in brackets_data:
        brackets_data[b_id]['players'].append(p)
    participants_map[p['id']] = p
    player_accounts[p['username']] = {
        'id': f"acc-{p['id']}",
        'participantId': p['id'],
        'playerName': p['name'],
        'username': p['username'],
        'password': p['password'],
        'email': p['email'],
        'claimedAt': '2026-08-17T12:00:00.000Z'
    }

# 1. Export JSON accounts
with open('danh_sach_tai_khoan_tuyen_thu.json', 'w', encoding='utf-8') as f:
    json.dump(player_accounts, f, ensure_ascii=False, indent=2)

# 2. Export Full AWS Backup Data JSON
full_backup = {
    'exportTimestamp': '2026-08-17T21:30:00Z',
    'totalParticipants': len(participants_list),
    'brackets': {
        'bracket-a': {
            'id': 'bracket-a',
            'name': 'Bảng A (Tối Thượng > 50)',
            'divisionTitle': 'Hải Thần Truyền Nhân',
            'tierName': 'Tối Thượng > 50',
            'theme': 'ocean',
            'status': 'in_progress',
            'totalRounds': 4
        },
        'bracket-b': {
            'id': 'bracket-b',
            'name': 'Bảng B (Tối Thượng < 10)',
            'divisionTitle': 'Sâm Lâm Bá Chủ',
            'tierName': 'Tối Thượng < 10',
            'theme': 'forest',
            'status': 'in_progress',
            'totalRounds': 4
        },
        'bracket-c': {
            'id': 'bracket-c',
            'name': 'Bảng C (Rực Rỡ Trở Xuống)',
            'divisionTitle': 'Sử Lai Khắc Tân Tinh',
            'tierName': 'Rực Rỡ Trở Xuống',
            'theme': 'village',
            'status': 'in_progress',
            'totalRounds': 6
        }
    },
    'participants': participants_map,
    'playerAccounts': player_accounts,
    'adminAccounts': {
        'parker': {'pass': 'parker123', 'name': 'Parker (BTC)'},
        'nguyen': {'pass': 'nguyen123', 'name': 'Nguyễn (Trọng Tài)'},
        'hieu': {'pass': 'hieu123', 'name': 'Hiếu (Kỹ Thuật)'}
    }
}

with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(full_backup, f, ensure_ascii=False, indent=2)

# 3. Export Markdown Cheatsheet
md_content = """# 🏆 DANH SÁCH TOÀN BỘ TÀI KHOẢN TUYỂN THỦ - GIẢI ĐẤU ĐẤU LA ĐẠI LỤC PVP 2026

> Dữ liệu được trích xuất hoàn chỉnh sẵn sàng cho việc Deploy lên AWS (S3, CloudFront, Amplify, EC2, DynamoDB).

---

## 👑 TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)
| Tài Khoản (Username) | Mật Khẩu (Password) | Vai Trò |
| :--- | :--- | :--- |
| `parker` | `parker123` | **Parker (Ban Tổ Chức)** |
| `nguyen` | `nguyen123` | **Nguyễn (Trọng Tài)** |
| `hieu` | `hieu123` | **Hiếu (Kỹ Thuật)** |

---

"""

for b_id, b_info in brackets_data.items():
    md_content += f"## 🔱 {b_info['name'].upper()} ({len(b_info['players'])} Tuyển Thủ)\n\n"
    md_content += "| STT | Hạt Giống | Tên Tuyển Thủ | Tông Môn | Võ Hồn | Cấp | Tên Đăng Nhập | Mật Khẩu Cấp Sẵn |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
    
    sorted_players = sorted(b_info['players'], key=lambda x: x['seedRank'])
    for idx, p in enumerate(sorted_players, 1):
        md_content += f"| {idx} | #{p['seedRank']} | **{p['name']}** | {p['sect']} | {p['martialSoul']} | Lv.{p['soulLevel']} | `{p['username']}` | `{p['password']}` |\n"
    md_content += "\n---\n\n"

with open('DANH_SACH_TAI_KHOAN_TUYEN_THU.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("Created backup_tournament_data_aws.json, danh_sach_tai_khoan_tuyen_thu.json, and DANH_SACH_TAI_KHOAN_TUYEN_THU.md successfully!")
