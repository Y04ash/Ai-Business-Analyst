import json
import numpy as np

# Load your JSON file
with open('analytics_output.json', 'r') as file:
    data = json.load(file)

# Step 1: Extract monthly revenue data
monthly_revenue = data.get("monthly_revenue", [])

# Step 2: Compute mean and standard deviation
revenues = [entry["total_revenue"] for entry in monthly_revenue]
mean = np.mean(revenues)
std = np.std(revenues)

# Step 3: Define a z-score threshold (e.g., 2.0)
threshold = 2.0

# Step 4: Flag anomalies
for entry in monthly_revenue:
    z_score = (entry["total_revenue"] - mean) / std if std != 0 else 0
    entry["is_anomaly"] = abs(z_score) > threshold

# Step 5: Convert all NumPy types to standard Python types to avoid serialization issues
def convert_to_native_types(obj):
    if isinstance(obj, np.int64):
        return int(obj)  # Convert numpy int64 to regular int
    elif isinstance(obj, np.float64):
        return float(obj)  # Convert numpy float64 to regular float
    elif isinstance(obj, np.bool_):
        return bool(obj)  # Convert numpy bool to regular bool
    elif isinstance(obj, list):
        return [convert_to_native_types(item) for item in obj]  # Apply recursively for lists
    elif isinstance(obj, dict):
        return {key: convert_to_native_types(value) for key, value in obj.items()}  # Apply recursively for dictionaries
    return obj

# Step 6: Convert the entire data to native types
data = convert_to_native_types(data)

# Step 7: Save back to the same file
with open('analytics_output.json', 'w') as file:
    json.dump(data, file, indent=4)

print("✅ Anomalies flagged and file updated.")
