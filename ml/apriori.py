# import json
# import pandas as pd
# from mlxtend.preprocessing import TransactionEncoder

# from mlxtend.frequent_patterns import apriori, association_rules
# # Load the dataset
# df = pd.read_csv('../Online_Retail.csv')

# # Group by 'order_id' and collect the 'product_name' into a list
# basket = df.groupby('order_id')['product_name'].apply(list)


# # Clean basket: remove NaN and non-string products
# basket = basket.apply(lambda products: [str(product) for product in products if pd.notnull(product)])
# # View a sample
# # print(basket.head())



# # Initialize the encoder
# te = TransactionEncoder()

# # Transform the basket
# te_ary = te.fit(basket).transform(basket)

# # Create a dataframe
# basket_df = pd.DataFrame(te_ary, columns=te.columns_)

# # print(basket_df.head())


# frequent_itemsets = apriori(basket_df, min_support=0.025, use_colnames=True)
# if not frequent_itemsets.empty:
#     rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)
#     if not rules.empty:
#         rules.to_json('apriori_rules.json', orient='records', indent=4)
#     else:
#         # No association rules found even though frequent itemsets exist
#         with open('apriori_rules.json', 'w') as f:
#             json.dump({"message": "No Relation found"}, f, indent=4)
# else:
#     # No frequent itemsets found
#     with open('apriori_rules.json', 'w') as f:
#         json.dump({"message": "No Relation found"}, f, indent=4)


# File: scripts/apriori.py
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

def run_apriori(df, min_support=0.025, min_lift=1.0):
    if 'order_id' not in df.columns or 'product_name' not in df.columns:
        return {"message": "Required columns 'order_id' and 'product_name' not found."}

    # Group by order_id and collect product names
    basket = df.groupby('order_id')['product_name'].apply(list)
    basket = basket.apply(lambda products: [str(p) for p in products if pd.notnull(p)])

    # Encode the transactions
    te = TransactionEncoder()
    te_ary = te.fit(basket).transform(basket)
    basket_df = pd.DataFrame(te_ary, columns=te.columns_)

    # Generate frequent itemsets
    frequent_itemsets = apriori(basket_df, min_support=min_support, use_colnames=True)

    if frequent_itemsets.empty:
        return {"message": "No frequent itemsets found."}

    # Generate association rules
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=min_lift)

    if rules.empty:
        return {"message": "No association rules found."}

    return rules.to_dict(orient="records")
