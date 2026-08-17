import json
import os

path = '/var/www/soul-land-pvp/data/tournament_accounts.json'
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if 'theanh' in data:
        del data['theanh']
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Cleaned theanh from EC2 tournament_accounts.json")
    else:
        print("theanh was not in tournament_accounts.json")
else:
    print("tournament_accounts.json does not exist yet")
