import urllib.request, json, os

# 1. Fetch current live EC2 state
get_req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(get_req, timeout=6) as res:
    state = json.loads(res.read().decode('utf-8'))['state']

# 2. Clear all test bans across all matches
cleared_bans = 0
for m_id, m in state.get('matches', {}).items():
    if m.get('player1Ban') or m.get('player2Ban'):
        m.pop('player1Ban', None)
        m.pop('player1BanTime', None)
        m.pop('player2Ban', None)
        m.pop('player2BanTime', None)
        cleared_bans += 1

print(f"Cleared bans on {cleared_bans} matches.")

# 3. Reset HULK account (remove from playerAccounts and unclaim in participants)
if 'hulk' in state.get('playerAccounts', {}):
    del state['playerAccounts']['hulk']
    print("Removed hulk from playerAccounts.")

for p_id, p in state.get('participants', {}).items():
    if p.get('name') == 'GOD乄HULK' or p.get('username') == 'hulk' or p_id == 'p-b2':
        p['claimed'] = False
        p.pop('username', None)
        p.pop('email', None)
        print(f"Unclaimed participant {p_id} (HULK).")

state['updatedAt'] = 1786990000000

# 4. Push updated clean state to EC2
push_payload = {'state': state}
push_req = urllib.request.Request(
    'http://3.1.210.184/api/sync',
    data=json.dumps(push_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(push_req, timeout=6) as res:
    print("Pushed clean state to EC2 status:", res.status)

# 5. Also update local backup file
with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(state, f, ensure_ascii=False, indent=2)

with open('danh_sach_tai_khoan_tuyen_thu.json', 'r', encoding='utf-8') as f:
    accs = json.load(f)
if 'hulk' in accs:
    del accs['hulk']
with open('danh_sach_tai_khoan_tuyen_thu.json', 'w', encoding='utf-8') as f:
    json.dump(accs, f, ensure_ascii=False, indent=2)

print("Local backup files updated successfully!")
