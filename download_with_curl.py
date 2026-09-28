import subprocess
import os

images = {
    'logo.png': 'https://alphalead.co.in/wp-content/uploads/2019/02/cropped-Alpha-Lead-Academy-Logo-Small-e1781668821297.png',
    'founder-abhinav.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-18-at-14.22.48-1.webp',
    'founder-namrata.webp': 'https://alphalead.co.in/wp-content/uploads/2026/08/co-founder-alpha-lead.webp',
    'defence-entrance.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/defence-entrance.webp',
    'corporate-training.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/Alpha-lead-corporate-leadership-training.webp',
    'career-launchpad.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/Alphalead-career-launch-pad.webp',
    'ssb-dormitory.jpg': 'https://alphalead.co.in/wp-content/uploads/2026/07/SSB-Dormitory-Mysuru.jpg',
    'vision-mission.webp': 'https://alphalead.co.in/wp-content/uploads/2026/07/Alpha-lead-vision-and-mission.webp',
}

dest_dir = r'assets\images\live'
os.makedirs(dest_dir, exist_ok=True)

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

for fname, url in images.items():
    out_path = os.path.join(dest_dir, fname)
    cmd = ['curl.exe', '-s', '-A', ua, '-e', 'https://alphalead.co.in/', url, '-o', out_path]
    print(f"Downloading {fname}...")
    res = subprocess.run(cmd)
    if os.path.exists(out_path):
        size = os.path.getsize(out_path)
        print(f"  -> Saved {out_path} ({size} bytes)")
    else:
        print(f"  -> Failed: {fname}")

print("Done downloading all live assets!")
