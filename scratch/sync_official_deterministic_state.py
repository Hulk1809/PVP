import urllib.request
import json
import math
import time

def calculate_bracket_dimensions(count):
    total_rounds = math.ceil(math.log2(count))
    bracket_size = 2 ** total_rounds
    byes_count = bracket_size - count
    return total_rounds, bracket_size, byes_count

def generate_tournament_bracket(bracket_id, participants):
    count = len(participants)
    total_rounds, bracket_size, byes_count = calculate_bracket_dimensions(count)
    total_first_round_matches = bracket_size // 2

    match_has_bye = [False] * total_first_round_matches
    assigned_byes = 0
    for i in range(0, total_first_round_matches, 2):
        if assigned_byes < byes_count:
            match_has_bye[i] = True
            assigned_byes += 1
    for i in range(total_first_round_matches - 1, -1, -1):
        if not match_has_bye[i] and assigned_byes < byes_count:
            match_has_bye[i] = True
            assigned_byes += 1

    slot_to_player = [None] * bracket_size
    p_idx = 0
    for m in range(total_first_round_matches):
        s1 = m * 2
        s2 = m * 2 + 1
        if match_has_bye[m]:
            slot_to_player[s1] = participants[p_idx]
            p_idx += 1
            slot_to_player[s2] = None
        else:
            slot_to_player[s1] = participants[p_idx]
            p_idx += 1
            slot_to_player[s2] = participants[p_idx]
            p_idx += 1

    matches = {}
    r1_match_ids = []
    third_place_match_id = f"{bracket_id}-third-place"

    # Round 1
    for m in range(total_first_round_matches):
        m_id = f"{bracket_id}-r1-m{m}"
        r1_match_ids.append(m_id)
        p1 = slot_to_player[m * 2]
        p2 = slot_to_player[m * 2 + 1]
        is_bye = match_has_bye[m]
        winner_id = p1['id'] if (is_bye and p1) else None

        round_name = "Vòng 1 (Vòng 1/32)" if total_rounds >= 6 else ("Vòng 1 (Vòng 1/16)" if total_rounds == 5 else "Vòng 1 (Tứ Kết)")
        time_hour = 14 + (m * 30) // 60
        time_min = (m * 30) % 60

        matches[m_id] = {
            "id": m_id,
            "bracketId": bracket_id,
            "round": 1,
            "matchIndex": m,
            "player1Id": p1['id'] if p1 else None,
            "player2Id": p2['id'] if p2 else None,
            "winnerId": winner_id,
            "status": "bye" if is_bye else "scheduled",
            "score": {"player1": 0, "player2": 0},
            "scheduledTime": f"2026-08-18T{time_hour:02d}:{time_min:02d}:00.000Z",
            "roundName": round_name,
            "boType": "Bo1",
            "bestOf": 1,
            "bans": {}
        }

    # Upper rounds
    prev_match_ids = r1_match_ids
    for r in range(2, total_rounds + 1):
        curr_match_ids = []
        num_matches = len(prev_match_ids) // 2
        is_final = (r == total_rounds)
        is_semi = (r == total_rounds - 1 and total_rounds > 1)
        round_name = "Vòng Chung Kết" if is_final else ("Vòng Bán Kết" if is_semi else f"Vòng {r}")
        
        for m in range(num_matches):
            m_id = f"{bracket_id}-r{r}-m{m}"
            curr_match_ids.append(m_id)
            
            p1_source = prev_match_ids[m * 2]
            p2_source = prev_match_ids[m * 2 + 1]
            
            p1_id = matches[p1_source].get('winnerId')
            p2_id = matches[p2_source].get('winnerId')
            
            time_hour = 14 + (r - 1) * 2
            time_min = (m * 30) % 60
            
            matches[m_id] = {
                "id": m_id,
                "bracketId": bracket_id,
                "round": r,
                "matchIndex": m,
                "player1Id": p1_id,
                "player2Id": p2_id,
                "winnerId": None,
                "status": "scheduled",
                "score": {"player1": 0, "player2": 0},
                "scheduledTime": f"2026-08-18T{time_hour:02d}:{time_min:02d}:00.000Z",
                "roundName": round_name,
                "boType": "Bo3" if is_final else "Bo1",
                "bestOf": 3 if is_final else 1,
                "loserNextMatchId": third_place_match_id if is_semi else None,
                "bans": {}
            }
            
            matches[p1_source]['nextMatchId'] = m_id
            matches[p2_source]['nextMatchId'] = m_id
            
        prev_match_ids = curr_match_ids

    # 3rd Place Match (Huy Chương Đồng)
    if total_rounds >= 2:
        matches[third_place_match_id] = {
            "id": third_place_match_id,
            "bracketId": bracket_id,
            "round": total_rounds,
            "roundName": "Trận Tranh Hạng Ba",
            "matchIndex": 99,
            "player1Id": None,
            "player2Id": None,
            "winnerId": None,
            "status": "scheduled",
            "score": {"player1": 0, "player2": 0},
            "scheduledTime": f"2026-08-18T{14 + total_rounds * 2:02d}:00:00.000Z",
            "boType": "Bo3",
            "bestOf": 3,
            "isThirdPlaceMatch": True,
            "refereeNote": "Tranh giải Ba giữa 2 đấu thủ dừng bước tại Bán Kết",
            "bans": {}
        }

    return matches

def main():
    print("Building full deterministic tournament state with 3rd place match...")
    
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=6) as res:
        live_state = json.loads(res.read().decode('utf-8'))['state']
        
    brackets = live_state.get('brackets', {})
    participants = live_state.get('participants', {})
    accounts = live_state.get('playerAccounts', {})
    lotus_winners = live_state.get('lotusWheelWinners', [])
    
    # Extract participants per bracket in the EXACT locked deterministic order
    a_ids = ['p-a3', 'p-a8', 'p-a1', 'p-a4', 'p-a9', 'p-a7', 'p-a2', 'p-a11', 'p-a6', 'p-a5']
    bracket_a_parts = [participants[aid] for aid in a_ids if aid in participants]
    
    b_ids = ['p-b9', 'p-b6', 'p-b8', 'p-b4', 'p-b5', 'p-b7', 'p-b10', 'p-b11', 'p-b2', 'p-b3', 'p-b1']
    bracket_b_parts = [participants[bid] for bid in b_ids if bid in participants]
    
    # Bracket C list (34 participants)
    c_ids = [
        'p-c4', 'p-c33', 'p-c8', 'p-c9', 'p-c6', 'p-c31', 'p-c20', 'p-c17', 'p-c2', 'p-c29',
        'p-c21', 'p-c27', 'p-c15', 'p-c18', 'p-c1', 'p-c24', 'p-c32', 'p-c16', 'p-c5', 'p-c26',
        'p-c14', 'p-c13', 'p-c7', 'p-c30', 'p-c3', 'p-c10', 'p-c11', 'p-c12', 'p-c19', 'p-c22',
        'p-c23', 'p-c25', 'p-c28', 'p-c34'
    ]
    bracket_c_parts = [participants[cid] for cid in c_ids if cid in participants]
    
    # Generate deterministic matches map
    matches_map = {}
    matches_map.update(generate_tournament_bracket('bracket-a', bracket_a_parts))
    matches_map.update(generate_tournament_bracket('bracket-b', bracket_b_parts))
    matches_map.update(generate_tournament_bracket('bracket-c', bracket_c_parts))
    
    payload = {
        'brackets': brackets,
        'participants': participants,
        'matches': matches_map,
        'playerAccounts': accounts,
        'lotusWheelWinners': lotus_winners,
        'updatedAt': int(time.time() * 1000) + 2000000
    }
    
    # Push to EC2
    push_req = urllib.request.Request(
        'http://3.1.210.184/api/sync',
        data=json.dumps({'state': payload}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(push_req, timeout=6) as res:
        print(f"Successfully pushed state with 3rd Place Match to EC2 (Status: {res.status})")

if __name__ == '__main__':
    main()
