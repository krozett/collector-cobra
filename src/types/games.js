import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const games = {
  label: 'Games',
  icon: 'videogame_asset',
  searchLabel: 'Game Title',
  searchResultsPerPage: 100,
  searchTransform: json => [
    json.results.map(result => ({
      id: result.guid,
      display: result.name + ' (' + result.expected_release_year + ')',
      uri: result.site_detail_url
    })),
    json.number_of_total_results
  ],
  fetchTransform: (json) => {
    const developer = json.results.developers.map(dev => dev.name).join(' & ')
    const year = json.results.expected_release_year
    const month = json.results.expected_release_month
    const day = json.results.expected_release_day
    let released

    // Original release date is preferable
    if (json.results.original_release_date) {
      released = parseDateUTC(json.results.original_release_date)
    }

    // But if needed, we can construct it from the 'expected' bits
    else if (year && month && day) {
      const dateObj = new Date(year, month - 1, day)
      released = parseDateUTC(dateObj)
    }

    return {
      giantBombGUID: json.results.guid,
      title: json.results.name,
      developer,
      released: firebase.firestore.Timestamp.fromDate(released),
      beat: false,
      exhausted: false,
      releases: [],
      mods: [],
      links: [],
      notes: null
    }
  },
  generateIndexEntry: item => ({
    primaryText: item.title,
    secondaryText: timestampToDate(item.released).getUTCFullYear()
  }),
  fields: [{
    id: 'giantBombGUID',
    type: 'readOnly',
    label: 'Giant Bomb GUID',
    linkTitle: 'Giant Bomb',
    linkURI: id => 'https://www.giantbomb.com/game/' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'videogame_asset'
  }, {
    id: 'developer',
    type: 'text',
    label: 'Developer',
    icon: 'account_box'
  }, {
    id: 'released',
    type: 'date',
    label: 'Released'
  }, {
    id: 'beat',
    type: 'boolean',
    label: 'Beat'
  }, {
    id: 'exhausted',
    type: 'boolean',
    label: 'Exhausted'
  }, {
    id: 'releases',
    type: 'array',
    label: 'Releases',
    icon: 'list',
    subfields: [{
      id: 'title',
      type: 'text',
      label: 'Title',
      icon: 'label'
    }, {
      id: 'released',
      type: 'date',
      label: 'Released'
    }, {
      id: 'platform',
      type: 'text',
      label: 'Platform',
      icon: 'devices'
    }, {
      id: 'region',
      type: 'text',
      label: 'Region',
      icon: 'language'
    }]
  }, {
    id: 'mods',
    type: 'array',
    label: 'Mods',
    icon: 'list',
    subfields: [{
      id: 'title',
      type: 'text',
      label: 'Title',
      icon: 'label'
    }, {
      id: 'beat',
      type: 'boolean',
      label: 'Beat'
    }]
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
