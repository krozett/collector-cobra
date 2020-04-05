import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const movies = {
  label: 'Movies',
  icon: 'movie',
  searchLabel: 'Movie Title',
  searchResultsPerPage: 20,
  searchTransform: json => [
    json.results.map(result => ({
      id: result.id,
      display: result.title + ' (' + result.release_date + ')',
      uri: 'https://www.themoviedb.org/movie/' + result.id
    })),
    json.total_results
  ],
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
  blankItem: {
    tmdbID: 0,
    title: '',
    released: firebase.firestore.Timestamp.fromDate(new Date()),
    runtime: 0,
    aspectRatio: null,
    watched: false,
    exhausted: false,
    links: [{
      title: 'IMDB',
      uri: 'https://www.imdb.com/title/'
    }],
    notes: null
  },
  generateIndexEntry: item => ({
    primaryText: item.title,
    secondaryText: timestampToDate(item.released).getUTCFullYear()
  }),
  fields: [{
    id: 'tmdbID',
    type: 'number',
    label: 'The Movie Database ID',
    icon: 'folder_open',
    apiTitle: 'The Movie Database',
    apiURI: id => 'https://www.themoviedb.org/movie/' + id
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
/*    id: 'connections',
    type: 'array',
    label: 'Connections',
    icon: 'list',
    connections: true
  }, {*/
    id: 'notes',
    type: 'text',
    label: 'Notes',
    icon: 'notes'
  }]
}

export default movies
