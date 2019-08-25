import firebase from 'firebase'

import config from 'config'
import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const movies = {
  label: 'Movies',
  icon: 'movie',
  searchLabel: 'Movie Title',
  searchResultsPerPage: 20,
  searchURI: (query, page) => (
    'https://api.themoviedb.org/3/search/movie?api_key=' + config.tmdbKey +
    '&language=en-US&include_adult=true&query=' + encodeURI(query) +
    (page ? ('&page=' + page) : '')
  ),
  searchTransform: json => [
    json.results.map(result => ({
      id: result.id,
      display: result.title + ' (' + result.release_date + ')',
      uri: 'https://www.themoviedb.org/movie/' + result.id
    })),
    json.total_results
  ],
  fetchURI: id => (
    'https://api.themoviedb.org/3/movie/' + id + '?api_key=' +
    config.tmdbKey + '&language=en-US'
  ),
  fetchTransform: json => ({
    tmdbID: parseInt(json.id, 10),
    title: json.title,
    released: firebase.firestore.Timestamp.fromDate(parseDateUTC(
      json.release_date
    )),
    runtime: parseInt(json.runtime, 10),
    aspectRatio: null,
    watched: false,
    exhausted: false,
    links: [{
      title: 'IMDB',
      uri: 'https://www.imdb.com/title/' + json.imdb_id
    }],
    notes: null
  }),
  idFormat: {
    fields: [
      'title',
      item => timestampToDate(item.released).getUTCFullYear()
    ],
    sortBy: 1,
    primaryText: 1,
    secondaryText: 2
  },
  fields: [{
    id: 'tmdbID',
    type: 'readOnly',
    label: 'The Movie Database ID',
    linkTitle: 'The Movie Database',
    linkURI: id => 'https://www.themoviedb.org/movie/' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'movie'
  }, {
    id: 'released',
    type: 'date',
    label: 'Released'
  }, {
    id: 'runtime',
    type: 'number',
    label: 'Runtime',
    icon: 'hourglass_empty'
  }, {
    id: 'aspectRatio',
    type: 'number',
    label: 'Aspect Ratio',
    icon: 'aspect_ratio'
  }, {
    id: 'watched',
    type: 'boolean',
    label: 'Watched'
  }, {
    id: 'exhausted',
    type: 'boolean',
    label: 'Exhausted'
  }, {
    id: 'links',
    type: 'array',
    label: 'Links',
    icon: 'list',
    links: true
  }, {
    id: 'notes',
    type: 'text',
    label: 'Notes',
    icon: 'notes'
  }]
}

export default movies
