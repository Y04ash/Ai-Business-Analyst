InsightLoop is a full-stack business analytics platform that enables users to upload sales CSV files and instantly generate actionable insights. It provides interactive visualizations including revenue, profit, AOV trends, regional and category-wise sales, RFM analysis, and product performance. The platform also features advanced analytics such as customer segmentation using K-Means and market basket analysis via the Apriori algorithm.
Demo csv files are present in the frontend folder of the project
Note: CSV should include the following columns
product_name: Name of the product
product_category (optional): Category of the product — required for category-based insights
customer_id (optional): ID of the customer — required for customer-based analytics
region: Sales region (e.g., North, South, etc.)
order_date: Date of the order (format: dd/mm/yyyy)
quantity: Number of units sold
unit_price: Price per unit of product
total_revenue: Calculated as quantity × unit_price
cost_price: Cost to acquire or produce the product
