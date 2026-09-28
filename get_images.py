import re
import urllib.request
import os

with open(r'C:\Users\abhir\.gemini\antigravity-ide\brain\b3a3e6e1-f546-4112-b8af-e11fdd1219ff\.system_generated\steps\65\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

urls = re.findall(r'https?://[^\s"\'<>)]+', text)
img_urls = set()
for u in urls:
    if any(ext in u.lower() for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg']):
        img_urls.add(u)

print("Found image URLs:")
for u in sorted(img_urls):
    print(u)
