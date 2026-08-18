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

    actual_sent_emails = {
        "death": {"email": "duythanh.dhsanh15a@gmail.com", "participantId": "p-c28"},
        "gin": {"email": "vietanh2644@gmail.com", "participantId": "p-c33"},
        "vyx": {"email": "trinhgiavy21@gmail.com", "participantId": "p-c18"},
        "hulk": {"email": "voquocthang18092005@gmail.com", "participantId": "p-b2"},
        "pain": {"email": "voquocthang18092005@gmail.com", "participantId": "p-b6"},
    }

    activated_count = 0
    unclaimed_count = 0

    for u, acc in accounts.items():
        if u in actual_sent_emails:
            acc['email'] = actual_sent_emails[u]['email']
            acc['claimedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ')
        else:
            if 'email' in acc:
                del acc['email']
            if 'claimedAt' in acc:
                del acc['claimedAt']

    for p_id, p in participants.items():
        u = p.get('username')
        matched_user = None
        for k, v in actual_sent_emails.items():
            if v['participantId'] == p_id or k == u:
                matched_user = k
                break

        if matched_user:
            p['claimed'] = True
            p['email'] = actual_sent_emails[matched_user]['email']
            activated_count += 1
            print(f"[ACTIVATED] {p_id} -> @{u}")
        else:
            p['claimed'] = False
            if 'email' in p:
                del p['email']
            unclaimed_count += 1

    print(f"Summary: {activated_count} Activated, {unclaimed_count} Ready/Unclaimed.")

    live_state['participants'] = participants
    live_state['playerAccounts'] = accounts
    live_state['updatedAt'] = int(time.time() * 1000)

    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': live_state}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"Successfully pushed clean state to EC2 (Status: {res.status})")

if __name__ == '__main__':
    main()
