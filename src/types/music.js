import firebase from 'firebase'

import config from 'config'
import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const music = {
  label: 'Music',
  icon: 'music_note',
  searchLabel: 'Album Title',
  searchURI: query => (
    'https://api.discogs.com/database/search?type=release&title=' +
    encodeURI(query) + '&key=' + config.discogsKey + '&secret=' +
    config.discogsSecret
  ),
  searchTransform: json => json.results.map(result => ({
    id: result.id,
    display: result.title + ' (' + result.country + ', ' + result.year + ')',
    uri: 'https://www.discogs.com' + result.uri
  })),
  fetchURI: id => 'https://api.discogs.com/releases/' + id,
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
  idFormat: {
    fields: [
      'artist',
      'title',
      item => timestampToDate(item.released).getUTCFullYear()
    ],
    sortBy: 2,
    primaryText: 2,
    secondaryText: id => id[1] + ' (' + id[3] + ')'
  },
  fields: [{
    id: 'discogsID',
    type: 'readOnly',
    label: 'Discogs ID',
    linkTitle: 'Discogs',
    linkURI: id => 'https://www.discogs.com/release/' + id
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
