import React from 'react'

class OtherExpense extends React.Component{

  componentDidMount(){
    const pic = document.querySelector(".expense-small-pic-id-" + this.props.msg.creatorID + "-" + this.props.msg._id);
    pic.style.backgroundImage = "url('" + this.props.avatarURL + "')";
  }


  render() {
    return (
        <div className={"expense-small expense-small-id-" + this.props.msg._id}>
          <div className="expense-small-pic-and-title">
            <div className={"expense-small-pic expense-small-pic-id-" + this.props.msg.creatorID + "-" + this.props.msg._id }></div>
            <b>{this.props.msg.expense.title}</b>
          </div>
          <p>${Number(this.props.msg.expense.totalRemaining).toFixed(2)} remaining</p>
        </div>
    )
  }
}

export default OtherExpense