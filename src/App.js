import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Guess Movie</h1>
          <div>
            <input placeholder="Enter Movie Title"/>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
