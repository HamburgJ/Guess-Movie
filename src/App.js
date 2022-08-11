import { Container, Row, Col } from 'react-bootstrap';
import Actor from './components/Actor';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Guess Movie</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Actor />
        </Col>
      </Row>
      <Row>
        <Col>
          <div class="input-group">
            <input
              type="search"
              id="form1"
              class="form-control"
              placeholder="Enter Movie Name Here"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
