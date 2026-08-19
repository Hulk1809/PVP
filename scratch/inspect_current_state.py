import urllib.request
import json

req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(req, timeout=6) as res:
    data = json.loads(res.read().decode('utf-8'))
    state = data['state']

print("updatedAt timestamp:", state.get('updatedAt'))
parts = state.get('participants', {})
matches = state.get('matches', {})
accounts = state.get('playerAccounts', {})

print(f"Participants: {len(parts)}")
print(f"Matches: {len(matches)}")
print(f"Accounts: {len(accounts)}")

# Check bans in all matches
bans = []
for mid, m in matches.items():
    if m.get('player1Ban') or m.get('player2Ban'):
        bans.append({
            'mid': mid,
            'p1': m.get('player1Id'),
            'p1Ban': m.get('player1Ban'),
            'p2': m.get('player2Id'),
            'p2Ban': m.get('player2Ban')
        })

print(f"Matches with bans: {len(bans)}")
for b in bans:
    print(" ", b)

# Check claimed participants
claimed = [p for p in parts.values() if p.get('claimed')]
print(f"Claimed participants: {len(claimed)}")
for p in claimed:
    print(f"  {p.get('id')} ({p.get('name')}): @{p.get('username')} -> {p.get('email')}")
