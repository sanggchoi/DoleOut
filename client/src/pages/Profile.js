/**
 * Profile Page. Both user and admin.
 */

import React from 'react';
import Header from '../comps/Header';
import Helper from '../scripts/helper';
import Loader from '../comps/Loader';
import '../style/Profile.css';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.getUserNum(),
            displayName: "",
            firstname: "",
            lastname: "",
            avatar: "",
            description: "",
            email: "",
            pref: "",
            paypal: "",
            balance: "",
            editing: false,
            userIsThisProfile: false,
            addingMoney: false,
        }
        this.toggleEdit = this.toggleEdit.bind(this);
        this.addMoney = this.addMoney.bind(this);

    }

    componentDidMount() {
        const id = this.getUserNum();
        Axios.get("/api/u/" + id)
            .then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setState({
                        firstname: data.firstName,
                        lastname: data.lastName,
                        avatar: data.avatarURL,
                        description: data.description,
                        email: data.email,
                        pref: data.preference,
                        paypal: data.paypalURL,
                        displayName: data.displayName,
                        balance: data.balance,
                    });
                    const pic = document.querySelector("#profile-pic-" + this.state.id);
                    pic.style.backgroundImage = "url('" + this.state.avatar + "')";
                } else {
                    this.props.history.push('/404');
                }
            })
            .catch(err => {
                this.props.history.push('/404');
            });
        Axios.get('/api/me')
            .then( response => {
                if (response.data._id === id || response.data.isAdmin){
                    //show the edit button
                    document.querySelector(".profile-edit-btn").style.display = "block";
                    this.setState({
                        userIsThisProfile: true,
                    });
                }
            })
            .catch( err => {
                //the user isnt logged in. got a 403.
                console.log(err);
            })
    }

    /**
     * Send the patch request. Body is this.state.
     */
    patch(){
        Axios.patch(`/u/${this.state.id}`, JSON.stringify(this.state),
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' }})
        .then( response => {
            console.log(response);
        })
        .catch( err => {
            console.log(`Failed to patch: ${err}`);
        });  
    }

    /**
     * Toggles whether the user can edit his or her information with displayed 
     * input fields.
     */
    toggleEdit = () => {
        if (!this.state.editing){
            this.setState({
                editing: true
            });
        }
        else {
            this.setState({
                editing: false
            });
            const pic = document.querySelector("#profile-pic-" + this.state.id);
            pic.style.backgroundImage = "url('" + this.state.avatar + "')";
            this.patch();
        }
    }

    /**
     * Get the id number of this user.
     */
    getUserNum() {
        const { user_number } = this.props.match.params
        return user_number
    }

    /**
     * Add money to doleout account
     */
    addMoney(e){
        e.preventDefault();
        const amount = Number(document.querySelector("#doleout-add-funds-input").value).toFixed(2);
        if (amount <= 0){
            toast.error("❌ You cannot add less than $0.01", {
                draggable: true,
              });
            return;
        }
        this.setState({
            editing: false,
            addingMoney: true,
        });

        Axios.post("/paypal/pay", JSON.stringify(
            {
                amount: amount
            }),
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' }})
        .then(response => {
            console.log(response);
            window.location = response.data;
        })
        .catch(err => {
            console.log(err);
            this.setState({
                addingMoney: false,
            }, () => {
                toast.error("Could not POST to /paypal/pay", {
                    draggable: true,
                  });
            })
        });
    }

    /**
     * Show the add funds input and button
     */
    showAddFunds(e){
        e.preventDefault()
        document.querySelector("#doleout-begin-add-funds-btn").style.display = "none";
        document.querySelector(".add-doleout-funds-container").style.display = "block";
    }


    render() {
        return (
            <div>
                <Header />
                {
                    this.state.addingMoney ? 
                    <Loader msg={"Please be patient as we redirect you to PayPal..."} /> : null    
                }
                <ToastContainer position={toast.POSITION.BOTTOM_RIGHT}/>
                {
                !this.state.editing ?
                <div className="profile-btn profile-edit-btn" onClick={this.toggleEdit}>
                    Edit <i className="fa fa-pencil"></i>
                </div> 
                :
                <div className="profile-btn profile-save-btn" onClick={this.toggleEdit}>
                        Save <i className="fa fa-check"></i>
                    </div>
                }

                <div className="profile-container">
                    <div className="profile-pic-and-name">
                        <div className="profile-pic" id={"profile-pic-" + this.state.id}>
                        </div>
                        <div className="profile-name-container">
            <h1>{this.state.displayName} <a href={'https://www.' + this.state.paypal} target="_blank" rel="noopener noreferrer"><i className="fa fa-cc-paypal"></i></a></h1>
                            {this.state.firstname} {this.state.lastname}
                        </div>
                        <div className="profile-desc">
                            <b>Description</b>
                            <p>{this.state.description}</p>
                            <br />
                            <b>Preferred Payment Method</b>
                            <p>{this.state.pref}</p>
                        </div>
                    </div>
                    <div className="profile-info-container">
                        <h3>Email</h3>
                        <p>{this.state.email}</p>
                        {
                        this.state.userIsThisProfile ? 
                        <div>
                            <h3>Doleout Wallet</h3>
                            <p>${Number(this.state.balance).toFixed(2)} CAD</p>
                        </div> : null
                        }
                    </div>
                    {
                        this.state.editing ? 
                        <div className="profile-edit-container">
                            <form id="profile-edit-form">
                            <p>First Name</p>
                            <input type="text" name="firstname" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.firstname}></input>
                            <p>Last Name</p>
                            <input type="text" name="lastname" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.lastname}></input>
                            <p>Avatar URL</p>
                            <input type="text" name="avatar" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.avatar}></input>
                            <p>Description</p>
                            <input type="text" name="description" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.description}></input>
                            <p>Preferred Payment Method</p>
                            <input type="text" name="pref" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.pref}></input>
                            <p>Email</p>
                            <input type="text" name="email" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.email}></input>
                            <p>PayPal URL</p>
                            <input type="text" name="paypal" onChange={Helper.handleInputChange.bind(this)} defaultValue={this.state.paypal}></input>
                            <button id="doleout-begin-add-funds-btn" onClick={this.showAddFunds}>Add Funds To DoleOut Wallet</button>
                            <div className="add-doleout-funds-container">
                                <input type="number" min="0" defaultValue="100.00" id="doleout-add-funds-input"></input>
                                <button id="doleout-add-funds-btn" onClick={this.addMoney}>Add Funds</button>
                            </div>
                            </form>
                        </div> : null
                    }
                </div>
            </div>
        )
    }
}

export default Profile 