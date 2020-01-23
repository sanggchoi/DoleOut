import React from 'react'
import Helper from '../scripts/helper.js';
import Axios from 'axios';
const Color = require('color');



/* This is the group COMPONENT that is listed in the GroupPage*/

class GroupComp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      hover: false,
      editHover: false,
      deleteHover: false,
      members: [],
      loading: true,
      canEdit: false
    };
    this.hoverOn = this.hoverOn.bind(this);
    this.hoverOff = this.hoverOff.bind(this);
    this.hide = this.hide.bind(this);
    this.edit = this.edit.bind(this);
    this.confirm = this.confirm.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    const icon = document.querySelector("#icon" + this.props.id);
    icon.className = "group-icon fa fa-" + this.props.icon;
    const group = document.querySelector(".group-div-id-" + this.props.id);
    group.style.backgroundColor = this.props.colorBg;


    if (Color(this.props.colorBg).isDark()){
      document.querySelector(".group-div-id-" + this.props.id).style.color = "white";
    } else {
      document.querySelector(".group-div-id-" + this.props.id).style.color = "black";
    }
    const promises = []
    for (let i = 0; i < this.props.members.length; i++){
      promises.push(Axios.get('/api/u/' + this.props.members[i]))
    }
    Promise.all(promises)
    .then(values => {
      const members = []
      values.forEach( v => {
        members.push(v.data.displayName)
      })
      this.setState({
        members: members,
        loading: false,
      })
    })
    .catch( err => console.log(err))

    Axios.get('/api/me')
    .then( response => {
      const data = response.data;
      if (this.props.superusers.includes(data._id) || data.isAdmin){
        this.setState({
          canEdit: true
        });
      } 
    })
    .catch( err => {
      console.log(err)
    })
  }

  /**
   * Returns the member list as a string with each member separated by commas.
   */
  stringifyMembers(membersList) {
    if (membersList.length === 0) {
      return "No members."
    }
    let r = ""
    for (let i = 0; i < membersList.length; i++) {
      r += membersList[i] + ", "
    }
    return r.substring(0, r.length - 2)
  }

  hoverOn(){
    const div = document.querySelector(".group-div-id-" + this.props.id);
    if (Color(this.props.colorBg).isDark()){
      div.style.backgroundColor = Color(this.props.colorBg).lighten(0.1).hsl().string();
    } else {
      div.style.backgroundColor = Color(this.props.colorBg).darken(0.1).hsl().string();
    }
    this.setState(
      {
        hover: true
      }
    );
  }

  hoverOff(){
    const div = document.querySelector(".group-div-id-" + this.props.id);
    div.style.backgroundColor = this.props.colorBg;
    this.setState(
      {
        hover: false
      }
    );
  }

  redirect(e){
    if (!e.target.classList.contains("fa") && !e.target.classList.contains("group-comp-input")){
      if (this.props.admin){
        window.location = "/g/" + this.props.id + "/admin";
      } else {
        window.location = "/g/" + this.props.id;
      } 
    }
  }

  /**
   * Hides a group in the groups page, called when a group is deleted.
   * Will require a server call to remove the group from a database
   */
  hide(){
    document.querySelector(".group-div-id-" + this.props.id).style.display = "none";
    Axios.delete(`/g/${this.props.id}`)
    .then( response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  }

  /**
   * Allows the name of a group to be edited using an input field.
   * This stuff is better done in the render function, but who knows when I will change that
   */
  edit(){
    const elem = document.querySelector("#group-name-id-" + this.props.id);
    elem.style.display = "none";
    const input = document.querySelector("#group-comp-input-id-" + this.props.id);
    input.style.display = "inline-block";
    const edit = document.querySelector("#group-i-edit-" + this.props.id);
    edit.style.display = "none";
    const check = document.querySelector("#group-i-check-" + this.props.id);
    check.style.display = "inline-block";
  }

  /**
   * Confirms whatever is in the group name input field to become the group's name.
   * Will require a server call to actually change the group's name in our database.
   */
  confirm(){
    const elem = document.querySelector("#group-name-id-" + this.props.id);
    elem.style.display = "inline-block";
    const input = document.querySelector("#group-comp-input-id-" + this.props.id);
    input.style.display = "none";
    this.setState({
      name: input.value
    });
    const icon = document.querySelector("#group-i-edit-" + this.props.id);
    icon.style.display = "inline-block";
    const check = document.querySelector("#group-i-check-" + this.props.id);
    check.style.display = "none";
    Axios.patch(`/g/${this.props.id}`, JSON.stringify({name: input.value, memberIDs: this.props.members}),
      { headers: { 'Content-Type': 'application/json;charset=UTF-8' }})
    .then( response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <div className={"group-div group-div-id-" + this.props.id} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff} onClick={this.redirect}>
          <h1 className="grouppage-title">
            <i id={"icon" + this.props.id}></i> <span className="group-name" id={"group-name-id-" + this.props.id}>{this.state.name}</span> <input className="group-comp-input" id={"group-comp-input-id-" + this.props.id } type="text" name="title" defaultValue={this.state.name} onChange={Helper.handleInputChange.bind(this)}></input>
          </h1>
          {
            this.state.canEdit ? 
          <div className="group-div-change-btns">
              <i className="fa fa-check" id={"group-i-check-" + this.props.id} style={{display: 'none'}} onClick={this.confirm}></i>
              <i className="fa fa-edit" id={"group-i-edit-" + this.props.id} onClick={this.edit}></i>
              <i className="fa fa-trash" id={"group-i-trash-" + this.props.id} onClick={this.hide}></i>
          </div>
          : null
          }
          <h3>
            Members: {
            this.state.loading ? 
            <span>Loading...</span>
            : this.stringifyMembers(this.state.members)
            }
          </h3>
        </div>
      </div>
    )
  }

}

export default GroupComp