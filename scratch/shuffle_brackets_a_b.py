import urllib.request, json, random, math, datetime

def calculate_bracket_dimensions(count):
    if count < 2:
        return 1, 2, 0, 1
    total_rounds = math.ceil(math.log2(count))
    bracket_size = 2 ** total_rounds
    byes_count = bracket_size - count
    first_round_matches = bracket_size // 2
    return total_rounds, bracket_size, byes_count, first_round_matches

def get_round_name(r, total_rounds, is_third_place=False):
    if is_third_place:
        return 'Trận Tranh Hạng Ba'
    if r == total_rounds:
        return 'Chung Kết Đỉnh Cao'
    if r == total_rounds - 1 and total_rounds > 1:
        return 'Vòng Bán Kết'
    if r == total_rounds - 2 and total_rounds > 2:
        return 'Vòng Tứ Kết'
    if r == total_rounds - 3 and total_rounds > 3:
        return 'Vòng 1/8 (Vòng 16)'
    if r == total_rounds - 4 and total_rounds > 4:
        return 'Vòng 1/16 (Vòng 32)'
    return f'Vòng {r} (Sơ Loại)'

def generate_bracket(bracket_id, participants_list, randomize=True):
    count = len(participants_list)
    if count < 2:
        return {}

    total_rounds, bracket_size, byes_count, total_first_round_matches = calculate_bracket_dimensions(count)
    
    # Shuffle participants
    players = list(participants_list)
    if randomize:
        random.shuffle(players)

    slot_to_player = [None] * bracket_size
    match_has_bye = [False] * total_first_round_matches

    assigned_byes = 0
    # Step 1: Assign 1 bye per even match in R2 pairs (match 0, 2, 4, 6...)
    for i in range(0, total_first_round_matches, 2):
        if assigned_byes < byes_count:
            match_has_bye[i] = True
            assigned_byes += 1

    # Step 2: Assign remaining byes from the end
    for i in range(total_first_round_matches - 1, -1, -1):
        if not match_has_bye[i] and assigned_byes < byes_count:
            match_has_bye[i] = True
            assigned_byes += 1

    p_idx = 0
    for m in range(total_first_round_matches):
        s1 = m * 2
        s2 = m * 2 + 1
        if match_has_bye[m]:
            slot_to_player[s1] = players[p_idx] if p_idx < len(players) else None
            p_idx += 1
            slot_to_player[s2] = None
        else:
            slot_to_player[s1] = players[p_idx] if p_idx < len(players) else None
            p_idx += 1
            slot_to_player[s2] = players[p_idx] if p_idx < len(players) else None
            p_idx += 1

    # Pre-create match IDs
    round_match_ids = []
    for r in range(1, total_rounds + 1):
        matches_in_round = 2 ** (total_rounds - r)
        ids = [f"{bracket_id}-r{r}-m{m}" for m in range(matches_in_round)]
        round_match_ids.append(ids)

    third_place_id = f"{bracket_id}-third-place"
    matches = {}

    now = datetime.datetime.now(datetime.timezone.utc)

    for r in range(1, total_rounds + 1):
        matches_in_round = 2 ** (total_rounds - r)
        is_final = (r == total_rounds)
        is_semi = (r == total_rounds - 1 and total_rounds > 1)

        for m in range(matches_in_round):
            match_id = round_match_ids[r - 1][m]
            next_match_id = round_match_ids[r][m // 2] if not is_final else None
            loser_next_id = third_place_id if is_semi else None

            p1_id = None
            p2_id = None
            winner_id = None
            status = 'scheduled'

            if r == 1:
                p1 = slot_to_player[m * 2]
                p2 = slot_to_player[m * 2 + 1]
                p1_id = p1['id'] if p1 else None
                p2_id = p2['id'] if p2 else None

                if p1 and not p2:
                    winner_id = p1['id']
                    status = 'bye'
                elif not p1 and p2:
                    winner_id = p2['id']
                    status = 'bye'

            match_time = now + datetime.timedelta(hours=(r - 1) * 2, minutes=m * 30)
            
            matches[match_id] = {
                'id': match_id,
                'bracketId': bracket_id,
                'round': r,
                'roundName': get_round_name(r, total_rounds),
                'matchIndex': m,
                'player1Id': p1_id,
                'player2Id': p2_id,
                'player1Score': 0,
                'player2Score': 0,
                'winnerId': winner_id,
                'nextMatchId': next_match_id,
                'loserNextMatchId': loser_next_id,
                'scheduledTime': match_time.isoformat(),
                'status': status,
                'bestOf': 3 if is_final else 1,
                'refereeNote': 'Đặc cách tiến thẳng vòng sau (Bye)' if status == 'bye' else None
            }

    # 3rd Place Match
    if total_rounds >= 2:
        final_time = now + datetime.timedelta(hours=(total_rounds - 1) * 2, minutes=30)
        matches[third_place_id] = {
            'id': third_place_id,
            'bracketId': bracket_id,
            'round': total_rounds,
            'roundName': 'Trận Tranh Hạng Ba',
            'matchIndex': 99,
            'player1Id': None,
            'player2Id': None,
            'player1Score': 0,
            'player2Score': 0,
            'winnerId': None,
            'nextMatchId': None,
            'loserNextMatchId': None,
            'isThirdPlaceMatch': True,
            'scheduledTime': final_time.isoformat(),
            'status': 'scheduled',
            'bestOf': 3,
            'refereeNote': 'Tranh giải Ba giữa 2 đấu thủ dừng bước tại Bán Kết'
        }

    # Propagate Byes to R2
    for m in range(total_first_round_matches):
        r1_match = matches[round_match_ids[0][m]]
        if r1_match.get('status') == 'bye' and r1_match.get('winnerId') and r1_match.get('nextMatchId'):
            next_m = matches.get(r1_match['nextMatchId'])
            if next_m:
                if m % 2 == 0:
                    next_m['player1Id'] = r1_match['winnerId']
                else:
                    next_m['player2Id'] = r1_match['winnerId']

    return matches

# 1. Fetch current EC2 live state
req = urllib.request.Request('http://3.1.210.184/api/sync')
with urllib.request.urlopen(req, timeout=6) as res:
    state = json.loads(res.read().decode('utf-8'))['state']

participants = state['participants']
matches = state.get('matches', {})

# Filter real participants for bracket-a and bracket-b
part_a = [p for p in participants.values() if p.get('bracketId') == 'bracket-a' and not p.get('isGhost')]
part_b = [p for p in participants.values() if p.get('bracketId') == 'bracket-b' and not p.get('isGhost')]

print(f"Bracket A participants count: {len(part_a)}")
print(f"Bracket B participants count: {len(part_b)}")

# Generate newly shuffled matches for A & B
matches_a = generate_bracket('bracket-a', part_a, randomize=True)
matches_b = generate_bracket('bracket-b', part_b, randomize=True)

# Keep Bracket C matches intact
matches_c = {k: v for k, v in matches.items() if v.get('bracketId') == 'bracket-c'}

new_matches = {}
new_matches.update(matches_c)
new_matches.update(matches_a)
new_matches.update(matches_b)

state['matches'] = new_matches
state['updatedAt'] = 1786995000000

# Push to EC2 database
push_req = urllib.request.Request(
    'http://3.1.210.184/api/sync',
    data=json.dumps({'state': state}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(push_req, timeout=6) as res:
    print("Pushed shuffled Bracket A and B to EC2 status:", res.status)

# Update local backup
with open('backup_tournament_data_aws.json', 'w', encoding='utf-8') as f:
    json.dump(state, f, ensure_ascii=False, indent=2)

print("Local backup updated successfully!")
