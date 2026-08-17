import urllib.request
import json
import time

def reset_theanh():
    print("Fetching live EC2 state...")
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        data = json.loads(res.read().decode('utf-8'))
        state = data['state']

    # 1. Delete theanh account
    if 'theanh' in state.get('playerAccounts', {}):
        del state['playerAccounts']['theanh']
        print("[OK] Deleted playerAccount 'theanh'")

    # 2. Reset participant p-a2 (TheAnh)
    if 'p-a2' in state.get('participants', {}):
        p = state['participants']['p-a2']
        p['claimed'] = False
        p.pop('email', None)
        p.pop('username', None)
        print("[OK] Reset participant 'p-a2' claimed=False")

    # 3. Clear ban in match
    for m_id, m in state.get('matches', {}).items():
        if m.get('player1Id') == 'p-a2':
            m.pop('player1Ban', None)
            m.pop('player1BanTime', None)
            if 'bans' in m:
                m['bans'].pop('player1', None)
                m['bans'].pop('p-a2', None)
            print(f"[OK] Cleared player1 ban for TheAnh in match {m_id}")
        elif m.get('player2Id') == 'p-a2':
            m.pop('player2Ban', None)
            m.pop('player2BanTime', None)
            if 'bans' in m:
                m['bans'].pop('player2', None)
                m['bans'].pop('p-a2', None)
            print(f"[OK] Cleared player2 ban for TheAnh in match {m_id}")

    state['updatedAt'] = int(time.time() * 1000) + 1000000

    # 4. Push to EC2
    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': state}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"[SUCCESS] State pushed to EC2 (Status: {res.status})")

if __name__ == '__main__':
    reset_theanh()
