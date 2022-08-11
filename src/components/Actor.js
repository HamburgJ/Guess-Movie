import React from 'react';
import { Card } from 'react-bootstrap';
import { useImageData } from '../lib/Api';

const Actor = ({ actor, visible }) => {
  const images = useImageData();

  if (actor === null) {
    return null;
  }

  return (
    <Card
      style={{
        width: '150px',
      }}
    >
      {images && actor.profile_path && (
        <Card.Img
          variant="top"
          src={`${images.base_url}/${images.profile_sizes[1]}/${actor.profile_path}`}
        />
      )}
      <Card.Body>
        <Card.Title>{actor.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default Actor;
