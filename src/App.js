import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  ListGroup,
  Modal,
} from 'react-bootstrap';
import Actor from './components/Actor';
import SearchQuery from './components/SearchQuery';
import { fetchData } from './lib/Api';
import { useEffect, useState } from 'react';
import Bars from 'react-bars';
import Confetti from 'react-confetti';
import myGif from './assets/Nope.gif';

function App() {
  const [movie, setMovie] = useState(
    localStorage.getItem('movie')
      ? JSON.parse(localStorage.getItem('movie'))
      : {}
  );
  const [cast, setCast] = useState(
    localStorage.getItem('cast') ? JSON.parse(localStorage.getItem('cast')) : []
  );
  const [guesses, setGuesses] = useState(
    localStorage.getItem('guesses')
      ? JSON.parse(localStorage.getItem('guesses'))
      : []
  );
  const [score, setScore] = useState(
    localStorage.getItem('score')
      ? JSON.parse(localStorage.getItem('score'))
      : {
          wins: 0,
          losses: 0,
          numGuesses: [],
        }
  );
  const [gameState, setGameState] = useState('playing');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!movie.id) {
      selectMovie();
    }
  }, [movie.id]);

  useEffect(() => {
    if (movie.id) {
      fetchData(`/movie/${movie.id}/credits`, {}).then((data) => {
        setCast(data.cast.slice(0, 6));
        localStorage.setItem('cast', JSON.stringify(data.cast.slice(0, 6)));
      });
    }
  }, [movie]);

  useEffect(() => {
    if (!gameState === 'playing') {
      return;
    }
    const isDuplicate = guesses.some((guess) => guess.id === movie.id);
    if (isDuplicate) {
      setGameState('win');
      setScore({
        wins: score.wins + 1,
        losses: score.losses,
        numGuesses: [...score.numGuesses, guesses.length],
      });
      localStorage.setItem('score', JSON.stringify(score));
      return;
    }
    if (guesses.length === 6) {
      setGameState('lose');
      setScore({
        wins: score.wins,
        losses: score.losses + 1,
      });
      localStorage.setItem('score', JSON.stringify(score));
    }
  }, [guesses, movie, gameState, score]);

  useEffect(() => {
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }, [guesses]);

  const resetGame = () => {
    setGuesses([]);
    setGameState('playing');
    selectMovie();
  };

  const selectMovie = () => {
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
      localStorage.setItem('movie', JSON.stringify(data.results[index]));
    });
  };

  const parseData = (data) => {
    const labels = ['1', '2', '3', '4', '5', '6'];
    const dataObjs = [];
    labels.forEach((label) => {
      const num = data.numGuesses.filter((guess) => {
        return guess === parseInt(label);
      });
      dataObjs.push({
        label,
        value: (num.length * 100) / data.numGuesses.length,
      });
    });
    console.log(dataObjs);
    return dataObjs;
  };

  console.log(movie);

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
            An actor's name and photo will pop up on the screen, guess which
            movie they are from! You have six guesses. Good luck!
          </h4>
        </Col>
      </Row>
      {gameState === 'win' && (
        <Row>
          <Col>
            <h5 className="text-center">
              You guessed the movie correctly! <br />
              <span className="text-success">
                {movie.title} (
                {movie.release_date ? movie.release_date.slice(0, 4) : ''})
              </span>
            </h5>
            <Confetti />
          </Col>
        </Row>
      )}
      {gameState === 'lose' && (
        <Row>
          <Col>
            <h5 className="text-center">
              <div>
                <img src={myGif} alt="my-gif" />
              </div>
              You ran out of guesses! <br />
              <span className="text-danger">
                {movie.title} (
                {movie.release_date ? movie.release_date.slice(0, 4) : ''})
              </span>
            </h5>
          </Col>
        </Row>
      )}
      <Row>
        {cast.length > 0 &&
          cast.map((actor, index) => (
            <Col xs={2} key={actor.id}>
              <Actor
                actor={actor}
                visible={index < guesses.length + 1 || gameState !== 'playing'}
              />
            </Col>
          ))}
      </Row>
      {gameState === 'playing' && (
        <Row>
          <Col>
            <SearchQuery setGuesses={setGuesses} />
          </Col>
        </Row>
      )}
      {gameState !== 'playing' && (
        <Row className="text-center" style={{ marginBottom: '15px' }}>
          <Col>
            <Button variant="primary" onClick={() => resetGame()}>
              Play Again
            </Button>
          </Col>
        </Row>
      )}
      {guesses.length > 0 && (
        <Row>
          <Col xs={{ offset: 2, span: 8 }}>
            <ListGroup>
              {guesses.map((guess, idx) => (
                <ListGroup.Item
                  key={idx}
                  variant={gameState === 'win' ? 'success' : 'danger'}
                >
                  {guess.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <FormGroup className="text-center">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Score
            </Button>
          </FormGroup>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton />
        <Modal.Body>
          <h5 className="text-center">
            {score.wins} {score.wins === 1 ? 'Win' : 'Wins'}, {score.losses}{' '}
            {score.losses === 1 ? 'Loss' : 'Losses'}
          </h5>
          <h6 className="text-center">Guess Distribution</h6>
          <Bars
            style={{
              borderRadius: '0px',
              margin: '0 auto',
              width: '100%',
              height: '20px',
            }}
            data={parseData(score)}
            verticalSpacing={0}
            barBackgroundColor={'#303030'}
            barColor={'#111111'}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;
