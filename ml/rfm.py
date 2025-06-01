# import pandas as pd
# from datetime import datetime
# import json

# def calculate_rfm(csv_file):
#     """
#     Calculates RFM metrics and assigns scores to customers.

#     Args:
#         csv_file (str): Path to the CSV file containing order data.

#     Returns:
#         pandas.DataFrame: DataFrame with RFM metrics and scores per customer.
#     """
#     df = pd.read_csv(csv_file)
#     if "customer_id" in df:

#         if 'total_revenue' not in df.columns:
#             if 'quantity' in df.columns and 'unit_price' in df.columns:
#                 df['total_revenue'] = df['quantity'] * df['unit_price']
#             else:
#                 raise ValueError("CSV file must contain 'quantity' and 'unit_price' columns.")


#         # Convert order_date to datetime objects
#         df['order_date'] = pd.to_datetime(df['order_date'], format="%d/%m/%Y", dayfirst=True)
        

#         # Set the analysis date to the latest order date + 1 day
#         analysis_date = df['order_date'].max() + pd.Timedelta(days=1)
#         print(analysis_date)
#         # Calculate Recency
#         recency_df = df.groupby('customer_id')['order_date'].max().reset_index()
#         recency_df['Recency'] = (analysis_date - recency_df['order_date']).dt.days
#         recency_df = recency_df[['customer_id', 'Recency']]

#         # Calculate Frequency
#         frequency_df = df.groupby('customer_id')['order_id'].nunique().reset_index()
#         frequency_df.rename(columns={'order_id': 'Frequency'}, inplace=True)

#         # Calculate Monetary Value
#         monetary_df = df.groupby('customer_id')['total_revenue'].sum().reset_index()
#         monetary_df.rename(columns={'total_revenue': 'Monetary'}, inplace=True)

#         # Merge RFM metrics
#         rfm_df = recency_df.merge(frequency_df, on='customer_id')
#         rfm_df = rfm_df.merge(monetary_df, on='customer_id')

#         freq_max = rfm_df['Frequency'].max()
#         freq_bins = [-1, 1, 3, 6, 10, freq_max + 1]
#         freq_bins = sorted(set(freq_bins))  # Ensure strictly increasing & no duplicates

#         rfm_df['F_Score'] = pd.cut(
#         rfm_df['Frequency'],
#         bins=freq_bins,
#         labels=range(1, len(freq_bins)),
#         include_lowest=True
#         )
#         # Handle NaNs before converting to int
#         rfm_df['F_Score'] = rfm_df['F_Score'].astype(float).fillna(0).astype(int)

#         # Repeat same for Recency and Monetary
#         rec_max = rfm_df['Recency'].max()
#         rec_bins = [-1, 30, 90, 180, 365, rec_max + 1]
#         rec_bins = sorted(set(rec_bins))
#         rfm_df['R_Score'] = pd.cut(
#             rfm_df['Recency'],
#             bins=rec_bins,
#             labels=range(5, 0, -1),  # lower recency = higher score
#             include_lowest=True
#         )


#         rfm_df['R_Score'] = rfm_df['R_Score'].astype(float).fillna(0).astype(int)

#         mon_max = rfm_df['Monetary'].max()
#         mon_bins = [-1, 500, 1500, 3000, 5000, mon_max + 1]
#         mon_bins = sorted(set(mon_bins))

#         rfm_df['M_Score'] = pd.cut(
#             rfm_df['Monetary'],
#             bins=mon_bins,
#             labels=range(1, len(mon_bins)),
#             include_lowest=True
#         )
        
#         rfm_df['M_Score'] = rfm_df['M_Score'].astype(float).fillna(0).astype(int)


#         print("Missing F_Score before fillna:", rfm_df['F_Score'].isna().sum())

#         return rfm_df
#     else:
#         return None
    



# def calculate_aggregate_rating(rfm_df):
#     """
#     Calculates an aggregate rating (1-5) for each customer based on RFM scores.
#     """

#     try:
#         print("Input RFM DF Columns:", rfm_df.columns)
#         print(rfm_df.head())


#         # Drop rows with any NaNs in the scoring columns (recommended for data accuracy)
#         rfm_df = rfm_df.dropna(subset=['R_Score', 'F_Score', 'M_Score'])

#         # Now convert to int
#         rfm_df['R_Score'] = rfm_df['R_Score'].astype(int)
#         rfm_df['F_Score'] = rfm_df['F_Score'].astype(int)
#         rfm_df['M_Score'] = rfm_df['M_Score'].astype(int)

#         # Continue with calculating overall score
#         # rfm_df['Overall_Score'] = rfm_df[['R_Score', 'F_Score', 'M_Score']].mean(axis=1)



#         rfm_df['Overall_Score'] = (
#             rfm_df['R_Score'].astype(int) +
#             rfm_df['F_Score'].astype(int) +
#             rfm_df['M_Score'].astype(int)
#         ) / 3

#         print("After Overall_Score:\n", rfm_df[['customer_id', 'Overall_Score']].head())

#         rfm_df['Customer_Rating'] = round((rfm_df['Overall_Score'] / 5) * 4 + 1)
#         rfm_df['Customer_Rating'] = rfm_df['Customer_Rating'].clip(1, 5).astype(int)

#         aggregate_rating_df = rfm_df[['customer_id', 'Customer_Rating']]

#         print("Aggregate Ratings Columns:", aggregate_rating_df.columns)
#         print("Sample aggregate_rating_df:")
#         print(aggregate_rating_df.head())

#         return aggregate_rating_df
#     except Exception as e:
#         print("Error calculating aggregate rating:", e)
#         raise

# def generate_customer_rfm_and_distribution_json(rfm_df, aggregate_rating_df, output_file="rfm_data.json"):
#     """
#     Generates a JSON file containing RFM scores per customer and distribution data for graphs.
#     """
#     customer_rfm_data = {}
#     # print("RFM DF Columns:", rfm_df.columns)
#     # print("Aggregate Ratings Columns:", aggregate_rating_df.columns)
#     # print("Sample aggregate_rating_df:")
#     # print(aggregate_rating_df.head())
#     rfm_df = rfm_df.drop(columns=['Customer_Rating'], errors='ignore')
#     merged_df = rfm_df.merge(aggregate_rating_df, on='customer_id')



#     for index, row in merged_df.iterrows():
#         customer_id = str(int(row['customer_id']))  # 👈 Convert float to clean int string
#         customer_rfm_data[customer_id] = {
#             "RecencyScore": int(row['R_Score']),
#             "FrequencyScore": int(row['F_Score']),
#             "MonetaryScore": int(row['M_Score']),
#             "CustomerRating": int(row['Customer_Rating'])
#         }


#     distribution_data = {
#         "recency_distribution": rfm_df['R_Score'].value_counts().sort_index().to_dict(),
#         "frequency_distribution": rfm_df['F_Score'].value_counts().sort_index().to_dict(),
#         "monetary_distribution": rfm_df['M_Score'].value_counts().sort_index().to_dict(),
#         "customer_rating_distribution": aggregate_rating_df['Customer_Rating'].value_counts().sort_index().to_dict()
#     }

#     output_data = {
#         "customer_rfm": customer_rfm_data,
#         "distributions": distribution_data
#     }

#     with open(output_file, 'w') as f:
#         json.dump(output_data, f, indent=4)

# if __name__ == "__main__":
#     csv_file_path = '../Online_Retail.csv' # Make sure this is the correct path
#     rfm_data = calculate_rfm(csv_file_path)
#     if rfm_data is None:

#         output_data = {
#         "message": "No customer details found"
#         }   
#         with open("rfm_data.json", 'w') as f:
#             json.dump(output_data, f, indent=4)
#     else:
#         aggregate_ratings = calculate_aggregate_rating(rfm_data)
#         generate_customer_rfm_and_distribution_json(rfm_data, aggregate_ratings)
#         print("Customer RFM data and distributions for graphs have been saved to rfm_data.json")



# File: scripts/rfm.py

import pandas as pd
import json

def calculate_rfm(df):
    if "customer_id" not in df.columns:
        return None, {"message": "No customer_id column in data."}

    if 'total_revenue' not in df.columns:
        if 'quantity' in df.columns and 'unit_price' in df.columns:
            df['total_revenue'] = df['quantity'] * df['unit_price']
        else:
            return  None,{"message": "Missing revenue or quantity/unit_price columns."}

    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce', dayfirst=True)
    analysis_date = df['order_date'].max() + pd.Timedelta(days=1)

    recency_df = df.groupby('customer_id')['order_date'].max().reset_index()
    recency_df['Recency'] = (analysis_date - recency_df['order_date']).dt.days
    frequency_df = df.groupby('customer_id')['order_id'].nunique().reset_index(name='Frequency')
    monetary_df = df.groupby('customer_id')['total_revenue'].sum().reset_index(name='Monetary')

    rfm_df = recency_df[['customer_id', 'Recency']].merge(frequency_df, on='customer_id').merge(monetary_df, on='customer_id')

    # RFM Scoring
    rfm_df['F_Score'] = pd.cut(
        rfm_df['Frequency'], bins=sorted(set([-1, 1, 3, 6, 10, rfm_df['Frequency'].max() + 1])),
        labels=range(1, 6), include_lowest=True).astype(float).fillna(0).astype(int)
    # print("below f score")

    rfm_df['R_Score'] = pd.cut(
        rfm_df['Recency'], bins=sorted(set([-1, 30, 90, 180, 365, rfm_df['Recency'].max() + 1])),
        labels=range(5, 0, -1), include_lowest=True).astype(float).fillna(0).astype(int)
    # print("below r score")

    rfm_df['M_Score'] = pd.cut(
        rfm_df['Monetary'], bins=sorted(set([-1, 500, 1500, 3000, 5000, rfm_df['Monetary'].max() + 1])),
        labels=range(1, 6), include_lowest=True).astype(float).fillna(0).astype(int)
    # print("below m score")

    return rfm_df, None


def calculate_aggregate_rating(rfm_df):
    rfm_df['Overall_Score'] = (
        rfm_df['R_Score'] + rfm_df['F_Score'] + rfm_df['M_Score']
    ) / 3

    # print("inside calc agg")
    rfm_df['Customer_Rating'] = round((rfm_df['Overall_Score'] / 5) * 4 + 1).clip(1, 5).astype(int)
    return rfm_df[['customer_id', 'Customer_Rating']]


def generate_rfm_output(rfm_df, agg_ratings_df):
    rfm_df = rfm_df.drop(columns=['Customer_Rating'], errors='ignore')
    merged_df = rfm_df.merge(agg_ratings_df, on='customer_id')
    # print(rfm_df)
    customer_rfm_data = {
        str(row['customer_id']): {
            "RecencyScore": int(row['R_Score']),
            "FrequencyScore": int(row['F_Score']),
            "MonetaryScore": int(row['M_Score']),
            "CustomerRating": int(row['Customer_Rating'])
        }
        for _, row in merged_df.iterrows()
    }

    distribution_data = {
        "recency_distribution": rfm_df['R_Score'].value_counts().sort_index().to_dict(),
        "frequency_distribution": rfm_df['F_Score'].value_counts().sort_index().to_dict(),
        "monetary_distribution": rfm_df['M_Score'].value_counts().sort_index().to_dict(),
        "customer_rating_distribution": agg_ratings_df['Customer_Rating'].value_counts().sort_index().to_dict()
    }

    return {
        "customer_rfm": customer_rfm_data,
        "distributions": distribution_data
    }
