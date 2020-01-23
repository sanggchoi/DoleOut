import React from 'react';
import Header from '../comps/Header.js';
import Footer from '../comps/Footer.js';
import "../style/markerpen.css";

class LandingPage extends React.Component {
    componentDidMount () {
        const script = document.createElement("script");
        script.src = "./script/canvas.js";
        script.async = true;
        document.body.appendChild(script);
    }
    
    render() {
        return ( 
            <div>
                <Header />
                <div className = "jumbotron">
                    <canvas id="canvas"></canvas>
                </div> 
                <div className = "above-jumbo" >
                    <h1 className="landing-main-txt">
                    <span className = "main-header underlined underlined--gradient" onClick={() => { window.location = "/login"}} > DoleOut </span> 
                    </h1> 
                </div>
                <Footer />
            </div>
        )
    }
}

export default LandingPage