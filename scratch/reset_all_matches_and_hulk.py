import urllib.request, json, os

# 1. Fetch current EC2 live state
req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(req, timeout=6) as res:
    state = json.loads(res.read().decode('utf-8'))['state']

matches = state.get('matches', {})
participants = state.get('participants', {})
playerAccounts = state.get('playerAccounts', {})

print(f"Total matches before reset: {len(matches)}")

# 2. Reset matches
for m_id, m in matches.items():
    r = m.get('round', 1)
    is_third = m.get('isThirdPlaceMatch', False)

    # Clear all bans
    m.pop('player1Ban', None)
    m.pop('player1BanTime', None)
    m.pop('player2Ban', None)
    m.pop('player2BanTime', None)

    # Reset scores
    m['player1Score'] = 0
    m['player2Score'] = 0

    if r == 1:
        p1 = m.get('player1Id')
        p2 = m.get('player2Id')
        if p1 and not p2:
            m['status'] = 'bye'
            m['winnerId'] = p1
        elif not p1 and p2:
            m['status'] = 'bye'
            m['winnerId'] = p2
        else:
            m['status'] = 'scheduled'
            m['winnerId'] = None
    else:
        # Rounds 2, 3, 4 & 3rd place
        m['status'] = 'scheduled'
        m['winnerId'] = None
        m['player1Id'] = None
        m['player2Id'] = None

# Propagate Round 1 Byes to Round 2
for m_id, m in matches.items():
    if m.get('round') == 1 and m.get('status') == 'bye' and m.get('winnerId') and m.get('nextMatchId'):
        next_m = matches.get(m['nextMatchId'])
        if next_m:
            m_idx = m.get('matchIndex', 0)
            if m_idx % 2 == 0:
                next_m['player1Id'] = m['winnerId']
            else:
                next_m['player2Id'] = m['winnerId']

# 3. Delete HULK account and unclaim participant
if 'hulk' in playerAccounts:
    del playerAccounts['hulk']
    print("Deleted 'hulk' from playerAccounts.")

for p_id, p in participants.items():
    if p.get('name') == 'GOD乄HULK' or p.get('username') == 'hulk' or p_id == 'p-b2':
        p['claimed'] = False
        p.pop('username', None)
        p.pop('email', None)
        print(f"Unclaimed participant {p_id} (HULK).")

state['matches'] = matches
state['participants'] = participants
state['playerAccounts'] = playerAccounts
state['updatedAt'] = 1787000000000

# 4. Push updated state to EC2
push_payload = {'state': state}
push_req = urllib.request.Request(
    'http://3.1.210.184/api/sync',
    data=json.dumps(push_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(push_req, timeout=6) as res:
    print("Pushed clean tournament state to EC2 status:", res.status)

# 5. Update local backup files
with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(state, f, ensure_ascii=False, indent=2)

with open('danh_sach_tai_khoan_tuyen_thu.json', 'r', encoding='utf-8') as f:
    accs = json.load(f)
if 'hulk' in accs:
    del accs['hulk']
with open('danh_sach_tai_khoan_tuyen_thu.json', 'w', encoding='utf-8') as f:
    json.dump(accs, f, ensure_ascii=False, indent=2)

print("Local backup files updated successfully!")
