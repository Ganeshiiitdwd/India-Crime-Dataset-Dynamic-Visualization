import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import crimeData from "../Data/crime_data.csv";
import { csv } from "d3";

function StateWise() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCrime, setSelectedCrime] = useState("Murder");
    const [chartType, setChartType] = useState("bar");

    const crimeOptions = [
        "Murder",
        "Rape",
        "Robbery",
        "Theft",
        "Kidnapping & Abduction_Total"
    ];

    useEffect(() => {
        csv(crimeData).then((data) => {
            const stateTotals = data.filter(d => d["District"] === "Total");
            setData(stateTotals);
        });
    }, []);

    useEffect(() => {
        if (selectedCrime) {
            const stateCrimeData = data.map((d) => ({
                state: d["States/UTs"],
                crimeCount: +d[selectedCrime] || 0,
            })).sort((a, b) => b.crimeCount - a.crimeCount);

            setFilteredData(stateCrimeData);
        }
    }, [selectedCrime, data]);

    const topStates = filteredData.slice(0, 3);
    const bottomStates = filteredData.slice(-3);

    return (
        <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", paddingTop: "20px" }}>
            <Container fluid>
                <h2 className="text-center" style={{ color: "#007bff" }}>Statewise Crime Comparison</h2>

                <Row className="mb-4">
                    <Col md={6}>
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
                    <Col md={6}>
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
                                    {selectedCrime} Cases Across States
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
                                            <XAxis dataKey="state" />
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
                                            <XAxis type="category" dataKey="state" name="State" />
                                            <YAxis type="number" dataKey="crimeCount" name="Count" />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
                                <h5>Top 3 States/UTs (Highest {selectedCrime} Counts)</h5>
                                <ul>
                                    {topStates.map((state, index) => (
                                        <li key={index}>
                                            {state.state}: {state.crimeCount} cases
                                        </li>
                                    ))}
                                </ul>
                                <h5>Bottom 3 States/UTs (Lowest {selectedCrime} Counts)</h5>
                                <ul>
                                    {bottomStates.map((state, index) => (
                                        <li key={index}>
                                            {state.state}: {state.crimeCount} cases
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StateWise;
