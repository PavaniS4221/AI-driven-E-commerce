import os
from dotenv import load_dotenv
import random
from pymongo import MongoClient
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

# ---------------- MongoDB Connection ----------------
client = MongoClient(mongo_uri)
db = client["e-commerce"]
product_collection = db["products"]
transactions_collection = db["orders"]

# ---------------- Helper Functions ----------------
def score_product(product, context):
    """
    Scores a product based on user context for personalized bundles
    """
    score = 0

    # Event matching
    if "event" in product and context.get("event"):
        if any(e.lower() in [ev.lower() for ev in product["event"]] for e in context["event"]):
            score += 3

    # Bestseller
    if product.get("bestseller", False):
        score += 1

    # Recent products
    if product.get("date", 0) >= context.get("recentDate", 0):
        score += 0.5

    # Tag matching
    if context.get("tags"):
        tag_overlap = len(set(product.get("tags", [])) & set(context["tags"]))
        score += tag_overlap

    # Color matching
    if context.get("color") and product.get("color") == context["color"]:
        score += 1

    # Randomness to vary bundles
    score += random.random()
    return score

def generate_association_rules(transactions, min_support=0.1):
    """
    Generate association rules from past transactions
    """
    if not transactions:
        return pd.DataFrame()

    all_items = sorted({item for t in transactions for item in t})
    df = pd.DataFrame([{item: (item in t) for item in all_items} for t in transactions])
    frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
    return rules

# ---------------- Bundle Generation Function ----------------
def generate_bundles(context: dict, n_bundles: int = 5):
    """
    Generates personalized outfit bundles from database products.
    Each bundle always contains top, bottom, footwear, accessory
    """
    # Load products and past transactions
    products = list(product_collection.find({}))
    past_transactions_cursor = transactions_collection.find({})
    past_transactions = [t["products"] for t in past_transactions_cursor]

    # Group products by bundleCategory
    category_map = {}
    for p in products:
        category_map.setdefault(p["bundleCategory"], []).append(p)

    # Generate association rules
    rules = generate_association_rules(past_transactions)
    required_categories = ["top", "bottom", "footwear", "accessory"]

    bundles = []

    for _ in range(n_bundles):
        bundle = {}
        total_price = 0

        # Pick product for each required category
        for cat in required_categories:
            if cat in category_map and category_map[cat]:
                scored = [(score_product(p, context), p) for p in category_map[cat]]
                scored.sort(key=lambda x: x[0], reverse=True)

                # Filter by maxPrice if provided
                top_choices = [
                    p for s, p in scored
                    if total_price + p["price"] <= context.get("maxPrice", float('inf'))
                ]

                if not top_choices:
                    top_choices = [p for s, p in scored[:2]]

                chosen = random.choice(top_choices)
                total_price += chosen["price"]

                # Ensure image URLs are full paths
                chosen["image"] = [
                    f"http://localhost:5000/images/{img}" if not img.startswith("http") else img
                    for img in chosen.get("image", ["placeholder.png"])
                ]

                bundle[cat] = chosen
            else:
                # Placeholder if category missing
                bundle[cat] = {
                    "name": "No product",
                    "price": 0,
                    "image": ["http://localhost:5000/images/placeholder.png"]
                }

        # Apply association rules to refine bundle
        if not rules.empty:
            for rule in rules.itertuples():
                antecedents = list(rule.antecedents)
                consequents = list(rule.consequents)
                bundle_names = [item["name"] for item in bundle.values()]
                if any(a in bundle_names for a in antecedents):
                    for c in consequents:
                        for cat, item in bundle.items():
                            if item["name"] != c and cat in required_categories:
                                for p in category_map.get(cat, []):
                                    if p["name"] == c and total_price - item["price"] + p["price"] <= context.get("maxPrice", float('inf')):
                                        total_price = total_price - item["price"] + p["price"]
                                        bundle[cat] = p

        bundles.append(bundle)

    return bundles
