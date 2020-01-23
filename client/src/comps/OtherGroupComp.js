import React from 'react';

class OtherGroupComp extends React.Component {

  constructor(props){
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(){
    window.location = "/g/" +  this.props.group._id;
  }

  render() {
    return (    
      <div className="other-group-container" onClick={this.redirect}>
        {this.props.group.name}
      </div>
    );
  }
}

export default OtherGroupComp;