import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './Navbar';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Footer from './Footer';

import '../assets/css/global.css';

class App extends React.Component {    
    render() {
        return(
            <Router>
                <div className="row">
                    <Navbar />
                    <div class="col-sm-12 col-md-6 col-lg-11 col-12 mb-3">
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/about" component={About} />
                        <Route path="/contact" component={Contact} />
                    </div>
                </div>
                <div className="row">
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default App;