// src/App.js
import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DistrictComparison from "./Component/DistrictWise";
import StateComparison from "./Component/StateWise";
import CompareState from './Component/CompareState'; // Import the new component

function App() {
  const [view, setView] = useState("district");

  return (
    <Container
      fluid
      style={{
        padding: "20px",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center my-4" style={{ color: "#007bff" }}>
        India Crime Dashboard
      </h1>

      <Row className="text-center mb-4">
        <Col>
          <Button
            variant={view === "district" ? "primary" : "outline-primary"}
            onClick={() => setView("district")}
          >
            Districtwise Comparison
          </Button>
          <Button
            variant={view === "state" ? "primary" : "outline-primary"}
            onClick={() => setView("state")}
            className="ml-3"
          >
            Statewise Comparison
          </Button>
          <Button
            variant={view === "multi-state" ? "primary" : "outline-primary"}
            onClick={() => setView("multi-state")}
            className="ml-3"
          >
            Multi-State Crime Comparison
          </Button>
        </Col>
      </Row>

      {view === "district" && <DistrictComparison />}
      {view === "state" && <StateComparison />}
      {view === "multi-state" && <CompareState />}
    </Container>
  );
}

export default App;
