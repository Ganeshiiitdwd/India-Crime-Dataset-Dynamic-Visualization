import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import crimeData from "../Data/crime__data .csv";
import { csv } from "d3";

function DistrictWise() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCrime, setSelectedCrime] = useState("Murder");
  const [chartType, setChartType] = useState("bar");
  const [subCategoryData, setSubCategoryData] = useState([]);

  const crimeOptions = [
    "Murder",
    "Rape",
    "Robbery",
    "Theft",
    "Kidnapping & Abduction_Total",
    "Riots",
    "Total Cognizable IPC crimes",
    "Counterfeiting",
    "Dowry Deaths",
    "Extortion",
    "Incidence of Rash Driving","Attempt to commit Murder"
  ];

  const crimeSubCategories = {
    Murder: null,
    Rape: ["Rape_Gang Rape", "Rape_Others"],
    Robbery: null,
    Theft: ["Auto Theft", "Other Thefts"],
    "Kidnapping & Abduction_Total": [
      "Kidnapping & Abduction",
      "Kidnapping & Abduction in order to Murder",
      "Kidnapping for Ransom",
      "Kidnapping & Abduction of Women to compel her for marriage",
      "Other Kidnapping",
    ],
    Riots: [
      "Riots_Communal",
      "Riots_Industrial",
      "Riots_Political",
      "Riots_Caste Conflict",
      "Riots_Others",
    ],
    "Counterfeiting": [
      "Counterfeit Offences related to Counterfeit Coin",
      "Counterfeit currency & Bank notes",
    ],
    "Total Cognizable IPC crimes": null,
    "Dowry Deaths": null,
    "Extortion": null,
    "Incidence of Rash Driving": null,
  };

  useEffect(() => {
    csv(crimeData).then((data) => {
      setData(data);
      const uniqueStates = [...new Set(data.map((d) => d["States/UTs"]))];
      setStates(uniqueStates);
    });
  }, []);

  useEffect(() => {
    if (selectedState && selectedCrime) {
      const districtCrimeData = {};
  
      data
        .filter((d) => d["States/UTs"] === selectedState && d["District"] !== "Total")
        .forEach((d) => {
          const district = d["District"].split(" ")[0];
          const crimeCount = +d[selectedCrime] || 0;
  
          if (districtCrimeData[district]) {
            districtCrimeData[district] += crimeCount;
          } else {
            districtCrimeData[district] = crimeCount;
          }
        });
  
      const aggregatedData = Object.entries(districtCrimeData)
        .map(([district, crimeCount]) => ({ district, crimeCount }))
        .sort((a, b) => b.crimeCount - a.crimeCount);
  
      setFilteredData(aggregatedData);
  
      // Check for subcategories and calculate their data if available
      const subCategories = crimeSubCategories[selectedCrime];
      if (subCategories) {
        const totalDistrictData = data.find(
          (d) => d["States/UTs"] === selectedState && d["District"] === "Total"
        );
  
        if (totalDistrictData) {
          const totalValue = subCategories.reduce(
            (sum, sub) => sum + (+totalDistrictData[sub] || 0),
            0
          );
  
          const subCategoryData = subCategories
            .map((sub) => ({
              name: sub,
              value: ((+totalDistrictData[sub] || 0) / totalValue) * 100, // Calculate percentage
            }))
            .sort((a, b) => b.value - a.value); // Sort in descending order by percentage
  
          setSubCategoryData(subCategoryData);
        } else {
          setSubCategoryData([]);
        }
      } else {
        setSubCategoryData([]);
      }
    }
  }, [selectedState, selectedCrime, data]);
  

  const topDistricts = filteredData.slice(0, 3);
  const bottomDistricts = filteredData.slice(-3);
  const colors = ["#003366", "#FF6347", "#3CB371", "#FFD700", "#FF69B4"];

  return (
    <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", paddingTop: "20px" }}>
      <Container fluid>
        <h2 className="text-center" style={{ color: "#007bff" }}>
          DistrictWise Comparison
        </h2>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Select State</Form.Label>
              <Form.Control
                as="select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Select Crime Type</Form.Label>
              <Form.Control
                as="select"
                value={selectedCrime}
                onChange={(e) => setSelectedCrime(e.target.value)}
              >
                {crimeOptions.map((crime, index) => (
                  <option key={index} value={crime}>
                    {crime}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Select Chart Type</Form.Label>
              <Form.Control
                as="select"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="bar">Bar Chart</option>
                <option value="dot">Dot Plot</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title style={{ color: "#343a40" }}>
                  {selectedCrime} Cases in Districts of {selectedState}
                </Card.Title>
                {filteredData.length > 0 ? (
                  chartType === "bar" ? (
                    <BarChart
                      width={700}
                      height={400}
                      data={filteredData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="district" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="crimeCount" fill="#003366" />
                    </BarChart>
                  ) : (
                    <ScatterChart
                      width={700}
                      height={400}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="category" dataKey="district" name="District" />
                      <YAxis type="number" dataKey="crimeCount" name="Count" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Legend />
                      <Scatter name="Crime Count" data={filteredData} fill="#8884d8" />
                    </ScatterChart>
                  )
                ) : (
                  <p className="text-center">Select filters to display the data</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title style={{ color: "#343a40" }}>Summary</Card.Title>
                <h5>Top 3 Districts (Highest {selectedCrime} Counts)</h5>
                <ul>
                  {topDistricts.map((d, index) => (
                    <li key={index}>
                      {d.district}: {d.crimeCount} cases
                    </li>
                  ))}
                </ul>
                <h5>Bottom 3 Districts (Lowest {selectedCrime} Counts)</h5>
                <ul>
                  {bottomDistricts.map((d, index) => (
                    <li key={index}>
                      {d.district}: {d.crimeCount} cases
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            {subCategoryData.length > 0 && (
              <Card className="shadow-sm mt-4">
                <Card.Body>
                  <Card.Title style={{ color: "#343a40" }}>Subcategory Distribution</Card.Title>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={subCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={false} // Hide the labels on the pie chart
                    >
                      {subCategoryData.map((_, index) => (
                        <Cell key={index} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <ul style={{ paddingTop: "10px" }}>
                    {subCategoryData.map((item, index) => (
                      <li key={index} style={{ color: colors[index % colors.length] }}>
                        {item.name}: {item.value.toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DistrictWise;
