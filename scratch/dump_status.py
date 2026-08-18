import json
import urllib.request

req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(req, timeout=6) as res:
    data = json.loads(res.read().decode('utf-8'))
    state = data['state']

participants = state.get('participants', {})
accounts = state.get('playerAccounts', {})

with open('scratch/participants_status.json', 'w', encoding='utf-8') as f:
    json.dump({
        'accounts': accounts,
        'participants': {p_id: {'name': p.get('name'), 'claimed': p.get('claimed'), 'username': p.get('username'), 'email': p.get('email')} for p_id, p in participants.items()}
    }, f, ensure_ascii=False, indent=2)

print("Saved participants_status.json successfully!")
