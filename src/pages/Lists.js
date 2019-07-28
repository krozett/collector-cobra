import React from 'react'
import { connect } from 'react-redux'

class Lists extends React.Component {
  render() {
    return (
      <p>
        Franchises
      </p>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Lists)
