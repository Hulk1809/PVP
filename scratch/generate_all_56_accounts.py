import urllib.request
import json
import time

def normalize_username(name):
    # Strip GOD, God, symbols, spaces
    clean = name.replace('GOD乄', '').replace('GOD.', '').replace('GOD-', '').replace('GOD', '').replace('乄', '').replace('.', '').replace('-', '').strip()
    # Replace special characters and accents
    mapping = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a', 'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd', 'Đ': 'd',
        'β': 'b', 'α': 'a', 'βaβy': 'baby'
    }
    res = clean.lower()
    for k, v in mapping.items():
        res = res.replace(k, v)
    res = ''.join(c for c in res if c.isalnum())
    return res or 'player'

def main():
    print("Fetching participants from live EC2...")
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        live_state = json.loads(res.read().decode('utf-8'))['state']

    participants = live_state.get('participants', {})
    existing_accounts = live_state.get('playerAccounts', {})
    
    print(f"Total Participants: {len(participants)}")
    print(f"Existing Accounts: {len(existing_accounts)}")

    # Known existing active accounts (28 accounts)
    known_accounts = {
        "ta": {"password": "tadocco", "email": "dongtam9555@gmail.com", "claimed": True},
        "solomon": {"password": "solomonkiemtien", "email": "minhtrian0706@gmail.com", "claimed": True},
        "vulan": {"password": "vulanmahoang", "email": "Quatlam2024@gmail.com", "claimed": True},
        "gau": {"password": "gaudocco", "email": "Sygau1995@gmail.com", "claimed": True},
        "hades": {"password": "hadestop1", "email": "luulinhfacebookads@gmail.com", "claimed": True},
        "tit": {"password": "tittuthandao", "email": "ducthuan2002nd@gmail.com", "claimed": True},
        "tea": {"password": "teadeptrai", "email": "test.tea@gmail.com", "claimed": True},
        "huynh": {"password": "huynhbachthieu", "email": "huynhvipboy5@gmail.com", "claimed": True},
        "mahoang": {"password": "mahoangbachthieu", "email": "wlink1611@gmail.com", "claimed": True},
        "giangne": {"password": "giangnetop2", "email": "gh5766420@gmail.com", "claimed": True},
        "heo": {"password": "heothanma", "email": "dotronghieu140620053@gmail.com", "claimed": True},
        "men": {"password": "mentranhba", "email": "phuctkdpro@gmail.com", "claimed": True},
        "qlng": {"password": "qlngkiemtien", "email": "minhhuy7001@gmail.com", "claimed": True},
        "goodluck": {"password": "goodlucktuyettrieu", "email": "bqhuy0846446@gmail.com", "claimed": True},
        "yulyn": {"password": "yulynbatbai", "email": "yulyn2205@gmail.com", "claimed": True},
        "hung": {"password": "hungchiensi", "email": "iamhung1706@gmail.com", "claimed": True},
        "lucky": {"password": "luckysieucap", "email": "hoanghai2909@gmail.com", "claimed": True},
        "ttt": {"password": "tttlongthan", "email": "thaithien010104@gmail.com", "claimed": True},
        "hulk": {"password": "hulkveque", "email": "voquocthang18092005@gmail.com", "claimed": True},
        "jetjet": {"password": "jetjetquangthan", "email": "boycunli@gmail.com", "claimed": True},
        "god": {"password": "godhonsu99", "email": "kientq888@gmail.com", "claimed": True},
        "daim": {"password": "daimvotri", "email": "hoanglong.147@gmail.com", "claimed": True},
        "diem": {"password": "diemdeptrai", "email": "tantai.21082005@gmail.com", "claimed": True},
        "darkness": {"password": "darknessbachthieu", "email": "tranminhhieu11a3ntt@gmail.com", "claimed": True},
        "pain": {"password": "painthanthoai", "email": "voquocthang18092005@gmail.com", "claimed": True},
        "vyx": {"password": "vyxkiemtien", "email": "trinhgiavy21@gmail.com", "claimed": True},
        "gin": {"password": "gintuthandao", "email": "vietanh2644@gmail.com", "claimed": True},
        "death": {"password": "deaththanma", "email": "duythanh.dhsanh15a@gmail.com", "claimed": True},
    }

    # Suffixes for memorable Soul Land passwords
    soul_suffixes = ['kiemtien', 'mahoang', 'bachthieu', 'thanma', 'tranhba', 'top1', 'batbai', 'docco', 'sieucap', 'deptrai', 'quangthan', 'longthan', 'honsu99', 'tuthandao']

    all_56_accounts = {}
    all_56_markdown = []

    all_56_markdown.append("# 🏆 DANH SÁCH TÀI KHOẢN TẤT CẢ 56 TUYỂN THỦ (PRE-SEEDED)\n\n")
    all_56_markdown.append("| STT | Bảng | ID | Tên Tuyển Thủ | Tên Đăng Nhập | Mật Khẩu Khởi Tạo | Trạng Thái Email |\n")
    all_56_markdown.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")

    stt = 1
    for p_id, p in participants.items():
        name = p.get('name', '')
        u = normalize_username(name)
        
        # Ensure unique username
        if u in all_56_accounts and all_56_accounts[u]['participantId'] != p_id:
            u = f"{u}_{p_id.split('-')[-1]}"
            
        b_id = p.get('bracketId', '')
        b_name = "Bảng A" if b_id == 'bracket-a' else ("Bảng B" if b_id == 'bracket-b' else "Bảng C")

        if u in known_accounts:
            k = known_accounts[u]
            pwd = k['password']
            mail = k['email']
            is_claimed = True
        elif u in existing_accounts and existing_accounts[u].get('password'):
            acc = existing_accounts[u]
            pwd = acc['password']
            mail = acc.get('email')
            is_claimed = bool(p.get('claimed') or mail)
        else:
            suffix = soul_suffixes[stt % len(soul_suffixes)]
            pwd = f"{u}{suffix}"
            mail = None
            is_claimed = False

        account_obj = {
            "id": f"acc-{p_id}",
            "participantId": p_id,
            "playerName": name,
            "username": u,
            "password": pwd,
            "bracketName": b_name,
            "email": mail,
            "claimedAt": p.get('claimedAt') or (time.strftime('%Y-%m-%dT%H:%M:%SZ') if is_claimed else None)
        }

        all_56_accounts[u] = account_obj
        
        # Update participant in state
        p['username'] = u
        p['claimed'] = is_claimed
        if mail:
            p['email'] = mail

        status_str = f"✅ Đã kích hoạt ({mail})" if is_claimed else "⏳ Chưa nhập mail"
        all_56_markdown.append(f"| {stt} | {b_name} | `{p_id}` | **{name}** | `{u}` | `{pwd}` | {status_str} |\n")
        stt += 1

    print(f"\nGenerated total {len(all_56_accounts)} accounts across all {len(participants)} participants.")
    claimed_total = sum(1 for p in participants.values() if p.get('claimed'))
    print(f"Claimed (Activated): {claimed_total}, Unclaimed (Ready for email): {len(participants) - claimed_total}")

    # Write Markdown table
    with open('d:/PVP/DANH_SACH_TAT_CA_56_TAI_KHOAN.md', 'w', encoding='utf-8') as f:
        f.writelines(all_56_markdown)
    print("Saved d:/PVP/DANH_SACH_TAT_CA_56_TAI_KHOAN.md")

    # Update live state on EC2
    live_state['participants'] = participants
    live_state['playerAccounts'] = all_56_accounts
    live_state['updatedAt'] = int(time.time() * 1000)

    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': live_state}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"Pushed all 56 accounts to EC2 (Status: {res.status})")

    # Save to scratch/all_56_accounts.json
    with open('d:/PVP/scratch/all_56_accounts.json', 'w', encoding='utf-8') as f:
        json.dump(all_56_accounts, f, ensure_ascii=False, indent=2)
    print("Saved scratch/all_56_accounts.json")

if __name__ == '__main__':
    main()
