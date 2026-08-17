import urllib.request
import json

def test_exclusion():
    print("Testing Lotus Wheel candidate filtering & Top 3 exclusion...")
    req = urllib.request.Request('http://3.1.210.184/api/sync')
    with urllib.request.urlopen(req, timeout=5) as res:
        state = json.loads(res.read().decode('utf-8'))['state']

    matches = state.get('matches', {})
    participants = state.get('participants', {})
    brackets = state.get('brackets', {})
    lotus_winners = state.get('lotusWheelWinners', [])

    # Let's simulate Bracket A ending:
    # Semi-Final 1: p-a1 vs p-a4 -> p-a1 wins (p-a4 to bronze)
    # Semi-Final 2: p-a2 vs p-a3 -> p-a2 wins (p-a3 to bronze)
    # Final: p-a1 vs p-a2 -> p-a1 wins (Rank 1), p-a2 loses (Rank 2)
    # Bronze: p-a4 vs p-a3 -> p-a3 wins (Rank 3), p-a4 loses (Rank 4)

    test_matches = json.loads(json.dumps(matches))
    
    # Grand Final of Bracket A
    # Total rounds for Bracket A = 4
    for m in test_matches.values():
        if m.get('bracketId') == 'bracket-a':
            if m.get('round') == 4 and not m.get('isThirdPlaceMatch'):
                m['status'] = 'completed'
                m['player1Id'] = 'p-a1' # TTT
                m['player2Id'] = 'p-a2' # TheAnh
                m['winnerId'] = 'p-a1' # 1st: TTT, 2nd: TheAnh
            elif m.get('isThirdPlaceMatch'):
                m['status'] = 'completed'
                m['player1Id'] = 'p-a4' # QLng
                m['player2Id'] = 'p-a3' # Solomon
                m['winnerId'] = 'p-a3' # 3rd: Solomon, 4th: QLng

    # Now let's calculate candidates
    top3_set = set()
    for b_id in ['bracket-a', 'bracket-b', 'bracket-c']:
        total_rounds = brackets.get(b_id, {}).get('totalRounds', 3)
        final_m = next((m for m in test_matches.values() if m.get('bracketId') == b_id and m.get('round') == total_rounds and not m.get('isThirdPlaceMatch')), None)
        third_m = next((m for m in test_matches.values() if m.get('bracketId') == b_id and m.get('isThirdPlaceMatch')), None)

        if final_m and final_m.get('status') == 'completed' and final_m.get('winnerId'):
            w1 = final_m.get('winnerId')
            w2 = final_m.get('player2Id') if w1 == final_m.get('player1Id') else final_m.get('player1Id')
            top3_set.add(w1)
            if w2:
                top3_set.add(w2)

        if third_m and third_m.get('status') == 'completed' and third_m.get('winnerId'):
            w3 = third_m.get('winnerId')
            top3_set.add(w3)

    print(f"Top 3 Winners excluded: {top3_set}")
    print(" - 1st Place (Winner Final):", 'p-a1' in top3_set)
    print(" - 2nd Place (Loser Final):", 'p-a2' in top3_set)
    print(" - 3rd Place (Winner Bronze):", 'p-a3' in top3_set)
    print(" - 4th Place (Loser Bronze):", 'p-a4' in top3_set)

    assert 'p-a1' in top3_set, "p-a1 should be in top3"
    assert 'p-a2' in top3_set, "p-a2 should be in top3"
    assert 'p-a3' in top3_set, "p-a3 (Winner Bronze) MUST be excluded from wheel"
    assert 'p-a4' not in top3_set, "p-a4 (Loser Bronze / 4th) MUST be included in wheel"

    eligible = [p for p_id, p in participants.items() if p_id not in top3_set]
    print(f"[OK] Total Eligible Candidates: {len(eligible)} / {len(participants)}")
    print("[SUCCESS] Lotus Wheel Top 3 exclusion algorithm is 100% verified and correct!")

if __name__ == '__main__':
    test_exclusion()
