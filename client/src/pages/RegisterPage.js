import React from 'react';
import Header from '../comps/Header.js'
import LoginHeader from '../comps/LoginHeader.js'
import Helper from '../scripts/helper.js';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/inputboxes.css";


const regex = RegExp('^([a-zA-Z0-9 _-]+)$');

class RegisterPage extends React.Component {

  state = {
    username: "",
    password: "",
    rePassword: "",
    users: [],
    toastMsg: "",
    error: false
  }

  /**
   * Checks if the username is in the master user list.
   */
  checkRegistered(username){
    return false;
  }

  /**
   * Registers a new user if all the input fields are valid.
   * Would need a server call to update our database with the new user.
   */
  register(e) {
    //button or enter key
    if (e.keyCode === 13 || e.target.className === "register-btn"){
      let fail = false;
      let len = 0;
      if (this.state.username === ""){
        fail = true;
        this.makeErrNotification("Your username should have atleast one character", len)
        len += 100;
      } 
      if (!regex.test(this.state.username)) {
        fail = true;
        this.makeErrNotification("Your username has invalid symbols", len)
        len += 100;
      }
      if (this.state.password.length <= 3){
        fail = true;
        this.makeErrNotification("Your password should have more than 3 characters", len)
        len += 100;
      }
      if (this.state.password !== this.state.rePassword){
        fail = true;
        this.makeErrNotification("The two passwords don't match", len)
        len += 100;
      }
      if (fail === false) {
        Axios.post('/register', JSON.stringify({
          displayName: this.state.username,
          password: this.state.password,
        }), { headers: { 'Content-Type': 'application/json;charset=UTF-8' }})
        .then( response => {
          console.log(response);
          this.setState({
            toastMsg: "✔️ You have been registered.",
            error: false,
          }, () => {
            this.notify();
            setTimeout( () => {
              window.location = "/login";
            }, 2000)
          });
        })
        .catch( err => {
          console.log(err);
          this.makeErrNotification("That username is alaready taken")
        });
      }
      e.preventDefault();
    }
  }

  makeErrNotification(msg, time){
    setTimeout(() => {
      this.setState({
        toastMsg: `❌ ${msg}.`,
        error: true,
      }, () => {
        this.notify();
      });
    }, time);
  }

  notify = () => {
    if (this.state.error){
      toast.error(this.state.toastMsg, {
        draggable: true,
      });
    } else {
      toast.success(this.state.toastMsg, {
        draggable: true,
        autoClose: 2000,
      });
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT}/>
        <div className="login-container">
          <div className="login-inner">
            <LoginHeader title="Register"/>
            <form className="login-form">
              {/* <h3>
                Username
              </h3>
              <input id="register-username" type="text" required name="username" placeholder="Username" onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input> */}
              <div className="group">      
                <input id="register-username" name="username" type="text" required onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Username</label>
              </div>
                
              <div className="group">      
                <input id="register-password" name="password" type="password" required onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Password</label>
              </div>

              <div className="group">      
                <input id="register-repassword" name="rePassword" type="password" required onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Confirm Password</label>
              </div>



              {/* <h3>
                Password
              </h3>
              <input id="register-password" type="password" required name="password" placeholder="Password" onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input>
              <h3>
                Confirm Password
              </h3>
              <input id="register-repassword" type="password" required name="rePassword" placeholder="Password" onChange={Helper.handleInputChange.bind(this)} onKeyDown={(e) => this.register(e)}></input> */}
               
            </form>
            <button className="register-btn" onClick={(e) => {this.register(e)}}>Register <i className="fa fa-user-plus"></i></button> 
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterPage;