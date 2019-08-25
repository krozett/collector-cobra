import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const movies = {
  label: 'Books',
  icon: 'book',
  searchLabel: 'Book Title',
  searchResultsPerPage: 20,
  searchURI: (query, page) => (
    'https://www.googleapis.com/books/v1/volumes?maxResults=20&q='
     + encodeURI(query) + (page ? ('&startIndex=' + (page - 1) * 20) : '')
  ),
  searchTransform: json => [
    json.items.map((item) => {
      const author = (item.volumeInfo.authors || []).join(' & ')
      const isbn10 = (item.volumeInfo.industryIdentifiers || []).find(id => (
        id.type === 'ISBN_10'
      ))
      const isbn13 = (item.volumeInfo.industryIdentifiers || []).find(id => (
        id.type === 'ISBN_13'
      ))

      return {
        id: item.id,
        display: author + ' - ' + item.volumeInfo.title + ' (' +
          item.volumeInfo.publishedDate + ', ' +
          (isbn13 ? isbn13.identifier : 'null') + ', ' +
          (isbn10 ? isbn10.identifier : 'null') + ')',
        uri: 'https://books.google.com/books?id=' + item.id
      }
    }),
    json.totalItems
  ],
  fetchURI: id => (
    'https://www.googleapis.com/books/v1/volumes/' + id
  ),
  fetchTransform: (json) => {
    let isbn = null
    const isbn10 = (json.volumeInfo.industryIdentifiers || []).find(id => (
      id.type === 'ISBN_10'
    ))
    const isbn13 = (json.volumeInfo.industryIdentifiers || []).find(id => (
      id.type === 'ISBN_13'
    ))

    if (isbn13) {
      isbn = isbn13.identifier
    }
    else if (isbn10) {
      isbn = isbn10.identifier
    }

    return {
      googleBooksID: json.id,
      title: json.volumeInfo.title,
      author: (json.volumeInfo.authors || []).join(' & '),
      isbn,
      published: firebase.firestore.Timestamp.fromDate(parseDateUTC(
        json.volumeInfo.publishedDate
      )),
      pages: parseInt(json.volumeInfo.pageCount, 10),
      read: false,
      links: [],
      notes: null
    }
  },
  idFormat: {
    fields: [
      'author',
      'title',
      item => timestampToDate(item.published).getUTCFullYear()
    ],
    sortBy: 2,
    primaryText: 2,
    secondaryText: id => id[1] + ' (' + id[3] + ')'
  },
  fields: [{
    id: 'googleBooksID',
    type: 'readOnly',
    label: 'Google Books ID',
    linkTitle: 'Google Books',
    linkURI: id => 'https://books.google.com/books?id=' + id
  }, {
    id: 'title',
    type: 'text',
    label: 'Title',
    icon: 'book'
  }, {
    id: 'author',
    type: 'text',
    label: 'Author',
    icon: 'person'
  }, {
    id: 'isbn',
    type: 'text',
    label: 'ISBN',
    icon: 'line_weight'
  }, {
    id: 'published',
    type: 'date',
    label: 'Published'
  }, {
    id: 'pages',
    type: 'number',
    label: 'Pages',
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

export default movies
