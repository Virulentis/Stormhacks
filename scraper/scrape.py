# -*- coding: utf-8 -*-
"""
Unified Trading Card Scraper
----------------------------
Scrapes Pokémon card listings from:
- FaceToFaceGames
- 401Games
- KanataCG

Output format is fully compatible with the C++ backend model.
"""

import os, json, re, time, requests
from bs4 import BeautifulSoup
from datetime import datetime

SAVE_PATH = "/Users/charlottegao/hacker/data/all_cards.json"
QUERIES = ["charizard", "pikachu", "mewtwo", "gengar", "eevee", "snorlax"]
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

os.makedirs(os.path.dirname(SAVE_PATH), exist_ok=True)


def now():
    """Return current UTC timestamp as string."""
    return datetime.utcnow().isoformat()


def fetch_json(url):
    """Fetch a JSON API endpoint safely."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"[!] JSON fetch failed: {e}")
    return None


def fetch_html(url):
    """Fetch an HTML page safely."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            return r.text
    except Exception as e:
        print(f"[!] HTML fetch failed: {e}")
    return ""


# -------------------------------
# FaceToFaceGames scraper
# -------------------------------
def scrape_facetoface(query):
    print(f"[FaceToFaceGames] Searching for '{query}' ...")
    url = f"https://facetofacegames.com/search/suggest.json?q={query}"
    data = fetch_json(url)
    if not data:
        print("  → No data returned.")
        return []
    products = data.get("resources", {}).get("results", {}).get("products", [])
    results = []

    for p in products:
        title = p.get("title", "")
        price = p.get("price_min", 0.0)
        # Ensure numeric
        try:
            price = float(price)
        except:
            price = 0.0

        results.append({
            "Name": title,
            "Card Condition": "Near Mint",
            "Price": price,
            "Stock": "In Stock" if p.get("available", False) else "Out of Stock",
            "Retailer": "FaceToFaceGames",
            "Edition": p.get("type", "Singles"),
            "Foil": "true" if ("Holo" in title or "Shiny" in title) else "false",
            "Art Card": "true" if "Art" in title else "false"
        })
    print(f"  → {len(results)} cards found.")
    return results


# -------------------------------
# 401Games scraper
# -------------------------------
def scrape_401games(query):
    print(f"[401Games] Searching for '{query}' ...")
    url = f"https://store.401games.ca/search?q={query}&type=product"
    html = fetch_html(url)
    if not html:
        print("  → No HTML returned.")
        return []
    soup = BeautifulSoup(html, "html.parser")
    results = []

    for a in soup.select("a.title"):
        name = a.text.strip()
        price_tag = a.find_next("span", class_="price-item")
        price = 0.0
        if price_tag:
            price_text = re.sub(r"[^\d.]", "", price_tag.text)
            try:
                price = float(price_text)
            except:
                price = 0.0

        results.append({
            "Name": name,
            "Card Condition": "Near Mint",
            "Price": price,
            "Stock": "Unknown",
            "Retailer": "401Games",
            "Edition": "Unknown",
            "Foil": "true" if ("Holo" in name or "Shiny" in name) else "false",
            "Art Card": "true" if "Art" in name else "false"
        })
    print(f"  → {len(results)} cards found.")
    return results


# -------------------------------
# KanataCG scraper
# -------------------------------
def scrape_kanatacg(query):
    print(f"[KanataCG] Searching for '{query}' ...")
    url = f"https://kanatacg.crystalcommerce.com/search/autocomplete?q={query}"
    results = []
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200 and r.text.startswith("["):
            names = json.loads(r.text)
            for n in names:
                results.append({
                    "Name": n,
                    "Card Condition": "Unknown",
                    "Price": 0.0,
                    "Stock": "Unknown",
                    "Retailer": "KanataCG",
                    "Edition": "Unknown",
                    "Foil": "true" if ("Holo" in n or "Shiny" in n) else "false",
                    "Art Card": "true" if "Art" in n else "false"
                })
    except Exception as e:
        print(f"[!] KanataCG fetch failed: {e}")
    print(f"  → {len(results)} cards found.")
    return results


# -------------------------------
# Unified Main Execution
# -------------------------------
def main():
    all_cards = []
    for q in QUERIES:
        all_cards.extend(scrape_facetoface(q))
        all_cards.extend(scrape_401games(q))
        all_cards.extend(scrape_kanatacg(q))
        time.sleep(1)  # avoid rate-limiting

    # Save compatible JSON array
    with open(SAVE_PATH, "w", encoding="utf-8") as f:
        json.dump(all_cards, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_cards)} cards -> {SAVE_PATH}")


if __name__ == "__main__":
    start = time.time()
    main()
    print(f"\nDone in {time.time() - start:.2f}s")