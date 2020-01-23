import React from 'react';
import '../style/NewGroupPopup.css';
import ReactDOM from 'react-dom';
import NewGroupMemberRow from '../comps/NewGroupMemberRow';
import GroupIcon from '../comps/GroupIcon';
import { uid } from 'react-uid';
import Helper from '../scripts/helper.js';
import Axios from 'axios';
const AColorPicker = require('a-color-picker');

class NewGroupPopup extends React.Component {

  constructor(props) {
      super(props);
      this.selectColor = this.selectColor.bind(this);
      this.newRow = this.newRow.bind(this);
      this.getMembers = this.getMembers.bind(this);
  }

  state = {
      users: undefined,
      title: "",
      groupIcon: "",
      groupMembers: "",
      groupColor: "#eee",
      pickerOpen: false,
      selectColorTxt: "Select Color",
      iconLst: ["user", "user-secret", "user-md", "user-circle", "blind", "child", "male", "female", "wheelchair", "mouse-pointer"],
      icon: undefined,
      numMembers: 1
  }

  componentDidMount() {
    Axios.get('/api/users')
    .then(response => {
      this.setState({
        users: response.data
      })
    })
    .catch(err => console.log(err));

    AColorPicker.from('.picker').on('change', (picker, color) => {
      const colorPrev = document.querySelector(".color-preview");
      colorPrev.style.backgroundColor = color;
      this.setState({
        groupColor: String(color)
      });
    });
  }

  /**
   * Picks a color from the color picker.
   */
  selectColor(e) {
      e.preventDefault();
      if (!this.state.pickerOpen) {
        document.querySelector(".picker").style.display = "block";
        this.setState({
          pickerOpen: true,
          selectColorTxt: "Confirm Color"
        });
      } else {
        document.querySelector(".picker").style.display = "none";
        this.setState({
          pickerOpen: false,
          selectColorTxt: "Select Color"
        });
      }
  
  }

  /**
   * Returns a list the members of a new group.
   */
  getMembers(id){
      const usernameInputs = document.querySelectorAll(".group-member-input-field");
      const memberLst = this.state.users;
      const numMembers = this.state.numMembers;
      const added = [id];
      for (let i = 0; i < numMembers; i++){
        const m = memberLst.filter( m => 
          m.displayName === usernameInputs[i].value
        );
        if (m.length === 0 || added.includes(m[0]._id)){
          continue;
        }
        added.push(m[0]._id);
      }
      return added;
  }

  /**
   * Selects the icon of a new group.
   */
  selectIcon(name) {
      if (this.state.groupIcon !== "") {
        const curIcon = this.state.groupIcon;
        document.querySelector("#icon-choice-" + curIcon).className = "icon-container";
      }
      this.setState({
        groupIcon: name
      });
      document.querySelector("#icon-choice-" + name).className = "icon-container icon-selected";
  
  }
  
  /**
   * Closes the new group popup.
   */
  close(e, closeFunction){
      if (e.target.className === "popup-close-btn"){
      closeFunction();
      }
  }

  /**
   * Creates a new group based on the input fields and adds it to the groups page.
   */
  createGroup() {
    if (this.state.title === "" || this.state.groupIcon === "") {
      alert("Please fill out all fields!");
      return;
    }
    Axios.get('/api/me')
    .then( response => {
      if (response.status === 200){
        const newGroup = {
          name: this.state.title,
          icon: this.state.groupIcon,
          colorBg: this.state.groupColor,
          members: this.getMembers(response.data._id),
          superusers: [response.data._id],
        }      
        /* HTTP Request */
        console.log("Making POST req");
        Axios.post('/groups', JSON.stringify(newGroup), { headers: { 'Content-Type': 'application/json;charset=UTF-8' }})
        .then( response => {
          console.log("posted group!")
          newGroup._id = response.data;
          this.props.addGroup(newGroup);
        })
        .catch( err => {
          console.log("err posting group");
        });
        
        //Close
        this.props.closePopup();  
      } else {
        //This should never happen...
        console.log("there is nobody logged in. nothing happened");
      }
      
    })
    .catch(err => console.log(err))
    
  }
  
  /**
   * Creates a new group member row to add members to the new group.
   */
  newRow(){
      const newDiv = document.createElement("div")
      newDiv.className = "new-group-member-row-" + this.state.numMembers;
      document.querySelector(".new-group-members-container").appendChild(newDiv)
      ReactDOM.render(<NewGroupMemberRow newRow={this.newRow} num={this.state.numMembers + 1} type={"group"}/>, document.querySelector(".new-group-member-row-" + this.state.numMembers))
      this.setState({
        numMembers: this.state.numMembers + 1
      });
  }

  render() {
      return (
        <div className='popup' id ='new_group_popup'>
          <div className='popup_inner'>
            <h1>Create New Group</h1>
            <form className = "new-group-form">
              <h3> Group Title </h3>
              <input id="groupTitleInput" type="text" name="title" placeholder="Title" onChange={Helper.handleInputChange.bind(this)}></input>
              <h3> Members </h3>
              <div className="new-group-members-container">
                <NewGroupMemberRow newRow={this.newRow} num={1} type={"group"}/>
              </div>
              <h3> Color <div className="color-preview"></div> </h3>
              <button onClick={this.selectColor}>
                {this.state.selectColorTxt}
              </button>
              <div className="picker"
                acp-show-hex="no"
                acp-show-rgb="no"
                acp-show-hsl="no"
                acp-palette="PALETTE_MATERIAL_CHROME"></div>

              <h3> Icon </h3>
              {
                this.state.iconLst.map( icon => {
                  return(
                    <span onClick={() => this.selectIcon(icon)} key={uid(icon)} >
                      <GroupIcon iconName={icon} />
                    </span>
                  );
                })
              }

            </form>
            <div className="popup-btn-container">
                <button className="popup-create-btn" onClick={() => this.createGroup()}> Create Group <i className="fa fa-users"></i></button>
                <button className="popup-close-btn" onClick={(e) => this.close(e, this.props.closePopup)}> Close</button>
              </div>
            
            
          </div>
        </div>
      );
    }
}

export default NewGroupPopup;