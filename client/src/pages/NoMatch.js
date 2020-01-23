import React from 'react'

class NoMatch extends React.Component {
  render() {
    return (
      <div className="no-match">
        <h3>Error 404</h3>
        <a href="/">
        <span role="img" aria-label="clap">click to return to home</span>
        </a>
      </div>
    )
  }
}

export default NoMatch