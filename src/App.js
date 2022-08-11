import { Container, Row, Col } from 'react-bootstrap';
import Actor from './components/Actor';
import SearchQuery from './components/SearchQuery';

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
          <SearchQuery />
        </Col>
      </Row>
      
    </Container>
  );
}

export default App;
