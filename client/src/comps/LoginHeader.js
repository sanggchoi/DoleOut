import React from 'react';

class LoginHeader extends React.Component {
  render() {
    return (
      <div>
        <div className="login-hdr">
          <h1>
            <span className = "login-span" > {this.props.title} </span> 
          </h1>
        </div> 
      </div>
    )
  }
}

export default LoginHeader;