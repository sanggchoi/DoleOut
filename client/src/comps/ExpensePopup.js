import React from 'react';
import ReactDOM from 'react-dom';
import NewGroupMemberRow from '../comps/NewGroupMemberRow';
import Helper from  '../scripts/helper.js';
import '../style/ExpensePopup.css';
import Axios from 'axios';

class ExpensePopup extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      expenseTitle: "",
      expenseContent: "",
      expenseCost: "",
      expenseMembers: "",
      numMembers: 1,
      thisGroup: this.props.group,
      user: this.props.user,
      thisGroupMembers: undefined,
    }
    this.createNewMemberRow = this.createNewMemberRow.bind(this)
  }

  componentDidMount(){
    Axios.get(`/api/membersOf/${this.props.group._id}`)
    .then( response => {
      this.setState({
        thisGroupMembers: response.data,
      });
    })
    .catch(err => console.log(err));
  }

  /**
   * Creates a new expense based on the input fields and adds it to the group timeline.
   */
  createExpense = () => {
    const expenseMembers = this.getMembers();
    if (this.state.expenseTitle === "" || this.state.expenseCost === "" || this.state.expenseContent === "" || expenseMembers.length === 1){
      alert("one or more fields is missing!");
      return;
    }

    if(this.state.expenseCost <= 0){
      alert("please enter a positive cost");
      return;
    }
    
    const m = {
      groupID: this.state.thisGroup._id,
      isMsg: false,
      creatorID: this.state.user._id,
      content: this.state.expenseContent,
      expense: {
        title: this.state.expenseTitle,
        cost: Number(this.state.expenseCost).toFixed(2),
        totalRemaining: Number(parseFloat(Number(this.state.expenseCost / expenseMembers.length).toFixed(2)) * (expenseMembers.length - 1)).toFixed(2),
        totalPaid: false,
        members: expenseMembers,
      },
    }

    this.props.addExpense(m);
    this.props.closePopup();
  }

  /**
   * Returns an array of all the members of an expense.
   */
  getMembers(){
    const usernameInputs = document.querySelectorAll(".group-member-input-field");
    const memberLst = this.state.thisGroupMembers;
    const numMembers = this.state.numMembers;
    const thisUser = {
      ...this.state.user,
      amountPaid: 0,
      totalToPay: 0,
      complete: true
    };
    const added = [thisUser];
    const addedIDs = [this.props.user._id]
    
    for (let i = 0; i < numMembers; i++){
      const m = memberLst.filter( m => 
        m.displayName === usernameInputs[i].value
      );

      if (m.length === 0 || addedIDs.includes(m[0]._id)){
        continue;
      }
      const personToAdd = m[0];
      const person = {
        ...personToAdd,
        amountPaid: 0,
        totalToPay: 0,
        complete: false,
      }
      
      added.push(person);
      addedIDs.push(person._id);
    }
    added.forEach( member => {
      member.totalToPay = Number(Number(this.state.expenseCost) / added.length).toFixed(2);
    });
    //THe creator has already paid:
    added[0].totalToPay = 0;
    added[0].amountPaid = Number(Number(this.state.expenseCost) / added.length).toFixed(2);
    return added;
  }

  /**
   * Formats the cost input of the expense to include decimals.
   */
  formatCost(){
    const costInputField = document.querySelector("#expenseCostInput");
    const val = document.querySelector("#expenseCostInput").value;
    costInputField.value = Number(val).toFixed(2);
    if (Number(val) < 0){
      costInputField.value = Number(0).toFixed(2);
    }
  }

  /**
   * Closes the expense popup.
   */
  close(e, closeFunction){
    if (e.target.className === "popup" || e.target.className === "popup-close-btn"){
      closeFunction();
    }
  }

  /**
   * Adds a new member row to the expense popup.
   */
  createNewMemberRow(){
    const newDiv = document.createElement("div");
    newDiv.className = "new-member-expense-popup-id-" + this.state.numMembers;
    document.querySelector(".newGroupMemberRow-spawn-here").appendChild(newDiv);
    ReactDOM.render(<NewGroupMemberRow 
      newRow={this.createNewMemberRow} 
      num={( this.state.numMembers + 1)} 
      type={"expense"}
      groupID={this.state.thisGroup._id}/>, 
      document.querySelector(".new-member-expense-popup-id-" + this.state.numMembers));

    this.setState({
      numMembers: this.state.numMembers + 1
    });
  }


  render() {
    return (
      <div className='popup' onPointerDown={(e) => this.close(e, this.props.closePopup)}>
        <div className='popup_inner'>
          <h1>New Expense</h1>
          <form className="new-expense-form">
              <h3>
                Expense Title
              </h3>
              <input className="new-expense-form-input" id="expenseTitleInput" type="text" name="expenseTitle" placeholder="Title" onChange={Helper.handleInputChange.bind(this)}></input>
              <h3>
                Content 
              </h3>
              <input className="new-expense-form-input" id="expenseContentInput" type="text" name="expenseContent" placeholder="A Message About Your Expense" onChange={Helper.handleInputChange.bind(this)}></input>
              <h3>
                Cost 
              </h3>
              <input className="new-expense-form-input" id="expenseCostInput" type="number" name="expenseCost" placeholder="Ex. '9.99'" min="0" onChange={Helper.handleInputChange.bind(this)} onBlur={this.formatCost}></input>
              <h3>
                Members
              </h3>
              <NewGroupMemberRow 
                num={1} 
                newRow={this.createNewMemberRow} 
                type={"expense"} 
                groupID={this.state.thisGroup._id}/>
              <div className="newGroupMemberRow-spawn-here">
              </div>
            </form>
          <div className="popup-btn-container">
            <button className="popup-create-btn" onClick={() => this.createExpense()}> Create Expense </button>
            <button className="popup-close-btn" onClick={(e) => this.close(e, this.props.closePopup)}> Close</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpensePopup;