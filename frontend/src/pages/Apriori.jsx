import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";

import { useResultContext } from "../context/ResultContext";
import axios from "axios";
import '../index.css'
import "../css/apriori.css";
const Apriori = () => {
  const [hasResults, setHasResults] = useState(false);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "antecedents", headerName: "Antecedents", width: 300 },
    { field: "consequents", headerName: "Consequents", width: 300 },
    { field: "support", headerName: "Support (%)", width: 130 }, // ✅ added (%)
    { field: "confidence", headerName: "Confidence (%)", width: 130 }, // ✅ added (%)
    { field: "lift", headerName: "Lift", width: 130 },
  ];

  const { data } = useResultContext();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading

  useEffect(()=>{
    if (Object.keys(data).length > 0) {
      console.log("inside apriori ",hasResults)
      // console.log("results from apriori",data)
      if (data.apriori_result?.message === "No frequent itemsets found.") {
        setHasResults(false);
        setRows([]);
        console.log(hasResults);
      } else {
        const formattedData = data.apriori_result.map((item, index) => ({
          id: index + 1,
          antecedents: Array.isArray(item.antecedents)
            ? item.antecedents.join(", ")
            : item.antecedents,
          consequents: Array.isArray(item.consequents)
            ? item.consequents.join(", ")
            : item.consequents,
          support: (item.support * 100).toFixed(2), // ✅ convert to % and round to 2 decimal places
          confidence: (item.confidence * 100).toFixed(2), // ✅ convert to % and round to 2 decimal places
          lift: item.lift.toFixed(2), // ✅ optional: round lift also if you want
        }));
  
        setRows(formattedData);
        setHasResults(true);
        setLoading(false);
        console.log("apriori ",hasResults)
      }
    } else {
      setHasResults(false); 
      console.log("apriori ",hasResults)
      console.log("results from apriori",data.length)
    }

  },[data])

  // const fetchAprioriResults = async () => {
  //   setLoading(true); // ✅ setLoading true before API call
  //   try {
  //     const response = await axios.get("../../ml/apriori_rules.json");
  //     const data = response.data;
  //     if (data[0]?.message === "No relation found") {
  //       setHasResults(false);
  //       setRows([]);
  //       console.log(hasResults);
  //     } else {
  //       const formattedData = data.map((item, index) => ({
  //         id: index + 1,
  //         antecedents: Array.isArray(item.antecedents)
  //           ? item.antecedents.join(", ")
  //           : item.antecedents,
  //         consequents: Array.isArray(item.consequents)
  //           ? item.consequents.join(", ")
  //           : item.consequents,
  //         support: (item.support * 100).toFixed(2), // ✅ convert to % and round to 2 decimal places
  //         confidence: (item.confidence * 100).toFixed(2), // ✅ convert to % and round to 2 decimal places
  //         lift: item.lift.toFixed(2), // ✅ optional: round lift also if you want
  //       }));

  //       setRows(formattedData);
  //       setHasResults(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching apriori rules:", error);
  //   } finally {
  //     setLoading(false); // ✅ Always stop loading even if error
  //   }
  // };

  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="apriory-heading">Market Basket Analysis</h2>
      <Box
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          color: "#484a56",
        }}
      >
        <h2>Understanding the Apriori Table</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Antecedents:</strong> Items already bought together (IF
            part).
          </li>
          <li>
            <strong>Consequents:</strong> Items likely to be bought next (THEN
            part).
          </li>
          <li>
            <strong>Support (%):</strong> Frequency of the combination among all
            transactions.
          </li>
          <li>
            <strong>Confidence (%):</strong> Probability of buying Consequent
            after Antecedent.
          </li>
          <li>
            <strong>Lift:</strong> Strength of the association compared to
            random chance.
          </li>
        </ul>
        <h3>How to Use These Insights:</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            Look for rules with <strong>high Confidence (%)</strong> and{" "}
            <strong>Lift &gt; 1</strong>.
          </li>
          <li>
            Use strong rules for product recommendations, bundling, and
            marketing strategies.
          </li>
        </ul>
      </Box>

      {/* <Button variant="contained" >
        Load Apriori Results
      </Button> */}
      {hasResults ? (
        <Box sx={{ height: 600, width: "100%", mt: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <p>No Relation found in the data</p>
      )}
    </Box>
  );
};

export default Apriori;
