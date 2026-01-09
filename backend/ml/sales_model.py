from pymongo import MongoClient
import pandas as pd
from prophet import Prophet

print("Sales model module loaded.")

def train_and_predict():
    print("🔥 FUNCTION EXECUTING 🔥")

    client = MongoClient(
        "mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net"
    )
   
    db = client["e-commerce"]
    
    orders = db.orders
    
    

    data = list(orders.find(
       {"payment":True},
        {"date": 1, "amount": 1, "_id": 0}
    ))
   
    if len(data) < 2:
        return []

    df = pd.DataFrame(data)

    df["date"] = pd.to_datetime(df["date"], unit='ms', errors="coerce")
    df = df.dropna(subset=["date"])

    sales_data = (
        df.groupby(df["date"].dt.date)["amount"]
        .sum()
        .reset_index()
    )

    sales_data.columns = ["ds", "y"]

    if len(sales_data) < 2:
        return []

    model = Prophet(weekly_seasonality=True)
    model.fit(sales_data)

    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    return forecast[["ds", "yhat"]].tail(20).to_dict("records")
