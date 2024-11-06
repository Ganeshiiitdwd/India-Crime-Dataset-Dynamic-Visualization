import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import crimeData from "../Data/crime__data .csv";
import { csv } from "d3";
function CompareState() {
    const [data, setData] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedCrime, setSelectedCrime] = useState("Murder");
    const [filteredData, setFilteredData] = useState([]);
    
    const crimeOptions = ["Murder",
    "Rape",
    "Robbery",
    "Theft",
    "Kidnapping & Abduction_Total",
    "Riots",
    "Total Cognizable IPC crimes",
    "Counterfeiting",
    "Dowry Deaths",
    "Extortion",
    "Incidence of Rash Driving","Attempt to commit Murder"];

    useEffect(() => {
        csv(crimeData).then((data) => {
            setData(data);
            const uniqueStates = [...new Set(data.map(d => d["States/UTs"]))];
            setStates(uniqueStates);
        });
    }, []);

    useEffect(() => {
        if (selectedStates.length && selectedCrime) {
            const stateCrimeData = selectedStates.map(state => {
                const totalCrimeCount = data
                    .filter(d => d["States/UTs"] === state && d["District"] === "Total")
                    .reduce((acc, d) => acc + (+d[selectedCrime] || 0), 0);
                return { state, crimeCount: totalCrimeCount };
            });
            setFilteredData(stateCrimeData);
        }
    }, [selectedStates, selectedCrime, data]);

    const handleStateChange = (e) => {
        const { value, checked } = e.target;
        setSelectedStates(prev =>
            checked ? [...prev, value] : prev.filter(state => state !== value)
        );
    };

    return (
        <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", paddingTop: "20px" }}>
            <Container fluid>
                <h2 className="text-center" style={{ color: "#007bff" }}>Statewise Comparison</h2>
                
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
                            <Form.Label>Select States</Form.Label>
                            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                                {states.map((state, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={state}
                                        value={state}
                                        onChange={handleStateChange}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title style={{ color: "#343a40" }}>
                                    {selectedCrime} Cases Comparison Across States
                                </Card.Title>
                                {filteredData.length > 0 ? (
                                    <BarChart
                                        width={800}
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
                                    <p className="text-center">Select states and crime type to display the data</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default CompareState
