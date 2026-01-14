
---

The Purpose / Motivation

* **Why this project exists:**

  * Many e-commerce platforms struggle to **predict future sales**, manage stock efficiently, and optimize revenue.
  * Offline tracking or basic reporting does not provide actionable insights.
  * Businesses need a **data-driven system** to forecast sales and make informed decisions.

* **Why MERN stack is used:**

  * **React.js** for a fast, interactive frontend.
  * **Node.js + Express** for a robust backend API.
  * **MongoDB** for flexible, scalable database storage.
  * Python + Prophet for **accurate sales prediction** using historical data.

---

The Implementation / Approach

* **Backend**

  * Node.js + Express handles all API endpoints for orders, payments, and user management.
  * A Python module inside the backend fetches historical order data from MongoDB, preprocesses it, and uses **Prophet** to forecast future sales.
  * `/predict` endpoint returns the forecast in JSON format for the frontend to consume.

* **Frontend**

  * React.js admin panel displays orders, payments, and predicted sales in **tables and charts**.
  * Admin can view forecasts and plan inventory, promotions, and logistics.

* **Sales Prediction Flow**

  1. Fetch **paid orders** from MongoDB.
  2. Convert timestamps into datetime format.
  3. Group sales by date and sum amounts.
  4. Train **Prophet** with daily sales data and weekly seasonality.
  5. Predict sales for the next 30 days.
  6. Send forecast to frontend for visualization.

---

Smart Bundle Generation Algorithm

This algorithm generates personalized outfit bundles based on user preferences and past orders. It combines association rules from previous bundle purchases with context-based scoring to ensure relevant suggestions.

Algorithm Steps

Fetch Products

Load all products from the database.

Organize products by category: top, bottom, accessory.

Fetch Past Bundle Orders

Use only orders where isBundle = true and matching the current event.

If no past bundles exist, skip association rules.

Generate Association Rules

Apply the Apriori algorithm to past bundle transactions.

Build an association map of antecedent → consequents.

Score Products

Assign a score to each product based on:

Matching color

Matching tags

Within maxPrice

Higher score indicates a better match for user context.

Generate Bundles

For each bundle:

Select a top (highest scoring).

Select a bottom:

Preferably associated with the chosen top.

Fallback to highest scoring bottom if no association exists.

Select an accessory:

Preferably associated with the chosen bottom.

Fallback to highest scoring accessory if no association exists.

Ensure the total price ≤ maxPrice.

Return Bundles

Return n_bundles generated bundles to the user.



✅ Features

Generates bundles based on past bundle associations (Apriori).

Falls back to scoring-based selection if no associations exist.

Respects max price and user preferences (color, tags).

Flexible for any number of categories (top, bottom, accessory).

If you want, I can also make a shorter 20–30 line version specifically for your README without all the code details, just pseudocode and steps, so it looks clean and professional.

Do you want me to do that too?

### **What (The Result / Deliverables)**

* **Functional E-commerce Admin Panel**

  * Manage users, orders, payments, and inventory.
  * Structured as `admin/frontend` and `admin/backend`.

* **Sales Forecasting Module**

  * Accurate 30-day sales predictions based on historical order data.
  * Helps in **planning stock, revenue projections, and promotions**.

* **APIs and Integration**

  * `/predict` API provides forecast in JSON.
  * Frontend consumes API to display data dynamically.

* **Tech Stack Deliverables**

  * Frontend: React.js + TailwindCSS
  * Backend: Node.js + Express.js + Python (Prophet)
  * Database: MongoDB
  * Version control: GitHub

---
follow these steps to get this.

# Clone the repository
git clone https://github.com/PavaniS4221/AI-driven-E-commerce.git
cd AI-driven-E-commerce

# Backend: install Node.js dependencies
cd admin/backend
npm install

# Python dependencies for sales prediction
pip install pandas prophet pymongo fastapi uvicorn

# Frontend: install React dependencies
cd ../frontend
npm install

# Go back to backend and start server
cd ../backend
# Start Node.js backend (change server.js if your entry point is different)
npm start

# Open a new terminal/tab and start frontend
cd ../frontend
npm start



