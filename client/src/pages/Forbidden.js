import React from 'react'

class Forbidden extends React.Component{
  render() {
    return (
      <div className="no-match">
        <h3>Error 403</h3>
        <a href="/">
        <span role="img" aria-label="clap">click to return to home</span>
        </a>
      </div>
    )
  }
}

export default Forbidden;