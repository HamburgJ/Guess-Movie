import React from 'react';
import { Card } from 'react-bootstrap';
import { useImageData } from '../lib/Api';

const Actor = ({ actor, visible }) => {
  const images = useImageData();

  if (!actor) {
    return null;
  }

  let src = '/placeholder.png';
  let title = '';

  if (visible) {
    title = actor.name;
    if (images && actor.profile_path) {
      src = `${images.base_url}/${images.profile_sizes[1]}/${actor.profile_path}`;
    }
  }

  return (
    <Card>
      <Card.Img variant="top" src={src} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default Actor;
