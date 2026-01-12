import os
import random
from serializer.mongo import serialize_mongo_doc
import heapq


from pymongo import MongoClient
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules




# ---------------- MongoDB Connection ----------------

client = MongoClient(
        "mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net"
    )
   
db = client["test"]

product_collection = db.products
transactions_collection = db.orders

def complementary_colors(color):
    mapping = {
        "red": ["black", "gold", "white"],
        "black": ["red", "gold", "white"],
        "blue": ["black", "silver", "white"],
        "white": ["black", "red", "blue"]
    }
    return mapping.get(color, [])

# ---------------- Helper Functions ----------------


def score_product(product, context, anchor_color=None):
    score = 0

    # Event match (MOST IMPORTANT)
    if context["event"] in product.get("event", []):
        score += 5

    # Color logic
    if product.get("color") == context["color"]:
        score += 3
    elif anchor_color and product.get("color") in complementary_colors(anchor_color):
        score += 2

    # Tag overlap
    score += len(set(product.get("tags", [])) & set(context.get("tags", [])))

    # Recency
    if product.get("date", 0) >= context.get("recentDate", 0):
        score += 1

    # Bestseller
    if product.get("bestseller"):
        score += 1

    return score


def generate_association_rules(transactions, min_support=0.1):
    """
    Generate association rules from past transactions
    """
    print("Generating association rules...")
    if not transactions:
        return pd.DataFrame()
    
    

    all_items = sorted({item for t in transactions for item in t})
    df = pd.DataFrame([{item: (item in t) for item in all_items} for t in transactions])
    
    frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
    return rules

# ---------------- Bundle Generation Function ----------------


def generate_bundles(context):
    products = list(product_collection.find({}))
    
    products = [serialize_mongo_doc(p) for p in products]
    bundles = []

    category_map = {}
    for p in products:
        category_map.setdefault(p["bundleCategory"], []).append(p)

    precomputed_scores = {}
    for cat, items in category_map.items():
        precomputed_scores[cat] = [
            (score_product(p, context), p) for p in items if p["price"] <= context["maxPrice"]
        ]
    
    for _ in range(context["n_bundles"]):
        bundle = {}
        total_price = 0

        # -------- TOP --------
        tops_scores = precomputed_scores.get("top", [])
        if not tops_scores:
            continue

        top_choices = heapq.nlargest(3, tops_scores, key=lambda x: x[0])
       
        top = random.choice(top_choices)  # pick randomly
        print(top[1]["price"])
       

        bundle["top"] = top
        total_price += top[1]["price"]

        anchor_color = top[1]["color"]
        precomputed_scores["top"] = [(s, t) for s, t in tops_scores if t["_id"] != top[1]["_id"]]
        # -------- BOTTOM --------
        bottoms_scores = [
            (s, b) for s, b in precomputed_scores.get("bottom", [])
            if total_price + b["price"] <= context["maxPrice"]
        ]

        if bottoms_scores:
            bottom_choices = heapq.nlargest(3, bottoms_scores, key=lambda x: x[0])
            bottom = random.choice([b for s, b in bottom_choices])
            bundle["bottom"] = bottom
            total_price += bottom["price"]

            precomputed_scores["bottom"] = [(s, b) for s, b in bottoms_scores if b["_id"] != bottom["_id"]]
        else:
            bundle["bottom"] = {"name": "No bottom", "price": 0}

        bundle["bottom"] = bottom
        total_price += bottom["price"]

        # -------- ACCESSORY --------
        accessories_scores = [
            (s, a) for s, a in precomputed_scores.get("accessory", [])
            if total_price + a["price"] <= context["maxPrice"]
        ]

        if accessories_scores:
            accessory_choices = heapq.nlargest(3, accessories_scores, key=lambda x: x[0])
            acc_choices = [a for s, a in accessory_choices]
            accessory = random.choice(acc_choices)
            precomputed_scores["accessory"] = [(s, a) for s, a in accessories_scores if a["_id"] != accessory["_id"]]
        else:
            accessory = {"name": "No accessory", "price": 0}

        bundle["accessory"] = accessory

        bundles.append(bundle)

    return bundles
