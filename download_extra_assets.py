import subprocess
import os

images = {
    'gajendran.png': 'https://alphalead.co.in/wp-content/uploads/2026/09/Psych-Gajendran.png',
    'balaji-air1.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_1.png',
    'rec-2.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_2.png',
    'rec-4.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_4.png',
    'rec-5.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_5.png',
    'rec-7.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_7.png',
    'rec-10.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_10.png',
    'rec-11.png': 'https://alphalead.co.in/wp-content/uploads/2026/01/Rec_11.png',
    'kishan.png': 'https://alphalead.co.in/wp-content/uploads/2026/02/kishan.png',
    'anudeep.png': 'https://alphalead.co.in/wp-content/uploads/2026/02/anudeep.png',
    'corp-cxo.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/corporate-Founders-CEOs-and-CXOs.webp',
    'corp-hr.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/corporate-HR-and-L-and-D-heads.webp',
    'corp-managers.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/corporate-first-time-managers-and-new-professionals.webp',
    'corp-startups.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/startups-smes-and-growing-business.webp',
    'corp-clarity.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/senior-leadership-clarity.webp',
    'corp-approach.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/alpha-lead-approach.webp',
}

dest_dir = r'assets\images\live'
os.makedirs(dest_dir, exist_ok=True)
ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

for fname, url in images.items():
    out_path = os.path.join(dest_dir, fname)
    if not os.path.exists(out_path):
        cmd = ['curl.exe', '-s', '-A', ua, '-e', 'https://alphalead.co.in/', url, '-o', out_path]
        subprocess.run(cmd)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
            print(f"Downloaded {fname}: {os.path.getsize(out_path)} bytes")
        else:
            print(f"Failed or empty: {fname}")
    else:
        print(f"Already exists: {fname}")

print("Faculty & corporate assets check complete!")
