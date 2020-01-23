import React from 'react';
import Header from '../comps/Header.js'
import LoginHeader from '../comps/LoginHeader'
import Fetch from '../scripts/fetch.js';
import Helper from '../scripts/helper.js';

class LoginPage extends React.Component {
  
  state = {
    username: "",
    password: "",
    users: Fetch.fetchUsers()
  }

  login(e) {
    if (e.keyCode === 13 || e.target.className === "login-btn"){
      console.log("attempting to post...")
    } 
  }
  
  render() {
    return (
      <div>
        <Header/>
          <div className="login-container">
            <div className="login-inner">
            <LoginHeader title="Login"/>
              <form className="login-form" action="/login" method="post">

              <div className="group">      
                <input id="login-username" name="username" type="text" required onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.login(e)}></input>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Username</label>
              </div>
                
              <div className="group">      
                <input id="login-password" name="password" type="password" required onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.login(e)}></input>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Password</label>
              </div>

                {/* <h3>
                  Username
                </h3>
                <input id="login-username" type="text" name="username" placeholder="Username" onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.login(e)}></input>
                <h3>
                  Password
                </h3>
                <input id="login-password" type="password" name="password" placeholder="Password" onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.login(e)}></input> */}
                <button className="login-btn" type="submit" onClick={(e) => this.login(e)}>Login <i className="fa fa-sign-in"></i></button>  
              </form>
            </div>
          </div>
      </div>
    )
  }
}



export default LoginPage;