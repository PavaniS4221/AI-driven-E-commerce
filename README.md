AI-Driven E-commerce Website

## **Overview**

<<<<<<< HEAD
This project is a **full-stack e-commerce application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **Smart Outfit Bundle Generation** and an **AI-powered Virtual Try-On system**.

The platform allows users to browse products, receive personalized outfit bundles, and virtually try clothing items using a webcam, improving user confidence and reducing return rates.

=======
This project is a **full-stack e-commerce application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **smart outfit bundle generation**. It allows users to browse products, add to cart, and place orders. The system also generates **personalized product bundles** based on user preferences and past orders.
>>>>>>> upstream/main

---

## **Features**

### **User-Facing Features**

* User authentication and profile management
* Browse products by category, color, tags, and price
* Add single products or bundles to cart
* Place orders with multiple payment options (COD, UPI, Card, Wallet)
* View past orders and order status updates
* Smart bundle suggestions based on user preferences
<<<<<<< HEAD
* AI-based Virtual Try-On using OpenCV
=======
>>>>>>> upstream/main

### **Admin Features**

* Manage products, categories, and bundles
* View all orders and order statistics
* Track bundle performance and user purchase patterns

---

## **Smart Bundle Generation Algorithm**

The **Smart Bundle Generator** provides personalized outfit suggestions by combining **context-aware scoring** with **association rules** from previous bundle purchases.

### **Algorithm Steps**

1. **Fetch Products**

   * Load all products from the database.
   * Organize products by category (e.g., top, bottom, accessory).

2. **Fetch Past Bundle Orders**

   * Filter orders where `isBundle = true` and matching the current **event** (e.g., party, casual).
   * If no past bundles exist, skip association rules.

3. **Generate Association Rules**

   * Apply **Apriori algorithm** to past bundle transactions.
   * Build an **association map** of `antecedent → consequents` to suggest compatible products.

4. **Score Products**

   * Assign a **score** to each product based on:

     * Matching **color** and **tags**
     * Price within **max budget**
   * Products with higher scores are more relevant to the user context.

5. **Generate Bundles**

   * For each bundle:

     1. Select a **top** (highest scoring product).
     2. Select a **bottom**:

        * Preferably associated with the chosen top.
        * Fallback to highest scoring bottom if no association exists.
     3. Select an **accessory**:

        * Preferably associated with the chosen bottom.
        * Fallback to highest scoring accessory if no association exists.
     4. Ensure **total price ≤ max budget**.

6. **Return Bundles**

   * Generate `n_bundles` for the user with a combination of **association-based** and **scoring-based** selections.

---

<<<<<<< HEAD
=======
## **Technology Stack**

| Layer          | Technology       |
| -------------- | ---------------- |
| Database       | MongoDB          |
| Backend        | Node.js, Express |
| Frontend       | React.js         |
| API Requests   | Axios            |
| Authentication | JWT, bcryptjs    |
| UI Styling     | Tailwind CSS     |

---

>>>>>>> upstream/main
## **Data Models**

### **Product**

* `_id`, `name`, `category`, `tags`, `color`, `price`, `bundleCategory`

### **Order**

* `userId`, `items`, `amount`, `address`, `status`, `paymentMethod`, `payment`, `date`, `isBundle`, `bundleCategory`

### **Bundle Orders**

* Same structure as Order, specifically for **bundles** to track past transactions.

---

---

## **How it Works**

1. User selects event, color, budget, and other preferences.
2. The system checks past **bundle orders** for association patterns.
3. The **Smart Bundle Generator** scores products and combines them into outfits.
4. Bundles are displayed to the user, who can add all or individual items to the cart.
5. Orders placed with `isBundle = true` are stored separately to improve future recommendations.

---
## **AI-Based Virtual Try-On System**

The Virtual Try-On module enables users to preview clothing items in real time using **computer vision and deep learning techniques**.

### **Workflow**

1. User clicks **Try On** from the product page
2. Product image is dynamically extracted
3. Background is removed using a deep learning model
4. Webcam captures live video
5. Body landmarks are detected
6. Garment is resized and aligned
7. Clothing is overlaid using canvas rendering


### **Technologies Used (Virtual Try-On)**

- **MediaPipe Pose** – Real-time body landmark detection
- **OpenCV** – Frame processing and alignment
- **Python (Flask)** – AI processing backend
- **rembg (U²-Net)** – Background removal
- **HTML5 Canvas & Webcam API** – Live rendering

---

## **Technology Stack**


| Layer | Technology |
|------|-----------|
| Database | MongoDB |
| Backend | Node.js, Express.js |
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS |
| API | Axios |
| Authentication | JWT, bcryptjs |
| Computer Vision | MediaPipe, OpenCV |
| AI Processing | Python, Flask, rembg |

---


## **Future Enhancements**

* AI size recommendation
* AR mirror integration
* LLM search model



