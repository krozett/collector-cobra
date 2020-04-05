import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const music = {
  label: 'Music',
  icon: 'music_note',
  searchLabel: 'Album Title',
  searchResultsPerPage: 50,
  searchTransform: json => [
    json.results.map(result => ({
      id: result.id,
      display: result.title + ' (' + result.country + ', ' + result.year +
        ', ' + result.format.join(', ') + ')',
      uri: 'https://www.discogs.com' + result.uri
    })),
    json.pagination.items
  ],
  fetchTransform: json => ({
    discogsID: parseInt(json.id, 10),
    title: json.title,
    artist: json.artists_sort,
    released: firebase.firestore.Timestamp.fromDate(parseDateUTC(
      json.released
    )),
    listened: false,
    links: [],
    notes: null
  }),
  blankItem: {
    discogsID: 0,
    title: '',
    artist: '',
    released: firebase.firestore.Timestamp.fromDate(new Date()),
    listened: false,
    links: [],
    notes: null
  },
  generateIndexEntry: (item) => {
    const year = timestampToDate(item.released).getUTCFullYear()

    return {
      primaryText: item.title,
      secondaryText: item.artist + ' (' + year + ')'
    }
  },
  fields: [{
    id: 'discogsID',
    type: 'number',
    label: 'Discogs ID',
    icon: 'folder_open',
    apiTitle: 'Discogs',
    apiURI: id => 'https://www.discogs.com/release/' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'album'
  }, {
    id: 'artist',
    type: 'text',
    label: 'Artist',
    icon: 'account_box'
  }, {
    id: 'released',
    type: 'date',
    label: 'Released'
  }, {
    id: 'listened',
    type: 'boolean',
    label: 'Listened'
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

export default music
