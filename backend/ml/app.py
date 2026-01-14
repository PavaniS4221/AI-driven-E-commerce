from bundlegen import generate_bundles
from fastapi import FastAPI,Body
from sales_model import train_and_predict

app = FastAPI()

@app.get("/predict")
def predict_sales():
    return {
        "forecast": train_and_predict()
    }

@app.post("/generate-bundles")

def get_bundles(user_context: dict = Body(...)):
    bundles = generate_bundles(user_context)
    print("Generated bundles:", bundles)
    return { "bundles": bundles }
