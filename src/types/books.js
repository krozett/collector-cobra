import firebase from 'firebase'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const movies = {
  label: 'Books',
  icon: 'book',
  searchLabel: 'Book Title',
  searchResultsPerPage: 20,
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
      released: firebase.firestore.Timestamp.fromDate(parseDateUTC(
        json.volumeInfo.publishedDate
      )),
      pages: parseInt(json.volumeInfo.pageCount, 10),
      read: false,
      links: [],
      notes: null
    }
  },
  blankItem: {
    googleBooksID: '',
    title: '',
    author: '',
    isbn: '',
    released: firebase.firestore.Timestamp.fromDate(new Date()),
    pages: 0,
    read: false,
    links: [],
    notes: null
  },
  generateIndexEntry: (item) => {
    const year = timestampToDate(item.released).getUTCFullYear()

    return {
      primaryText: item.title,
      secondaryText: item.author + ' (' + year + ')'
    }
  },
  fields: [{
    id: 'googleBooksID',
    type: 'text',
    label: 'Google Books ID',
    icon: 'folder_open',
    apiTitle: 'Google Books',
    apiURI: id => 'https://books.google.com/books?id=' + id
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
    id: 'released',
    type: 'date',
    label: 'Released'
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
