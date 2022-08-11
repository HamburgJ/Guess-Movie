import {api_key} from './Constants';
const base_url = 'https://api.themoviedb.org/3';

export const fetchData = (route, params={}) => {
    return fetch(`${base_url}${route}?api_key=${api_key}${Object.entries(params).map(([k, v]) => `&${k}=${v}`).join('')}`)
        .then(response => response.json());
};
