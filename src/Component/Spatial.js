// src/Component/StateWise.js
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_map from "highcharts/modules/map";
import mapDataIndia from "@highcharts/map-collection/countries/in/in-all.geo.json";

import { csv } from "d3";
import crimeData from "../Data/crime_data.csv";
import "bootstrap/dist/css/bootstrap.min.css";

HC_map(Highcharts);

function Spatial() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCrime, setSelectedCrime] = useState("Murder");

    const crimeOptions = [
        "Murder",
        "Rape",
        "Robbery",
        "Theft",
        "Kidnapping & Abduction_Total",
    ];

    // Load CSV data and filter for "Total" in each state
    useEffect(() => {
        csv(crimeData).then((data) => {
            const stateTotals = data.filter((d) => d["District"] === "Total");
            setData(stateTotals);
        });
    }, []);

    // Filter data based on selected crime type
    useEffect(() => {
        if (selectedCrime) {
            const stateCrimeData = data.map((d) => ({
                state: d["States/UTs"],
                crimeCount: +d[selectedCrime] || 0,
            }));

            setFilteredData(stateCrimeData);
        }
    }, [selectedCrime, data]);

    // Map Highcharts data format to match states with crime count
    const mapData = mapDataIndia.features.map((feature) => {
        const stateData = filteredData.find(
            (d) => d.state.toLowerCase() === feature.properties.name.toLowerCase()
        );
        return {
            name: feature.properties.name,
            value: stateData ? stateData.crimeCount : 0,
        };
    });

    const options = {
        chart: {
            map: "countries/in/in-all",
            height: 500,
        },
        title: {
            text: `Crime Rate in India by State - ${selectedCrime}`,
        },
        colorAxis: {
            min: 0,
            stops: [
                [0, "#FFEDA0"],
                [0.5, "#FD8D3C"],
                [1, "#BD0026"]
            ]
        },
        tooltip: {
            headerFormat: "",
            pointFormat: "<b>{point.name}</b>: {point.value} cases",
        },
        series: [
            {
                data: mapData,
                mapData: mapDataIndia,
                joinBy: "name",
                name: `${selectedCrime} Cases`,
                states: {
                    hover: {
                        color: "#a4edba",
                    },
                },
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                },
            },
        ],
    };

    return (
        <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh", paddingTop: "20px" }}>
            <Container fluid>
                <h2 className="text-center" style={{ color: "#007bff" }}>Statewise Crime Comparison</h2>

                <Row className="mb-4">
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
                </Row>

                <Row>
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    constructorType={"mapChart"}
                                    options={options}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Spatial;
