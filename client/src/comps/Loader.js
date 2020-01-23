import React from 'react'

class Loader extends React.Component{
  render() {
    return (
      <div className="loader-container">
        <p className="loader-txt">{this.props.msg}</p>  
        <div className="loader-inner">
        
          <div className="a" style={{'--n': 5}}>
            <div className="dot" style={{'--i': 0}}></div>
            <div className="dot" style={{'--i': 1}}></div>
            <div className="dot" style={{'--i': 2}}></div>
            <div className="dot" style={{'--i': 3}}></div>
            <div className="dot" style={{'--i': 4}}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Loader;