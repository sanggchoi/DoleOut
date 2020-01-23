import React from 'react'

class ExpensePic extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      complete: this.props.member.complete,
    }
  }

  componentDidMount(){
    const pic = document.querySelector(".expense-pic-id-" + this.props.member._id + "-" + this.props.id);
    pic.style.backgroundImage = "url('" + this.props.member.avatarURL + "')";
    const picCover = document.querySelector(".expense-pic-cover-id-" + this.props.member._id + "-" + this.props.id);
    picCover.style.display = "none"
    if (this.state.complete){
      picCover.style.display = "block";
    }
  }

  /**
   * Redirects you to the user's profile page.
   */
  redirect(){    
      window.location = "/u/" + this.props.member._id;
  }

  render() {

    return (
      <div className="expense-pic-small-container">
        
          
        <div className={"expense-pic-cover expense-pic-cover-id-" + this.props.member._id + "-" + this.props.id} onClick={() => this.redirect()}>
        </div>
          
        
        <div className={"expense-pic-small expense-pic-id-" + this.props.member._id + "-" + this.props.id} onClick={() => this.redirect()}>
        </div>
      </div>
    )
  }
}

export default ExpensePic