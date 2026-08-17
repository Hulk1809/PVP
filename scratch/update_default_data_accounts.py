import json, re

with open('danh_sach_tai_khoan_tuyen_thu.json', 'r', encoding='utf-8') as f:
    claimed_accounts = json.load(f)

print(f"Loaded {len(claimed_accounts)} claimed accounts.")

with open('src/engine/defaultData.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Build INITIAL_PLAYER_ACCOUNTS object code
accounts_ts = "export const INITIAL_PLAYER_ACCOUNTS: Record<string, PlayerAccount> = " + json.dumps(claimed_accounts, ensure_ascii=False, indent=2) + ";\n\n"

# Replace import
code = re.sub(
    r"import \{ Bracket, BracketId, Participant, SectInfo \} from '\.\./types/tournament';",
    "import { Bracket, BracketId, Participant, SectInfo, PlayerAccount } from '../types/tournament';",
    code
)

# Insert INITIAL_PLAYER_ACCOUNTS before getInitialTournamentData
get_init_pattern = r"(export function getInitialTournamentData\(\) \{)"
replacement = accounts_ts + r"\1"
code = re.sub(get_init_pattern, replacement, code)

# Update return inside getInitialTournamentData to include playerAccounts
code = re.sub(
    r"return \{\s*brackets: DEFAULT_BRACKETS,\s*participants: participantsMap,\s*matches: matchesMap,\s*\};",
    "return {\n    brackets: DEFAULT_BRACKETS,\n    participants: participantsMap,\n    matches: matchesMap,\n    playerAccounts: { ...INITIAL_PLAYER_ACCOUNTS },\n  };",
    code
)

with open('src/engine/defaultData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated defaultData.ts with INITIAL_PLAYER_ACCOUNTS successfully!")
