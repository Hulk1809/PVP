import urllib.request, json

# 1. Fetch current live EC2 state
get_req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(get_req, timeout=6) as res:
    state = json.loads(res.read().decode('utf-8'))['state']

# 2. Find and undo ban for HULK (p-b2)
undone = False
for m_id, m in state.get('matches', {}).items():
    if (m.get('player1Id') == 'p-b2' or 'HULK' in str(m.get('player1Id'))) and m.get('player1Ban'):
        print(f"Undoing ban on match {m_id}: was {m.get('player1Ban')}")
        m.pop('player1Ban', None)
        m.pop('player1BanTime', None)
        undone = True
    if (m.get('player2Id') == 'p-b2' or 'HULK' in str(m.get('player2Id'))) and m.get('player2Ban'):
        print(f"Undoing ban on match {m_id}: was {m.get('player2Ban')}")
        m.pop('player2Ban', None)
        m.pop('player2BanTime', None)
        undone = True

state['updatedAt'] = 1786993000000

# 3. Push updated state to EC2
push_payload = {'state': state}
push_req = urllib.request.Request(
    'http://3.1.210.184/api/sync',
    data=json.dumps(push_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(push_req, timeout=6) as res:
    print("Undo Ban pushed to EC2 status:", res.status)

# 4. Update local backup
with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(state, f, ensure_ascii=False, indent=2)

print("Updated backup_tournament_data_aws.json successfully!")
