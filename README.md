
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



