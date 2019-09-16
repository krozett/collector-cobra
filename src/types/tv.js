import firebase from 'firebase'

import config from 'config'
import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const tv = {
  label: 'TV',
  icon: 'tv',
  searchLabel: 'Series Name',
  searchResultsPerPage: 20,
  searchURI: (query, page) => (
    'https://api.themoviedb.org/3/search/tv?api_key=' + config.tmdbKey +
    '&language=en-US&query=' + encodeURI(query) +
    (page ? ('&page=' + page) : '')
  ),
  searchTransform: json => [
    json.results.map(result => ({
      id: result.id,
      display: result.name + ' (' + result.first_air_date + ')',
      uri: 'https://www.themoviedb.org/tv/' + result.id
    })),
    json.total_results
  ],
  fetchURI: id => (
    'https://api.themoviedb.org/3/tv/' + id + '?api_key=' +
    config.tmdbKey + '&language=en-US'
  ),
  fetchTransform: (json) => {
    const released = parseDateUTC(json.first_air_date)

    const seasons = json.seasons.map((season) => {
      const seasonReleased = parseDateUTC(season.air_date)

      return {
        name: season.name,
        released: firebase.firestore.Timestamp.fromDate(seasonReleased),
        episodes: parseInt(season.episode_count, 10),
        watched: false
      }
    })

    return {
      tmdbID: parseInt(json.id, 10),
      title: json.name,
      released: firebase.firestore.Timestamp.fromDate(released),
      runtime: parseInt(json.episode_run_time[0], 10),
      aspectRatio: null,
      seasons,
      exhausted: false,
      links: [],
      notes: null
    }
  },
  generateIndexEntry: item => ({
    primaryText: item.title,
    secondaryText: timestampToDate(item.released).getUTCFullYear()
  }),
  fields: [{
    id: 'tmdbID',
    type: 'readOnly',
    label: 'The Movie Database ID',
    linkTitle: 'The Movie Database',
    linkURI: id => 'https://www.themoviedb.org/tv/' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'tv'
  }, {
    id: 'released',
    type: 'date',
    label: 'First Aired'
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
    id: 'seasons',
    type: 'array',
    label: 'Seasons',
    icon: 'list',
    subfields: [{
      id: 'name',
      type: 'text',
      label: 'Name',
      icon: 'label'
    }, {
      id: 'released',
      type: 'date',
      label: 'Aired'
    }, {
      id: 'episodes',
      type: 'number',
      label: 'Episodes',
      icon: 'video_library'
    }, {
      id: 'watched',
      type: 'boolean',
      label: 'Watched'
    }]
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

export default tv
