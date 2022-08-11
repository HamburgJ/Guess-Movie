import React, { useCallback, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { render } from 'react-dom';
import { fetchData } from '../lib/Api';

import 'react-bootstrap-typeahead/css/Typeahead.css';

const CACHE = {};
const PER_PAGE = 50;

function makeAndHandleRequest(query, page = 1) {
  return fetchData('/search/movie', {
    query: query,
    page: page,
  }).then((resp) => {
    //console.log(resp);
    const options = resp.results.map((r) => ({
      title: r.title,
      release_date: r.release_date,
      id: r.id,
    }));
    return { options, total_count: resp.total_results };
  });
}

function SearchQuery({ setGuesses }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({});

  const handleInputChange = (q) => {
    setQuery(q);
  };

  const handlePagination = (e, shownResults) => {
    const cachedQuery = CACHE[query];

    // Don't make another request if:
    // - the cached results exceed the shown results
    // - we've already fetched all possible results
    if (
      cachedQuery.options.length > shownResults ||
      cachedQuery.options.length === cachedQuery.total_count
    ) {
      return;
    }

    setIsLoading(true);

    const page = cachedQuery.page + 1;

    makeAndHandleRequest(query, page).then((resp) => {
      const options = cachedQuery.options.concat(resp.options);
      CACHE[query] = { ...cachedQuery, options, page };

      setIsLoading(false);
      setOptions(options);
    });
  };

  // `handleInputChange` updates state and triggers a re-render, so
  // use `useCallback` to prevent the debounced search handler from
  // being cancelled.
  const handleSearch = useCallback((q) => {
    if (CACHE[q]) {
      setOptions(CACHE[q].options);
      return;
    }

    setIsLoading(true);
    makeAndHandleRequest(q).then((resp) => {
      CACHE[q] = { ...resp, page: 1 };

      setIsLoading(false);
      setOptions(resp.options);
    });
  }, []);

  //console.log(options);
  return (
    <Row>
      <AsyncTypeahead
        id="async-pagination-example"
        isLoading={isLoading}
        labelKey="title"
        maxResults={PER_PAGE - 1}
        minLength={2}
        onInputChange={handleInputChange}
        onPaginate={handlePagination}
        onSearch={handleSearch}
        options={options}
        paginate
        placeholder="Search For A Movie..."
        renderMenuItemChildren={(option) => (
          <div key={option.id}>
            <span>
              {option.title} ({option.release_date.slice(0, 4)})
            </span>
          </div>
        )}
        useCache={false}
        onChange={(selected) => {
          console.log(selected);
          setSelected(selected[0]);
        }}
      />
      <Button
        variant="primary"
        onClick={() => {
          if (selected.id) {
            setGuesses((prev) => [
              selected,
              ...prev.filter((g) => g.id !== selected.id),
            ]);
          }
        }}
      >
        Guess
      </Button>
    </Row>
  );
}

export default SearchQuery;
