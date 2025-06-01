# # File: main.py
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import pandas as pd
# import uvicorn
# from scripts.preprocessing import process_sales_data_from_df  # your custom logic
# from scripts.customerClustering import perform_customer_clustering
# from scripts.apriori import run_apriori
# from scripts.rfm import calculate_rfm, calculate_aggregate_rating, generate_rfm_output

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # update this to your frontend domain in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/upload")
# async def upload_csv(file: UploadFile = File(...)):
#     df = pd.read_csv(file.file)
#     result = process_file(df)  # run your preprocessing & analytics scripts
#     return result  # must be JSON serializable (dict, list, etc.)

# @app.post("/cluster")
# def run_clustering(file: UploadFile = File(...), clusters: int = 3):
#     df = pd.read_csv(file.file)
#     return perform_customer_clustering(df, clusters)

# @app.post("/analytics")
# async def run_analytics(file: UploadFile = File(...)):
#     df = pd.read_csv(file.file)
#     try:
#         result = process_sales_data_from_df(df)
#         return result
#     except Exception as e:
#         return {"error": str(e)}

# @app.post("/rfm")
# def run_rfm(file: UploadFile = File(...)):
#     df = pd.read_csv(file.file)

#     rfm_df, error = calculate_rfm(df)
#     if error:
#         return {"error": error["message"]}

#     agg_ratings_df = calculate_aggregate_rating(rfm_df)
#     rfm_result = generate_rfm_output(rfm_df, agg_ratings_df)
#     return rfm_result


# @app.post("/apriori")
# def run_apriori(file: UploadFile = File(...)):
#     df = pd.read_csv(file.file)
#     return run_apriori(df)



# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)



from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import uvicorn
from preprocessing import process_sales_data_from_df  # your custom logic
from customerClustering import perform_customer_clustering
from apriori import run_apriori
from rfm import calculate_rfm, calculate_aggregate_rating, generate_rfm_output

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://ai-business-analyst-9.onrender.com"],
    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

@app.get("/")
async def start():
    print("hello")

# Consolidated route to handle all processing
@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    print("inside post")
    result = process_csv(file)  # Now processes the CSV for all scripts
    print("after inside post")
    return result


def process_csv(file: UploadFile):
    # Read the CSV file into a DataFrame
    print("process_csv")
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)  # Use tab separator
    elif file.filename.endswith((".xls", ".xlsx")):
        df = pd.read_excel(file.file)
    else:
        raise ValueError("Unsupported file format. Upload a .csv or .xlsx file.")

    

    # Preprocessing step (e.g., cleaning, transforming data)
    try:
        print("inside preprocessing 1")
        preprocessed_data = process_sales_data_from_df(df)  # Assuming this processes and prepares data
        print("inside preprocessing")
    except Exception as e:
        return {"error": f"Preprocessing failed: {str(e)}"}
    
    # Clustering step
    try:
        clustering_result = perform_customer_clustering(df, clusters=3)  # Default to 3 clusters or get from input
        print("inside cluster")
    except Exception as e:
        return {"error": f"Clustering failed: {str(e)}"}
    
    # RFM analysis step
    try:
        rfm_df, rfm_error = calculate_rfm(df)
        if rfm_error:
            rfm_df=  {"message": rfm_error["message"]}
            agg_ratings_df ={"message": rfm_error["message"]}
            rfm_result ={"message": rfm_error["message"]}
        else:
            agg_ratings_df = calculate_aggregate_rating(rfm_df)
            print("inside else1")
            rfm_result = generate_rfm_output(rfm_df, agg_ratings_df)
            print("inside else2")
        
        print("inside rfm")
    except Exception as e:
        return {"error": f"RFM calculation failed: {str(e)}"}

    # Apriori analysis step
    try:
        apriori_result = run_apriori(df)
        print("inside apriori")
    except Exception as e:
        return {"error": f"Apriori analysis failed: {str(e)}"}

    # Return the aggregated result for all processes
    print("All ok")
    return {
        "preprocessed_data": preprocessed_data,
        "clustering_result": clustering_result,
        "rfm_result": rfm_result,
        "apriori_result": apriori_result
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("app is running on 8000")
