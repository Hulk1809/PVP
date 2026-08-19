import subprocess

cmd = """sudo grep -E "POST /api/sync|POST /api/send-account" /var/log/nginx/access.log | tail -n 50"""

res = subprocess.run([
    'ssh', '-i', r'd:\PVP\HULK1809.pem', '-o', 'StrictHostKeyChecking=no',
    'ec2-user@3.1.210.184', cmd
], capture_output=True, text=True)

print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
