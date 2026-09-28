from bs4 import BeautifulSoup
import sys

def parse_page(filename):
    print(f"\n=================== {filename} ===================")
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    print("Title:", soup.title.string if soup.title else "No title")
    
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4'])
    print("Headings:")
    for h in headings[:25]:
        t = h.get_text(strip=True)
        if t:
            print(f"  {h.name}: {t}")
            
    # Images
    imgs = set()
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src')
        if src and 'uploads' in src:
            imgs.add(src)
    print("Images found:")
    for im in list(imgs)[:10]:
        print("  ", im)

parse_page('defence_page.html')
parse_page('corporate_page.html')
