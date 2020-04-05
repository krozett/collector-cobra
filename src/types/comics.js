import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const games = {
  label: 'Comics',
  icon: 'image',
  searchLabel: 'Comic Title',
  searchResultsPerPage: 100,
  searchTransform: json => [
    json.results.map((result) => {
      const url = result.site_detail_url.replace(/\/$/, '')
      const id = url.split('/').pop()

      return {
        id,
        display: result.name + ' (' + result.start_year + ')',
        uri: result.site_detail_url
      }
    }),
    json.number_of_total_results
  ],
  fetchTransform: (json) => {
    const url = json.results.site_detail_url.replace(/\/$/, '')
    const id = url.split('/').pop()
    const released = parseDateUTC(json.results.start_year)
    const publisher = json.results.publisher || {}

    return {
      comicVineGUID: id,
      title: json.results.name,
      publisher: publisher.name || '',
      released: firebase.firestore.Timestamp.fromDate(released),
      issues: json.results.count_of_issues,
      read: false,
      links: [],
      notes: null
    }
  },
  blankItem: {
    comicVineGUID: '',
    title: '',
    publisher: '',
    released: firebase.firestore.Timestamp.fromDate(new Date()),
    issues: 0,
    read: false,
    links: [],
    notes: null
  },
  generateIndexEntry: item => ({
    primaryText: item.title,
    secondaryText: timestampToDate(item.released).getUTCFullYear()
  }),
  fields: [{
    id: 'comicVineGUID',
    type: 'text',
    label: 'Comic Vine GUID',
    icon: 'folder_open',
    apiTitle: 'Comic Vine',
    apiURI: id => 'https://comicvine.gamespot.com/volume/' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'book'
  }, {
    id: 'publisher',
    type: 'text',
    label: 'Publisher',
    icon: 'account_box'
  }, {
    id: 'released',
    type: 'date',
    label: 'Released'
  }, {
    id: 'issues',
    type: 'number',
    label: 'Issues',
    icon: 'file_copy'
  }, {
    id: 'read',
    type: 'boolean',
    label: 'Read'
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

export default games
