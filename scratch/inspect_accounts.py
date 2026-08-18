import urllib.request
import json

def inspect_all():
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        data = json.loads(res.read().decode('utf-8'))
        state = data['state']

    participants = state.get('participants', {})
    accounts = state.get('playerAccounts', {})

    print(f"Total Participants: {len(participants)}")
    print(f"Total Player Accounts in store: {len(accounts)}")
    print(f"Account usernames in store: {list(accounts.keys())}")

    missing_in_accounts = []
    claimed_list = []
    unclaimed_list = []

    for p_id, p in participants.items():
        name = p.get('name')
        username = p.get('username') or name.lower().replace('god乄', '').replace('god.', '').replace('god', '').strip()
        has_acc = bool(p.get('claimed') or username in accounts)
        if has_acc:
            claimed_list.append((p_id, name, username, accounts.get(username, {}).get('email')))
        else:
            unclaimed_list.append((p_id, name, username))

    print(f"\n--- CLAIMED / HAS ACCOUNT ({len(claimed_list)}) ---")
    for item in claimed_list:
        print(f"  [CLAIMED] {item[0]}: {item[1]} -> username: {item[2]} (Email: {item[3]})")

    print(f"\n--- UNCLAIMED / NO ACCOUNT ({len(unclaimed_list)}) ---")
    for item in unclaimed_list:
        print(f"  [UNCLAIMED] {item[0]}: {item[1]} -> username: {item[2]}")

if __name__ == '__main__':
    inspect_all()
