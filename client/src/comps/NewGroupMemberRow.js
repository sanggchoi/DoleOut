import React from 'react'
import Axios from 'axios';

class NewGroupMemberRow extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      indicator: "?"
    }
    this.checkValid = this.checkValid.bind(this);
  }
  /**
   * Determines if a given group member row holds a valid member to be added.
   * Changes the text display of the group member row showing if the member is valid or not.
   * @param num the index of the new group member row
   */
  checkValid(num){
    this.setState({
      loading: true
    })
    const val = document.querySelector("#groupMembersInput-" + num).value;
    const validator = document.querySelector(".new-member-confirmation-" + num);
    if (val.length === 0){
      this.setState({
        indicator: "?",
        loading: false
      })
      validator.style.color = "black";
      return;
    }
    
    //Must do a different check if the type is expense instead of group.
    if (this.props.type === "expense"){
      this.expenseCheckValid(val, validator);
      return;
    }
    Axios.get('/api/exists/' + val)
    .then( response => {
      if (response.status === 200){
        this.setState({
          indicator: "valid"
        });
        validator.style.color = "green";
      } 
    })
    .catch( err => {
      console.log(err)
      this.setState({
        indicator: "invalid"
      })
      validator.style.color = "red";
    })
    .finally( () => {
      this.setState({
        loading: false
      })
    })
  }

  //Checks if the user is a member of the group.
  expenseCheckValid(val, validator){
    Axios.get(`/api/membersOf/${this.props.groupID}`)
    .then( response => {
      const filtered = response.data.filter(member => member.displayName === val);
      if (filtered.length === 1){
        this.setState({
          indicator: "valid"
        });
        validator.style.color = "green";
      } else {
        throw new Error("No user exists with that name in this group");
      }
    })
    .catch( err => {
      console.log(err)
      this.setState({
        indicator: "invalid"
      })
      validator.style.color = "red";
    })
    .finally( () => {
      this.setState({
        loading: false
      })
    });
  }
  render() {
    const num = this.props.num - 1;
    return (
        <div className={"new-group-member-row new-group-member-row-" + num}>
          <p>Member {this.props.num}</p>
          <input className="group-member-input-field" id={"groupMembersInput-" + num} type="text" name="groupMembers" placeholder="Enter Username" maxLength="20" onChange={() => this.checkValid(num)}></input> 
          <div className={"new-member-confirmation new-member-confirmation-" + num}>
          {
            this.state.loading ? 
            'loading...' : this.state.indicator
          } 
          </div>
          
          <span className="new-member-row-btn" onClick={this.props.newRow}> New Row </span>
        </div>
      
    )
  }
}

export default NewGroupMemberRow