import { useEffect, useState } from 'react';
import { fetchData } from '../lib/Api';

const GetMovie = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    fetchData('/movie/550', {}).then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>GetMovie</h1>
    </div>
  );
};

export default GetMovie;
