/**
 * This is the Group Page, where you select which group you want to open.
 * This is the view from the user's prospective (as opposed tot he admin's)
 * The admin can rename and delete groups. The user cannot.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../comps/Header.js';
import GroupComp from '../comps/GroupComp.js';
import NewGroupPopup from '../comps/NewGroupPopup.js';
import Loader from '../comps/Loader.js'
import axios from 'axios';


class GroupsPage extends React.Component {
  
  constructor(props){
    super(props);
    this.state = { 
      groups: [],
      showPopup: false,
      axiosError: "",
      loading: true,
     };
  }

  componentDidMount(){
    axios.get('/api/me')
    .then( response => {
      if (response.status === 200){
        return axios.get('/api/groups')
      } else {
        throw new Error("No user is logged in");
      }
    })
    .then(response => {
      const data = response.data
      this.setState({
        groups: data,
        loading: false,
      });
    })
    .catch( 
      err => {
        console.log(err);
        this.setState(
          {
            axiosError: "Could not retreive data.",
            loading: false
          }
      )});
  }

  /**
   * Opens the new group popup.
   */
  openPopup() {
    if(this.state.showPopup === false){
      this.setState({
        showPopup: true
      });
    }
  }

  /**
   * Closes the new group popup.
   */
  closePopup() {
    if(this.state.showPopup === true){
      this.setState({
        showPopup: false
      });
    }
  }
  
  /**
   * Creates an new group and adds it to the groups page.
   * This method is passed on as a prop to the create new group popup.
   * Would need a server call to update our database with the new group.
   */
  createGroup = (group) => {
    const newDiv = document.createElement("div");
    newDiv.className = "new-group-" + group._id;
    document.querySelector(".new-groups-div").appendChild(newDiv);
    ReactDOM.render(<GroupComp key={ group._id }
                          name={ group.name }
                          icon={ group.icon }
                          colorBg={ group.colorBg }
                          id={ group._id }
                          members={ group.members }
                          superusers={ group.superusers }
                          
                      />, document.querySelector(".new-group-" + group._id));    
  }

  render() {
    let { groups, axiosError, loading } = this.state;
    groups = groups.filter( g => g.deleted === false);
    
    return (
      <React.Fragment>
        <Header user="user"/>

        <ul className="group-ul">
          {
            loading ?
            <Loader msg={"Loading Groups"}/> : null
          }{
            (typeof(groups) === "object" && groups.length > 0 && !axiosError) ?
            groups.map( group => {
              return (
                  <GroupComp key={ group._id }
                        name={ group.name }
                        icon={ group.icon }
                        colorBg={ group.color }
                        id={ group._id }
                        members={ group.memberIDs }
                        superusers={ group.superusers }
                        
                  />
              )
            }) : null
          }{
            (typeof(groups) === "object" && groups.length === 0 && !axiosError && !loading) ?
            <div className="loading-txt">You are not in any groups!</div>
            : null
          }{
            axiosError ? <div className="loading-txt">{axiosError}</div> : null
          }
          <div className="new-groups-div"> </div>
          <div className="group-div">
            <div className="group-add-btn" onClick={this.openPopup.bind(this)}>
              <div className="group-add-icon-container">
                <i className="fa fa-plus"></i>
                {this.state.showPopup ? 
                  <NewGroupPopup addGroup = {this.createGroup} closePopup={this.closePopup.bind(this)}/>
                  : null}
              </div>
              
            </div>
          </div>
        </ul>
      </React.Fragment>
    )
  }
}

export default GroupsPage