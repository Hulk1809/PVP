import urllib.request
import json

req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(req, timeout=6) as res:
    data = json.loads(res.read().decode('utf-8'))
    state = data['state']

matches = state.get('matches', {})
bans = []
for mid, m in matches.items():
    if m.get('player1Ban') or m.get('player2Ban'):
        bans.append((mid, m.get('player1Id'), m.get('player1Ban'), m.get('player2Id'), m.get('player2Ban')))

print(f"Total matches: {len(matches)}")
print(f"Matches with bans: {len(bans)}")
for b in bans:
    print(" ", b)
