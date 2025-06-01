# import pandas as pd
# from sklearn.cluster import KMeans
# from sklearn.preprocessing import StandardScaler
# import json

# # Load the CSV data
# df = pd.read_csv('../Online_Sales_Data.csv')  # Replace with your actual filename
# # print(df.head())
# if set(['customer_id', 'product_id']).issubset(df.columns):
#     # Step 1: Group by customer and product_category
#     print("isnide")
#     category_matrix = df.groupby(['customer_id', 'product_category'])['quantity'].sum().unstack(fill_value=0)

#     # Step 2: Normalize the data
#     scaler = StandardScaler()
#     category_scaled = scaler.fit_transform(category_matrix)

#     # Step 3: Dynamic Number of Clusters
#     n_clusters = int(input("Enter the number of clusters: "))  # Get user input

#     # Apply KMeans clustering
#     kmeans = KMeans(n_clusters=n_clusters, random_state=42)
#     category_matrix['cluster'] = kmeans.fit_predict(category_scaled)

#     # ✅ Save customer cluster mapping
#     customer_clusters = category_matrix['cluster'].reset_index().to_dict(orient='records')
#     with open('customer_interest_clusters.json', 'w') as f:
#         json.dump(customer_clusters, f, indent=4)

#     # Step 4: Analyze and generate descriptions for each cluster
#     cluster_descriptions = {}
#     for cluster_num in range(n_clusters):  # Iterate over the dynamic number of clusters
#         # Filter customers in this cluster
#         cluster_customers = category_matrix[category_matrix['cluster'] == cluster_num]

#         if cluster_customers.empty:
#             continue  # Skip empty clusters if any

#         # Find the top product categories in this cluster based on quantity
#         top_categories = cluster_customers.drop('cluster', axis=1).sum().sort_values(ascending=False).head(3)

#         # Generate a description based on top categories
#         description = f"Cluster {cluster_num}:\n"
#         description += f"Overview:"
#         description += f"Cluster Size: {len(cluster_customers)} customers\n"
#         description += f"Description: These customers mainly engage with {', '.join(top_categories.index)}."

#         # Save the description
#         cluster_descriptions[cluster_num] = description

#     # Step 5: Save the cluster descriptions
#     with open('cluster_descriptions.json', 'w') as f:
#         json.dump(cluster_descriptions, f, indent=4)

#     # Output the descriptions to the console
#     for cluster, desc in cluster_descriptions.items():
#         print(desc)

#     print("✅ Clustering complete. Files saved: 'customer_interest_clusters.json', 'cluster_descriptions.json'")
# else:
#     print("outside")
#     data = [{"message": "No Customer Details Found"}]
#     with open("customer_interest_clusters.json", "w") as json_file:
#         json.dump(data, json_file, indent=4)


# File: scripts/customerCluster.py
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def perform_customer_clustering(df, clusters=3):
    if set(['customer_id', 'product_category']).issubset(df.columns):
        category_matrix = df.groupby(['customer_id', 'product_category'])['quantity'].sum().unstack(fill_value=0)

        scaler = StandardScaler()
        category_scaled = scaler.fit_transform(category_matrix)

        kmeans = KMeans(n_clusters=clusters, random_state=42)
        category_matrix['cluster'] = kmeans.fit_predict(category_scaled)

        customer_clusters = category_matrix['cluster'].reset_index().to_dict(orient='records')

        cluster_descriptions = {}
        for cluster_num in range(clusters):
            cluster_customers = category_matrix[category_matrix['cluster'] == cluster_num]
            if cluster_customers.empty:
                continue

            top_categories = cluster_customers.drop('cluster', axis=1).sum().sort_values(ascending=False).head(3)

            description = {
                "cluster": cluster_num,
                "size": len(cluster_customers),
                "top_categories": list(top_categories.index)
            }

            cluster_descriptions[cluster_num] = description

        return {
            "clusters": customer_clusters,
            "descriptions": cluster_descriptions
        }
    else:
        return {
            "message": "No Customer Details Found"
        }
