import React from 'react'
import { connect } from 'react-redux'
import { List, ListItemControl, Checkbox } from 'react-md'

import { fetchMusic } from 'store/music'
import keysSortedByTitle from 'helpers/keysSortedByTitle'

class Music extends React.Component {
  componentDidMount() {
    this.props.fetchMusic()
  }

  render() {
    if (!this.props.music) {
      return null
    }

    const items = keysSortedByTitle(this.props.music).map((key) => {
      const item = this.props.music[key]

      return (
        <ListItemControl
          primaryText={item.title}
          secondaryText={item.artist + ' (' + item.released.toDate().getFullYear() + ')'}
          primaryAction={(
            <Checkbox defaultChecked={item.listened} />
          )}
        />
      )
    })

    return (
      <List>
        {items}
      </List>
    )
  }
}

const mapStateToProps = state => ({
  music: state.music
})

const mapDispatchToProps = dispatch => ({
  fetchMusic: () => dispatch(fetchMusic)
})

export default connect(mapStateToProps, mapDispatchToProps)(Music)
