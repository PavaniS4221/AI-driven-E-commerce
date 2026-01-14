import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import random
import heapq
from pymongo import MongoClient

# ---------------- MongoDB Setup ----------------
client = MongoClient("mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net")
db = client["test"]
product_collection = db["products"]
order_collection = db["orders"]

# ---------------- Serialization ----------------
def serialize_mongo_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# ---------------- Transactions ----------------
def get_bundle_transactions(event):
    """
    Get transactions for Apriori: only orders with isBundle=True and matching event
    Returns list of list of item names
    """
    orders = list(order_collection.find({"isBundle": True, "event": event}))
    transactions = [o["items"] for o in orders if len(o.get("items", [])) >= 2]
    return transactions

# ---------------- Association Rules ----------------
def generate_association_rules_from_transactions(transactions, min_support=0.01, min_confidence=0.2):
    if not transactions:
        return pd.DataFrame()  # no rules

    # one-hot encode using item names
    all_items = set(item["name"] for t in transactions for item in t)
    df = pd.DataFrame([{item: (any(i["name"] == item for i in t)) for item in all_items} for t in transactions])

    frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
    if frequent_itemsets.empty:
        return pd.DataFrame()
    
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
    return rules


# ---------------- Build association map ----------------
def build_association_map(rules_df):
    assoc_map = {}
    for _, row in rules_df.iterrows():
        for antecedent in row['antecedents']:
            assoc_map.setdefault(antecedent, set()).update(row['consequents'])
    return assoc_map

# ---------------- Scoring ----------------
def score_product(product, payload):
    score = 0

    # Event relevance
    if payload.get("event") in product.get("event", []):
        score += 5

    # Tags match
    product_tags = set(map(str.lower, product.get("tags", [])))
    payload_tags = set(map(str.lower, payload.get("tags", [])))
    score += 2 * len(product_tags & payload_tags)

    # Color match
    if str(product.get("color", "")).lower() == payload.get("color", "").lower():
        score += 3

    # Price suitability
    if int(product.get("price", 0)) <= payload.get("maxPrice", 999999):
        score += 1

    return score


# ---------------- Generate Bundles ----------------
def generate_bundles(payload):
    print("Payload received:", payload)

    products = [serialize_mongo_doc(p) for p in product_collection.find({})]
    if not products:
        return []

    # ---- Normalize ----
    for p in products:
        p["price"] = int(p.get("price", 0))
        p["color"] = str(p.get("color", "")).lower()
        p["tags"] = [t.lower() for t in p.get("tags", [])]
        p["event"] = p.get("event", [])

    # ---- Filter by price ----
    products = [p for p in products if p["price"] <= payload["maxPrice"]]

    # ---- Split by category ----
    tops = [p for p in products if p["bundleCategory"] == "top"]
    bottoms = [p for p in products if p["bundleCategory"] == "bottom"]
    accessories = [p for p in products if p["bundleCategory"] == "accessory"]

    if not tops:
        print("❌ No tops found")
        return []

    # ---- Apriori decision ----
    transactions = get_bundle_transactions(payload["event"])
    use_apriori = len(transactions) > 0

    association_map = {}
    if use_apriori:
        rules_df = generate_association_rules_from_transactions(transactions)
        if not rules_df.empty:
            association_map = build_association_map(rules_df)
    used_tops = set()
    used_bottoms = set()
    used_accessories = set()
    
    def pick_diverse(candidates, used_set, k=3):
        available = [p for p in candidates if p["_id"] not in used_set]
        if not available:
            available = candidates  # fallback

        ranked = sorted(
            available,
            key=lambda p: score_product(p, payload),
            reverse=True
        )

        top_k = ranked[:k] if len(ranked) >= k else ranked
        choice = random.choice(top_k)
        used_set.add(choice["_id"])
        return choice

    bundles = []
    for _ in range(payload.get("n_bundles", 3)):
        bundle = {}

    # 1️⃣ PICK TOP
        top = pick_diverse(tops, used_tops)
        bundle["top"] = top

        # 2️⃣ PICK BOTTOM
        candidate_bottoms = bottoms
        if use_apriori:
            allowed = association_map.get(top["name"])
            if allowed:
                candidate_bottoms = [b for b in bottoms if b["name"] in allowed]

        if not candidate_bottoms:
            continue

        bottom = pick_diverse(candidate_bottoms, used_bottoms)
        bundle["bottom"] = bottom
        # 3️⃣ PICK ACCESSORY
        candidate_accessories = accessories
        if use_apriori:
            allowed = association_map.get(bottom["name"])
            if allowed:
                candidate_accessories = [
                    a for a in accessories if a["name"] in allowed
            ]

        if not candidate_accessories:
            continue

        accessory = pick_diverse(candidate_accessories, used_accessories)
        bundle["accessory"] = accessory

        bundles.append(bundle)
    return bundles


   