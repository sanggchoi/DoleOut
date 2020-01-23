import React from 'react'
import Axios from 'axios';

class GroupMember extends React.Component {

  constructor(props){
    super(props)
    this.clickEvent = this.clickEvent.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount(){
    const pic = document.querySelector("#groupmember-pic-" + this.props.member._id)
    pic.style.backgroundImage = "url('" + this.props.member.avatarURL + "')"
    if (this.props.admin === false){
      document.querySelector(".groupmember-delete-" + this.props.member._id).style.display = "none";
    }
  }
  
  /**
   * Redirects to a group member's profile page.
   */
  clickEvent(e){
    const classLst = e.target.classList;
    if (!classLst.contains("groupmember-delete") && e.target.className !== "fa fa-trash"){
      window.location.href = "/u/" + this.props.member._id;
    }
  }

  /**
   * Hides a group member, called when a member is deleted.
   * Will require a server call to remove the member from a database
   */
  delete(){
    Axios.delete(`/g/${this.props.group._id}/user/${this.props.member._id}`)
    .then( response => {
      console.log(response);
      //spaghetti ahead, look away while you can
      try{
        const elem = document.querySelector(".group-member-" + this.props.member._id);
        elem.parentNode.removeChild(elem);
      } catch(e){
      } try {
        const elem2 = document.querySelector(".groupmember-id-" + this.props.member._id);
        elem2.parentNode.removeChild(elem2);
      } catch(e) {
      }
    })
    .catch( err => console.log(err));
  }

  render() {
    let color = "black";
    if (this.props.member.isAdmin){
      color = "red";
    } else if (this.props.isSuper){
      color = "#2979FF";
    }

    return (
      <div onClick={ this.clickEvent }>
        <div className={"groupmember groupmember-id-" + this.props.member._id}>
          <div className={"groupmember-pic"} id={ "groupmember-pic-" + this.props.member._id }>
          </div>
          <h3 className="groupmember-name" style={{'color': color}}>
            {this.props.member.displayName}
            </h3>
          <div className={"groupmember-delete groupmember-delete-" + this.props.member._id} onClick={this.delete}><i className="fa fa-trash"></i></div>
        </div>
      </div>
    )
  }
}

export default GroupMember