import json

with open('d:/PVP/scratch/all_56_accounts.json', 'r', encoding='utf-8') as f:
    accounts = json.load(f)

# Clean accounts so email and claimedAt are not null
clean_accounts = {}
for u, acc in accounts.items():
    clean_acc = {
        "id": acc["id"],
        "participantId": acc["participantId"],
        "playerName": acc["playerName"],
        "username": acc["username"],
        "password": acc["password"],
        "bracketName": acc["bracketName"],
    }
    if acc.get("email"):
        clean_acc["email"] = acc["email"]
    if acc.get("claimedAt"):
        clean_acc["claimedAt"] = acc["claimedAt"]
    clean_accounts[u] = clean_acc

with open('d:/PVP/src/engine/defaultData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "export const INITIAL_PLAYER_ACCOUNTS: Record<string, PlayerAccount> = "
end_marker = "export function getInitialTournamentData()"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    acc_json_str = json.dumps(clean_accounts, ensure_ascii=False, indent=2)
    new_content = content[:start_idx + len(start_marker)] + acc_json_str + ";\n\n" + content[end_idx:]
    with open('d:/PVP/src/engine/defaultData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated src/engine/defaultData.ts without null values!")
else:
    print("Could not find markers in src/engine/defaultData.ts")
