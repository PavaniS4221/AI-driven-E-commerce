from fastapi import FastAPI
from sales_model import train_and_predict

app = FastAPI()

@app.get("/predict")
def predict_sales():
    return {
        "forecast": train_and_predict()
    }
