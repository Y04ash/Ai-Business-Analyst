# import pandas as pd
# import numpy as np
# import json

# def process_sales_data(file_path):
#     df = pd.read_csv(file_path)
#     print("✅ CSV Loaded")

#     # Parse order date
#     df["order_date"] = pd.to_datetime(df["order_date"], format="%d/%m/%Y", errors="coerce")
#     df.dropna(subset=["order_date"], inplace=True)

#     # adding total_revenue if not present 
#     if 'total_revenue' not in df.columns:
#         if 'quantity' in df.columns and 'unit_price' in df.columns:
#             df['total_revenue'] = df['quantity'] * df['unit_price']
#         else:
#             raise ValueError("CSV file must contain 'quantity' and 'unit_price' columns.")

#     # Extract date components
#     df["year"] = df["order_date"].dt.year
#     df["month"] = df["order_date"].dt.month_name()
#     df["month_num"] = df["order_date"].dt.month
#     df["weekday"] = df["order_date"].dt.day_name()

#     # Derived fields
#     if 'cost_price' in df :
#         df["profit"] = (df["unit_price"] - df["cost_price"]) * df["quantity"]
#         df["order_count"] = 1
#         df["aov"] = df["total_revenue"]
#     # else:

        
#     # 1. Monthly Revenue
#     monthly_revenue = (
#         df.groupby(["year", "month", "month_num"])["total_revenue"]
#         .sum().reset_index()
#         .sort_values(by=["year", "month_num"])
#         .to_dict(orient="records")
#     )
#     # sales difference bw last 2 months

#     prev_2_months_revenue = monthly_revenue[-2:]
#     sales_change = round(((prev_2_months_revenue[1]["total_revenue"] - prev_2_months_revenue[0]["total_revenue"])/prev_2_months_revenue[0]["total_revenue"]) * 100,2)
#     # print("sales_change",sales_change)

#     # 2. Monthly Profit
#     if 'cost_price' in df:
#         monthly_profit = (
#             df.groupby(["year", "month", "month_num"])["profit"]
#             .sum().reset_index()
#             .sort_values(by=["year", "month_num"])
#             .to_dict(orient="records")
#         )
#         # profit margin change
#         prev_2_months_profit = monthly_profit[-2:]
#         profit_margin_curr = (prev_2_months_profit[1]["profit"] / prev_2_months_revenue[1]["total_revenue"] ) * 100
#         profit_margin_last = (prev_2_months_profit[0]["profit"] / prev_2_months_revenue[0]["total_revenue"] ) * 100

#         profit_margin_change = round((((profit_margin_curr - profit_margin_last) / profit_margin_last) * 100),2)
#     else:
#         monthly_profit = None
#         profit_margin_change = None
#         profit_margin_last = None
    
#     # 3. Average Order Value (monthly)
#     aov_monthly = (
#         df.groupby(["year", "month", "month_num"]).agg(
#             total_revenue=("total_revenue", "sum"),
#             total_orders=("order_id", "nunique")
#         ).reset_index()
#     )
#     aov_monthly["avg_order_value"] = aov_monthly["total_revenue"] / aov_monthly["total_orders"]
#     avg_order_value = aov_monthly[["year", "month", "month_num", "avg_order_value"]]\
#         .sort_values(by=["year", "month_num"])\
#         .to_dict(orient="records")

#     # aov change
#     prev_2_months_aov = avg_order_value[-2:]
#     aov_change = round(((prev_2_months_aov[1]["avg_order_value"] - prev_2_months_aov[0]["avg_order_value"])/prev_2_months_aov[0]["avg_order_value"]) *100,2)
#     # print("aov_change",aov_change)


#     # 4. Sales by Weekday
#     weekday_sales = (
#         df.groupby("weekday")["total_revenue"]
#         .sum().reset_index()
#         .to_dict(orient="records")
#     )

#     # 5. Repeat vs New Customers
#     if 'customer_id' in df.columns:
#         customer_order_counts = df["customer_id"].value_counts()
#         repeat_customers = customer_order_counts[customer_order_counts > 1].count()
#         new_customers = customer_order_counts[customer_order_counts == 1].count()
#         customer_segmentation = {
#             "repeat_customers": repeat_customers,
#             "new_customers": new_customers
#         }
#     else:
#         customer_segmentation = None

#     # ========== Monthly Breakdown Additions ==========

#     # 6. Top Selling Products (monthly)
#     monthly_top_products = (
#         df.groupby(["year", "month", "month_num", "product_name"])["quantity"]
#         .sum().reset_index()
#         .sort_values(by=["year", "month_num", "quantity"], ascending=[True, True, False])
#     )
#     top_products_by_month = {}
#     bottom_products_by_month = {}
#     for _, group in monthly_top_products.groupby(["year", "month", "month_num"]):
#         # key = f"{group.iloc[0]['year']}-{group.iloc[0]['month_num']:02d}"
#         # top_products_by_month[key] = group.head(10).to_dict(orient="records")
#         group = group.sort_values(by="quantity", ascending=False)

#         top_n = min(4, len(group))  # Dynamic top N based on available products
#         top_products = group.head(top_n)
#         remaining_products = group.iloc[top_n:]
#         bottom_products = remaining_products.sort_values(by="quantity", ascending=True).head(top_n)

#         key = f"{group.iloc[0]['year']}-{group.iloc[0]['month_num']:02d}"
#         top_products_by_month[key] = top_products.to_dict(orient="records")
#         bottom_products_by_month[key] = bottom_products.to_dict(orient="records")

#     # 7. Category Revenue (monthly)
#     if "product_category" in df:

#         monthly_category_revenue = (
#             df.groupby(["year", "month", "month_num", "product_category"])["total_revenue"]
#             .sum().reset_index()
#             .sort_values(by=["year", "month_num", "total_revenue"], ascending=[True, True, False])
#         )
#         category_revenue_by_month = {}
#         top_categories_by_month = {}
#         bottom_categories_by_month = {}
#         for _, group in monthly_category_revenue.groupby(["year", "month", "month_num"]):
#             key = f"{group.iloc[0]['year']}-{group.iloc[0]['month_num']:02d}"
#             category_revenue_by_month[key] = group.to_dict(orient="records")
#             group = group.sort_values(by="total_revenue", ascending=False)

#             top_n = min(4, len(group))
#             top_categories = group.head(top_n)
#             remaining_categories = group.iloc[top_n:]
#             bottom_categories = remaining_categories.sort_values(by="total_revenue", ascending=True).head(top_n)

#             # key = f"{year}-{month_num:02d}"
#             top_categories_by_month[key] = top_categories.to_dict(orient="records")
#             bottom_categories_by_month[key] = bottom_categories.to_dict(orient="records")
#     else:
#         category_revenue_by_month = None
#         top_categories_by_month = None
#         bottom_categories_by_month = None

#     # 8. Region Sales (monthly)
#     if "region" in df.columns:
#         monthly_region_sales = (
#             df.groupby(["year", "month", "month_num", "region"])["total_revenue"]
#             .sum().reset_index()
#             .sort_values(by=["year", "month_num", "total_revenue"], ascending=[True, True, False])
#         )
#         region_sales_by_month = {}
#         top_regions_by_month = {}
#         bottom_regions_by_month = {}
#         for _, group in monthly_region_sales.groupby(["year", "month", "month_num"]):
#             key = f"{group.iloc[0]['year']}-{group.iloc[0]['month_num']:02d}"
#             region_sales_by_month[key] = group.to_dict(orient="records")
#             group = group.sort_values(by="total_revenue", ascending=False)

#             top_n = min(4, len(group))
#             top_regions = group.head(top_n)
#             remaining_regions = group.iloc[top_n:]
#             bottom_regions = remaining_regions.sort_values(by="total_revenue", ascending=True).head(top_n)

#             # key = f"{year}-{month_num:02d}"
#             top_regions_by_month[key] = top_regions.to_dict(orient="records")
#             bottom_regions_by_month[key] = bottom_regions.to_dict(orient="records")
#     else:
#         region_sales_by_month = {}
#         top_regions_by_month = {}
#         bottom_regions_by_month = {}

#     # Final Output Dictionary
#     analytics_output = {
        
        
#     "monthly_revenue": monthly_revenue,
#     "monthly_profit": monthly_profit,
#     "avg_order_value": avg_order_value,
#     "weekday_sales": weekday_sales,
#     "customer_segmentation": customer_segmentation,
#     "top_selling_products_by_month": top_products_by_month,
#     "underperforming_products_by_month": bottom_products_by_month,
#     "category_revenue_by_month": top_categories_by_month,
#     "underperforming_categories_by_month": bottom_categories_by_month,
#     "region_sales_by_month": top_regions_by_month,
#     "underperforming_regions_by_month": bottom_regions_by_month,
#     "aov_change": aov_change,
#     "sales_change": sales_change,
#     "profit_margin_last": profit_margin_last,
#     "profit_margin_change": profit_margin_change
        
#     }

#     # Explicit Conversion: Convert to native Python types before dumping to JSON
#     def convert_for_json(obj):
#         if isinstance(obj, (np.int64, np.int32, np.float64, np.float32)):
#             return int(obj) if isinstance(obj, (np.int64, np.int32)) else float(obj)
#         elif isinstance(obj, pd.Timestamp):
#             return str(obj)
#         elif isinstance(obj, dict):
#             return {k: convert_for_json(v) for k, v in obj.items()}
#         elif isinstance(obj, list):
#             return [convert_for_json(i) for i in obj]
#         return obj

#     # Convert and Save the output as JSON
#     try:
#         with open("analytics_output.json", "w") as f:
#             json.dump(convert_for_json(analytics_output), f, indent=2)
#         print("✅ Data processed and saved as 'analytics_output.json'")
#     except Exception as e:
#         print(f"❌ Error during JSON dump: {e}")

#     return analytics_output


# # CLI Run
# if __name__ == "__main__":
#     file_path = '../MOCK_DATA.csv'  # Change if needed
#     try:
#         result = process_sales_data(file_path)
#         json.dumps(result, indent=2)
#     except Exception as e:
#         print(f"❌ Error: {e}")



# File: scripts/analytics.py
import pandas as pd
import numpy as np

def process_sales_data_from_df(df):
    print("0")
    required_cols = ['order_date', 'quantity', 'unit_price']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    # df["order_date"] = pd.to_datetime(df["order_date"].astype(str).str.strip(), errors="coerce", dayfirst=True)
    # print(df["order_date"].head())
    # print("Unparsed rows (NaT):", df["order_date"].isna().sum())

    try:
        df["order_date"] = pd.to_datetime(
            df["order_date"].astype(str).str.strip(), 
            errors="coerce", 
            dayfirst=True
        )
        print("Date parsing successful.")
        # print(df["order_date"].head())
        print("Unparsed rows (NaT):", df["order_date"].isna().sum())
    except Exception as e:
        print("❌ Date parsing failed:", str(e))
        raise  # Re-raise to ensure it's not silently swallowed

    df.dropna(subset=["order_date"], inplace=True)
    # print("1")
    

    # Ensure this line is present
    # return df


    print("0.5")
    df.dropna(subset=["order_date"], inplace=True)
    print("1")
    if 'total_revenue' not in df.columns:
        if 'quantity' in df.columns and 'unit_price' in df.columns:
            df['total_revenue'] = df['quantity'] * df['unit_price']
        else:
            raise ValueError("CSV must contain 'quantity' and 'unit_price' columns.")

    df["year"] = df["order_date"].dt.year
    df["month"] = df["order_date"].dt.month_name()
    df["month_num"] = df["order_date"].dt.month
    df["weekday"] = df["order_date"].dt.day_name()
    print("2")
    # print("months are ", df["month"])


    # df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")  # Auto-infer format
    # print("0.5")
    # df.dropna(subset=["order_date"], inplace=True)
    # print("1")

    # if 'total_revenue' not in df.columns:
    #     if 'quantity' in df.columns and 'unit_price' in df.columns:
    #         df['total_revenue'] = df['quantity'] * df['unit_price']
    #     else:
    #         raise ValueError("CSV must contain 'quantity' and 'unit_price' columns.")

    # df["year"] = df["order_date"].dt.year
    # df["month"] = df["order_date"].dt.month_name()
    # df["month_num"] = df["order_date"].dt.month
    # df["weekday"] = df["order_date"].dt.day_name()
    # print("2")

    if 'cost_price' in df:
        df["profit"] = (df["unit_price"] - df["cost_price"]) * df["quantity"]
        df["order_count"] = 1
        df["aov"] = df["total_revenue"]

    monthly_revenue = (
        df.groupby(["year", "month", "month_num"])["total_revenue"]
        .sum().reset_index()
        .sort_values(by=["year", "month_num"])
        .to_dict(orient="records")
    )

    prev_2_months_revenue = monthly_revenue[-2:]
    # print(prev_2_months_revenue[0]["total_revenue"])
    sales_change = round(
        ((prev_2_months_revenue[1]["total_revenue"] - prev_2_months_revenue[0]["total_revenue"]) /
         prev_2_months_revenue[0]["total_revenue"]) * 100, 2
    ) if len(prev_2_months_revenue) >= 2 else None

    if 'cost_price' in df:
        monthly_profit = (
            df.groupby(["year", "month", "month_num"])["profit"]
            .sum().reset_index()
            .sort_values(by=["year", "month_num"])
            .to_dict(orient="records")
        )
        prev_2_months_profit = monthly_profit[-2:]
        print("prev_2_mont_profit",prev_2_months_profit)
        profit_margin_curr = (prev_2_months_profit[1]["profit"] / prev_2_months_revenue[1]["total_revenue"]) * 100
    
        profit_margin_last = (prev_2_months_profit[0]["profit"] / prev_2_months_revenue[0]["total_revenue"]) * 100
        profit_margin_change = round(((profit_margin_curr - profit_margin_last) / profit_margin_last) * 100, 2)
        print("profit_margin_current ",profit_margin_curr)
        print("profit_margin_last ",profit_margin_last)
        print("profit_margin_change ",profit_margin_change)
    else:
        monthly_profit = None
        profit_margin_change = None
        profit_margin_last = None
    print("3")
    aov_monthly = (
        df.groupby(["year", "month", "month_num"]).agg(
            total_revenue=("total_revenue", "sum"),
            total_orders=("order_id", "nunique")
        ).reset_index()
    )
    aov_monthly["avg_order_value"] = aov_monthly["total_revenue"] / aov_monthly["total_orders"]
    avg_order_value = aov_monthly[["year", "month", "month_num", "avg_order_value"]]\
        .sort_values(by=["year", "month_num"])\
        .to_dict(orient="records")

    prev_2_months_aov = avg_order_value[-2:]
    aov_change = round(
        ((prev_2_months_aov[1]["avg_order_value"] - prev_2_months_aov[0]["avg_order_value"]) /
         prev_2_months_aov[0]["avg_order_value"]) * 100, 2
    ) if len(prev_2_months_aov) >= 2 else None

    weekday_sales = df.groupby("weekday")["total_revenue"].sum().reset_index().to_dict(orient="records")
    print("4")
    if 'customer_id' in df.columns:
        customer_order_counts = df["customer_id"].value_counts()
        repeat_customers = customer_order_counts[customer_order_counts > 1].count()
        new_customers = customer_order_counts[customer_order_counts == 1].count()
        customer_segmentation = {
            "repeat_customers": repeat_customers,
            "new_customers": new_customers
        }
    else:
        customer_segmentation = None

    def get_top_bottom(df_grouped, value_col, key_cols):
        top, bottom = {}, {}
        for _, group in df_grouped.groupby(key_cols[:3]):
            key = f"{group.iloc[0]['year']}-{group.iloc[0]['month_num']:02d}"
            sorted_group = group.sort_values(by=value_col, ascending=False)
            top_n = min(4, len(sorted_group))
            top[key] = sorted_group.head(top_n).to_dict(orient="records")
            bottom[key] = sorted_group.tail(top_n).sort_values(by=value_col).to_dict(orient="records")
        return top, bottom

    product_group = df.groupby(["year", "month", "month_num", "product_name"])["quantity"].sum().reset_index()
    top_products_by_month, bottom_products_by_month = get_top_bottom(product_group, "quantity", ["year", "month", "month_num"])
    print("5")
    if "product_category" in df:
        category_group = df.groupby(["year", "month", "month_num", "product_category"])["total_revenue"].sum().reset_index()
        top_categories_by_month, bottom_categories_by_month = get_top_bottom(category_group, "total_revenue", ["year", "month", "month_num"])
    else:
        top_categories_by_month, bottom_categories_by_month = None, None

    if "region" in df.columns:
        region_group = df.groupby(["year", "month", "month_num", "region"])["total_revenue"].sum().reset_index()
        top_regions_by_month, bottom_regions_by_month = get_top_bottom(region_group, "total_revenue", ["year", "month", "month_num"])
    else:
        top_regions_by_month, bottom_regions_by_month = {}, {}
    # print( {
    #     "monthly_revenue": monthly_revenue,
    #     "monthly_profit": monthly_profit,
    #     "avg_order_value": avg_order_value,
    #     "weekday_sales": weekday_sales,
    #     "customer_segmentation": customer_segmentation,
    #     "top_selling_products_by_month": top_products_by_month,
    #     "underperforming_products_by_month": bottom_products_by_month,
    #     "category_revenue_by_month": top_categories_by_month,
    #     "underperforming_categories_by_month": bottom_categories_by_month,
    #     "region_sales_by_month": top_regions_by_month,
    #     "underperforming_regions_by_month": bottom_regions_by_month,
    #     "aov_change": aov_change,
    #     "sales_change": sales_change,
    #     "profit_margin_last": profit_margin_last,
    #     "profit_margin_change": profit_margin_change
    # })
    analytics_output = {
        "monthly_revenue": monthly_revenue,
        "monthly_profit": monthly_profit,
        "avg_order_value": avg_order_value,
        "weekday_sales": weekday_sales,
        "customer_segmentation": customer_segmentation,
        "top_selling_products_by_month": top_products_by_month,
        "underperforming_products_by_month": bottom_products_by_month,
        "category_revenue_by_month": top_categories_by_month,
        "underperforming_categories_by_month": bottom_categories_by_month,
        "region_sales_by_month": top_regions_by_month,
        "underperforming_regions_by_month": bottom_regions_by_month,
        "aov_change": aov_change,
        "sales_change": sales_change,
        "profit_margin_last": profit_margin_last,
        "profit_margin_change": profit_margin_change
    }

    def convert_for_json(obj):
        if isinstance(obj, (np.integer, np.floating)):
            return obj.item()
        elif isinstance(obj, pd.Timestamp):
            return str(obj)
        elif isinstance(obj, dict):
            return {k: convert_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_for_json(i) for i in obj]
        return obj

    return convert_for_json(analytics_output)
