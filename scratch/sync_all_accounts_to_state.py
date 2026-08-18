import urllib.request
import json
import time

def normalize_name(n):
    return n.lower().replace('god乄', '').replace('god.', '').replace('god-', '').replace('god', '').replace(' ', '').strip()

def sync_accounts():
    print("Fetching live EC2 state...")
    
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        live_state = json.loads(res.read().decode('utf-8'))['state']
        
    participants = live_state.get('participants', {})
    player_accounts = live_state.get('playerAccounts', {})
    
    all_known_accounts = {
        "ta": {"playerName": "GOD乄Tà", "username": "ta", "password": "tadocco", "email": "dongtam9555@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "solomon": {"playerName": "GOD乄Solomon", "username": "solomon", "password": "solomonkiemtien", "email": "minhtrian0706@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "vulan": {"playerName": "GOD乄Vũ Lân", "username": "vulan", "password": "vulanmahoang", "email": "Quatlam2024@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "gau": {"playerName": "GOD乄Gấu", "username": "gau", "password": "gaudocco", "email": "Sygau1995@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "hades": {"playerName": "GOD乄Hades", "username": "hades", "password": "hadestop1", "email": "luulinhfacebookads@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "tit": {"playerName": "GOD乄Tít", "username": "tit", "password": "tittuthandao", "email": "ducthuan2002nd@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "tea": {"playerName": "GOD乄Tea", "username": "tea", "password": "teadeptrai", "email": "test.tea@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "huynh": {"playerName": "GOD乄Huynh", "username": "huynh", "password": "huynhbachthieu", "email": "huynhvipboy5@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "mahoang": {"playerName": "GOD乄MaHoàng", "username": "mahoang", "password": "mahoangbachthieu", "email": "wlink1611@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "giangne": {"playerName": "GOD乄Giangnè", "username": "giangne", "password": "giangnetop2", "email": "gh5766420@gmail.com", "bracketName": "Bảng B (Tối Thượng < 10)"},
        "heo": {"playerName": "GOD乄Héo", "username": "heo", "password": "heothanma", "email": "dotronghieu140620053@gmail.com", "bracketName": "Bảng B (Tối Thượng < 10)"},
        "men": {"playerName": "GOD乄Mèn", "username": "men", "password": "mentranhba", "email": "phuctkdpro@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "qlng": {"playerName": "GOD乄QLng", "username": "qlng", "password": "qlngkiemtien", "email": "minhhuy7001@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "goodluck": {"playerName": "GOD乄GoodLuck", "username": "goodluck", "password": "goodlucktuyettrieu", "email": "bqhuy0846446@gmail.com", "bracketName": "Bảng B (Tối Thượng < 10)"},
        "yulyn": {"playerName": "GOD乄YuLyn", "username": "yulyn", "password": "yulynbatbai", "email": "yulyn2205@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "hung": {"playerName": "GOD乄Hung", "username": "hung", "password": "hungchiensi", "email": "iamhung1706@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "lucky": {"playerName": "GOD乄Lucky", "username": "lucky", "password": "luckysieucap", "email": "hoanghai2909@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "ttt": {"playerName": "GOD乄TTT", "username": "ttt", "password": "tttlongthan", "email": "thaithien010104@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "hulk": {"playerName": "GOD乄HULK", "username": "hulk", "password": "hulkveque", "email": "voquocthang18092005@gmail.com", "bracketName": "Bảng B (Tối Thượng < 10)"},
        "jetjet": {"playerName": "GOD乄JetJet", "username": "jetjet", "password": "jetjetquangthan", "email": "boycunli@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "god": {"playerName": "GOD乄ĐẾ", "username": "god", "password": "godhonsu99", "email": "kientq888@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "daim": {"playerName": "GOD乄Daim", "username": "daim", "password": "daimvotri", "email": "hoanglong.147@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "diem": {"playerName": "GOD乄Diệm", "username": "diem", "password": "diemdeptrai", "email": "tantai.21082005@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "darkness": {"playerName": "GOD乄Darkness", "username": "darkness", "password": "darknessbachthieu", "email": "tranminhhieu11a3ntt@gmail.com", "bracketName": "Bảng A (Tối Thượng > 50)"},
        "pain": {"playerName": "GOD乄Pain", "username": "pain", "password": "painthanthoai", "email": "voquocthang18092005@gmail.com", "bracketName": "Bảng B (Tối Thượng < 10)"},
        "vyx": {"playerName": "GOD乄VYX", "username": "vyx", "password": "vyxkiemtien", "email": "trinhgiavy21@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "gin": {"playerName": "GOD乄Gin", "username": "gin", "password": "gintuthandao", "email": "vietanh2644@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
        "death": {"playerName": "GOD乄DEATH", "username": "death", "password": "deaththanma", "email": "duythanh.dhsanh15a@gmail.com", "bracketName": "Bảng C (Rực Rỡ Trở Xuống)"},
    }
    
    for u, acc in all_known_accounts.items():
        if u not in player_accounts:
            player_accounts[u] = acc
        else:
            player_accounts[u].update(acc)
            
    matched_count = 0
    for p_id, p in participants.items():
        p_name = p.get('name', '')
        p_norm = normalize_name(p_name)
        
        matched_acc = None
        for u, acc in all_known_accounts.items():
            if u == p_norm or normalize_name(acc['playerName']) == p_norm:
                matched_acc = acc
                break
                
        if matched_acc:
            p['claimed'] = True
            p['username'] = matched_acc['username']
            p['email'] = matched_acc['email']
            matched_count += 1
            print(f"[OK] Matched: {p_id} -> username: {matched_acc['username']}")

    print(f"Total Activated Participants: {matched_count} / {len(participants)}")
    
    live_state['participants'] = participants
    live_state['playerAccounts'] = player_accounts
    live_state['updatedAt'] = int(time.time() * 1000) + 6000000
    
    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': live_state}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"Successfully pushed synchronized accounts state to EC2 (Status: {res.status})")

if __name__ == '__main__':
    sync_accounts()
