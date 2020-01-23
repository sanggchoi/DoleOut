import React from 'react'

class GroupIcon extends React.Component{
  render() {
    return (
      
        <div className="icon-container" id={"icon-choice-" + this.props.iconName}><i className={"fa fa-" + this.props.iconName} ></i>
        </div>
      
    )
  }
}

export default GroupIcon