import urllib.request
import json
import time

def main():
    print("Fetching live EC2 state...")
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        live_state = json.loads(res.read().decode('utf-8'))['state']

    participants = live_state.get('participants', {})
    accounts = live_state.get('playerAccounts', {})

    # Full list of 28 accounts that actually received emails
    all_28_sent_emails = {
        # Bảng A (8 players)
        "solomon": {"email": "minhtrian0706@gmail.com", "password": "solomonkiemtien", "p_id": "p-a3"},
        "ttt": {"email": "thaithien010104@gmail.com", "password": "tttlongthan", "p_id": "p-a1"},
        "qlng": {"email": "minhhuy7001@gmail.com", "password": "qlngkiemtien", "p_id": "p-a4"},
        "men": {"email": "phuctkdpro@gmail.com", "password": "mentranhba", "p_id": "p-a9"},
        "lucky": {"email": "hoanghai2909@gmail.com", "password": "luckysieucap", "p_id": "p-a7"},
        "gau": {"email": "Sygau1995@gmail.com", "password": "gaudocco", "p_id": "p-a11"},
        "tea": {"email": "test.tea@gmail.com", "password": "teadeptrai", "p_id": "p-a6"},
        "darkness": {"email": "tranminhhieu11a3ntt@gmail.com", "password": "darknessbachthieu", "p_id": "p-a5"},

        # Bảng B (5 players)
        "pain": {"email": "voquocthang18092005@gmail.com", "password": "painthanthoai", "p_id": "p-b6"},
        "goodluck": {"email": "bqhuy0846446@gmail.com", "password": "goodlucktuyettrieu", "p_id": "p-b8"},
        "giangne": {"email": "gh5766420@gmail.com", "password": "giangnetop2", "p_id": "p-b4"},
        "hulk": {"email": "voquocthang18092005@gmail.com", "password": "hulkveque", "p_id": "p-b2"},
        "heo": {"email": "dotronghieu140620053@gmail.com", "password": "heothanma", "p_id": "p-b1"},

        # Bảng C (15 players)
        "ta": {"email": "dongtam9555@gmail.com", "password": "tadocco", "p_id": "p-c14"},
        "vulan": {"email": "Quatlam2024@gmail.com", "password": "vulanmahoang", "p_id": "p-c19"},
        "hades": {"email": "luulinhfacebookads@gmail.com", "password": "hadestop1", "p_id": "p-c31"},
        "tit": {"email": "ducthuan2002nd@gmail.com", "password": "tittuthandao", "p_id": "p-c23"},
        "huynh": {"email": "huynhvipboy5@gmail.com", "password": "huynhbachthieu", "p_id": "p-c25"},
        "mahoang": {"email": "wlink1611@gmail.com", "password": "mahoangbachthieu", "p_id": "p-c30"},
        "yulyn": {"email": "yulyn2205@gmail.com", "password": "yulynbatbai", "p_id": "p-c12"},
        "hung": {"email": "iamhung1706@gmail.com", "password": "hungchiensi", "p_id": "p-c7"},
        "jetjet": {"email": "boycunli@gmail.com", "password": "jetjetquangthan", "p_id": "p-c29"},
        "god": {"email": "kientq888@gmail.com", "password": "godhonsu99", "p_id": "p-c9"},
        "daim": {"email": "hoanglong.147@gmail.com", "password": "daimvotri", "p_id": "p-c21"},
        "diem": {"email": "tantai.21082005@gmail.com", "password": "diemdeptrai", "p_id": "p-c26"},
        "vyx": {"email": "trinhgiavy21@gmail.com", "password": "vyxkiemtien", "p_id": "p-c18"},
        "gin": {"email": "vietanh2644@gmail.com", "password": "gintuthandao", "p_id": "p-c33"},
        "death": {"email": "duythanh.dhsanh15a@gmail.com", "password": "deaththanma", "p_id": "p-c28"},
    }

    claimed_by_id = {v['p_id']: (k, v) for k, v in all_28_sent_emails.items()}

    claimed_count = 0
    unclaimed_count = 0

    for p_id, p in participants.items():
        if p_id in claimed_by_id:
            u, info = claimed_by_id[p_id]
            p['username'] = u
            p['claimed'] = True
            p['email'] = info['email']
            
            if u in accounts:
                accounts[u]['email'] = info['email']
                accounts[u]['password'] = info['password']
                accounts[u]['claimedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ')
            claimed_count += 1
        else:
            u = p.get('username')
            p['claimed'] = False
            if 'email' in p:
                del p['email']
            if u and u in accounts and 'email' in accounts[u]:
                del accounts[u]['email']
            if u and u in accounts and 'claimedAt' in accounts[u]:
                del accounts[u]['claimedAt']
            unclaimed_count += 1

    print(f"Total Participants: {len(participants)}")
    print(f"Total Pre-seeded Accounts: {len(accounts)}")
    print(f"Claimed (Activated with Email): {claimed_count}")
    print(f"Unclaimed (Ready for Email Claim): {unclaimed_count}")

    live_state['participants'] = participants
    live_state['playerAccounts'] = accounts
    live_state['updatedAt'] = int(time.time() * 1000)

    # Push to EC2
    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': live_state}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"Successfully pushed 28 activated + 28 ready accounts to EC2 (Status: {res.status})")

if __name__ == '__main__':
    main()
