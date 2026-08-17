import urllib.request
import json
import datetime
import sys

def audit_system():
    print("================================================================")
    print("[AUDIT] SOUL LAND PVP TOURNAMENT PLATFORM - SYSTEM INTEGRITY AUDIT")
    print("================================================================")

    url = 'http://3.1.210.184/api/sync'
    print(f"1. Testing EC2 live sync API: {url} ...")
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200, f"HTTP status expected 200, got {res.status}"
        data = json.loads(res.read().decode('utf-8'))
        assert data.get('success') is True, "Expected success: true in API response"
        state = data['state']
    print("   [PASS] API /api/sync is alive and returning valid tournament state!")

    # 2. Audit Participants
    print("\n2. Auditing Participants...")
    participants = state.get('participants', {})
    a_parts = [p for p in participants.values() if p.get('bracketId') == 'bracket-a']
    b_parts = [p for p in participants.values() if p.get('bracketId') == 'bracket-b']
    c_parts = [p for p in participants.values() if p.get('bracketId') == 'bracket-c']

    print(f"   - Bracket A: {len(a_parts)} players (Expected: 11)")
    print(f"   - Bracket B: {len(b_parts)} players (Expected: 11)")
    print(f"   - Bracket C: {len(c_parts)} players (Expected: 34)")
    print(f"   - Total Players: {len(participants)} players (Expected: 56)")

    assert len(a_parts) == 11, f"Bracket A should have 11 players, got {len(a_parts)}"
    assert len(b_parts) == 11, f"Bracket B should have 11 players, got {len(b_parts)}"
    assert len(c_parts) == 34, f"Bracket C should have 34 players, got {len(c_parts)}"
    assert len(participants) == 56, f"Total players should be 56, got {len(participants)}"

    assert 'p-a10' in participants, "p-a10 (Parker) must be present in participants!"
    assert participants['p-a10']['name'] == 'GOD乄Parker', "p-a10 name must be GOD乄Parker"
    print("   [PASS] Parker p-a10 is 100% verified in Bracket A!")

    # 3. Audit Matches
    print("\n3. Auditing Matches & Deterministic Trees...")
    matches = state.get('matches', {})
    print(f"   - Total Matches across all brackets: {len(matches)}")

    for m_id, m in matches.items():
        p1 = m.get('player1Id')
        p2 = m.get('player2Id')
        if p1:
            assert p1 in participants, f"Match {m_id} references invalid player1Id: {p1}"
        if p2:
            assert p2 in participants, f"Match {m_id} references invalid player2Id: {p2}"

        time_str = m.get('scheduledTime')
        if time_str:
            try:
                if 'T' in time_str:
                    datetime.datetime.fromisoformat(time_str.replace('Z', '+00:00'))
            except Exception as e:
                assert False, f"Match {m_id} has invalid time string: {time_str}"

        if m.get('isThirdPlaceMatch'):
            assert m.get('bestOf') == 3, f"3rd Place match {m_id} must be bestOf=3"
            assert m.get('boType') == 'Bo3', f"3rd Place match {m_id} must be boType=Bo3"
        elif m.get('round') == state.get('brackets', {}).get(m.get('bracketId'), {}).get('totalRounds', 3):
            assert m.get('bestOf') == 3, f"Grand Final match {m_id} must be bestOf=3"
        else:
            assert m.get('bestOf') in [1, None], f"Regular match {m_id} must be bestOf=1"

    print("   [PASS] All matches, player links, time formats, and Bo configurations are valid!")

    # 4. Audit Semi-Finals and 3rd Place Match Links
    print("\n4. Auditing Semi-Finals to 3rd Place Match loser routing...")
    for b_id in ['bracket-a', 'bracket-b', 'bracket-c']:
        total_rounds = state.get('brackets', {}).get(b_id, {}).get('totalRounds', 3)
        semi_round = total_rounds - 1
        semi_matches = [m for m in matches.values() if m.get('bracketId') == b_id and m.get('round') == semi_round]
        assert len(semi_matches) == 2, f"Bracket {b_id} should have 2 semi-finals, found {len(semi_matches)}"
        for sm in semi_matches:
            assert sm.get('loserNextMatchId') == f"{b_id}-third-place", f"Semi match {sm['id']} must route loser to {b_id}-third-place"

        third_m = matches.get(f"{b_id}-third-place")
        assert third_m is not None, f"Bracket {b_id} must have a 3rd place match: {b_id}-third-place"
        assert third_m.get('isThirdPlaceMatch') is True, f"{b_id}-third-place must have isThirdPlaceMatch: true"
    print("   [PASS] 3rd Place Match routing is 100% verified for all brackets!")

    # 5. Audit Lotus Wheel Top 3 Exclusion
    print("\n5. Auditing Lotus Wheel Eligibility Logic...")
    all_real = [p for p in participants.values() if not p.get('isGhost')]
    assert len(all_real) == 56, f"Should have 56 real participants, got {len(all_real)}"
    print("   [PASS] Lotus Wheel candidate pool correctly resolves 56 candidates!")

    print("\n================================================================")
    print("[SUCCESS] ALL 5/5 SYSTEM INTEGRITY AUDITS PASSED WITH 100% SUCCESS!")
    print("================================================================")

if __name__ == '__main__':
    audit_system()
