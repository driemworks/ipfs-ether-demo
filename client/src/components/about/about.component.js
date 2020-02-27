import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Jumbotron, Button } from 'reactstrap';

import './about.component.css';
import FlipCardComponent from "../flip-card/flip-card.component";

import { faLock, faProjectDiagram, faUserShield } from "@fortawesome/free-solid-svg-icons";

class AboutComponent extends Component {

    constructor(props) {
        super(props);
    }

    goHome() {
        this.props.action(false);
    }

    render() {
        return (
            <div className="about-container">
                <div className="jumbotron-container">
                    <Jumbotron className="jumbotron-details-container">
                        <h1>Secure file sharing</h1>
                        <div className="jumbotron-text">
                            <p>
                                Iris is a platform to allow users to securely share files between ethereum accounts using IPFS.
                            </p>
                        </div>
                        <Button onClick={this.goHome.bind(this)} color="primary">
                            Get started
                        </Button>
                    </Jumbotron>
                </div>
                <div className="about-body">
                    <div className="left details">
                        <FlipCardComponent 
                            headerText = 'Secure'
                            icon       = {faLock}
                            text       = "Iris provides user the ability to asymetrically encrypt files before sending 
                                            it to another user; creating an encrypted file that is can only 
                                            be decrypted by the intended party."
                        />
                    </div>
                    <div className="middle details">
                        <FlipCardComponent 
                            headerText = 'Decentralized'
                            icon       = {faProjectDiagram}
                            text       = 'Your files are uploaded to IPFS and user management is achieved through your ethereum account.'
                        />
                    </div>
                    <div className="right details">
                        <FlipCardComponent 
                            headerText = 'Anonymous'
                            icon       = {faUserShield}
                            text       = 'This is another test'
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<FlipCardComponent />, document.getElementById('root'));

export default AboutComponent;