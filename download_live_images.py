import urllib.request
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

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://alphalead.co.in/'
}

for fname, url in images.items():
    filepath = os.path.join(dest_dir, fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(filepath, 'wb') as out_f:
                out_f.write(data)
        print(f"SUCCESS: {fname} ({len(data)} bytes)")
    except Exception as e:
        print(f"FAILED: {fname} -> {e}")
