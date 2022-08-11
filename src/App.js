import { Container, Row, Col } from 'react-bootstrap';
import Actor from './components/Actor';
import SearchQuery from './components/SearchQuery';
import { fetchData } from './lib/Api';
import { useEffect, useState } from 'react';

function App() {
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    //select random year between 1980 and current year
    const year =
      Math.floor(Math.random() * (new Date().getFullYear() - 1980 + 1)) + 1980;
    //select number between 0 and 19 for index of movie
    const index = Math.floor(Math.random() * 20);

    fetchData('/discover/movie', {
      with_cast: true,
      primary_release_year: `${year}`,
      without_genres: '16,18',
    }).then((data) => {
      setMovie(data.results[index]);
    });
  }, []);

  useEffect(() => {
    if (movie.id) {
      fetchData(`/movie/${movie.id}/credits`, {}).then((data) => {
        setCast(data.cast.slice(0, 6));
      });
    }
  }, [movie]);

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Guess Movie</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">
            An actors name and photo will pop up on the screen, guess which
            movie they are from! You have six guesses. Good luck!
          </h4>
        </Col>
      </Row>
      <Row>
        {cast.length > 0 &&
          cast.map((actor, index) => (
            <Col xs={2}>
              <Actor
                key={actor.id}
                actor={actor}
                visible={index < guesses.length + 1}
              />
            </Col>
          ))}
      </Row>
      <Row>
        <Col>
          <SearchQuery setGuesses={setGuesses} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
