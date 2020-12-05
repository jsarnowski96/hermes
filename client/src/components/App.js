import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Sidebar from './Sidebar';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './Dashboard';
import Footer from './Footer';

import '../assets/css/style.css';

class App extends React.Component {    
    render() {
        return(
            <Router>
                <Sidebar />
                <main>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/dashboard" component={Dashboard} />
                </main>
            </Router>
        )
    }
}

export default App;