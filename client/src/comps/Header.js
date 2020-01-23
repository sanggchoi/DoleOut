import React from 'react';
import Axios from 'axios';

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user: undefined,
      loggedIn: false,
    }
  }
  componentDidMount(){
    Axios.get('/api/me')
    .then( response => {
      this.setState({
        user: response.data,
        loggedIn: true
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <div className="headerbox">
          <a href="/">
            <div className="header-logo">
            </div>
          </a>
          <ul className="header-left-ul">
            <a href="/">
              <li className="header-li">
                <div className="li-content">
                  Home <i className="fa fa-home"></i>
                </div>
              </li>
            </a>
            <a href="/groups" id="header-group-link">
              <li className="header-li">
                  <div className="li-content">
                    Groups <i className="fa fa-users"></i>
                  </div>
              </li>
            </a>
          </ul>
          <ul className="header-right-ul" >
            {
              this.state.loggedIn ? 
              <React.Fragment>
                <a href={"/u/" + this.state.user._id} id="header-profile"> 
                  <li className="header-li">
                      <div className="li-content">
                        <span className="header-username">My Profile</span> <i className="fa fa-user"></i>
                      </div>
                  </li>
                </a>
                <a href="/logout" id="header-logout"> 
                <li className="header-li">
                    <div className="li-content">
                      <span className="header-username">Logout</span> <i className="fa fa-sign-out"></i>
                    </div>
                </li>
                </a> 
              </React.Fragment>
              : 
              <React.Fragment>
                <a href="/register" id="header-register">
                  <li className="header-li">
                    <div className="li-content" >
                      Register <i className="fa fa-user-plus"></i>
                    </div>
                  </li>
                </a>
                <a href="/login" id="header-login">
                  <li className="header-li">
                    <div className="li-content" >
                      Login <i className="fa fa-sign-in"></i>
                    </div>
                  </li>
                </a>
              </React.Fragment>
            }

          </ul>
        </div>
      </div>
    )
  }
}

export default Header