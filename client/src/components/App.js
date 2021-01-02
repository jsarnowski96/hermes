import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Sidebar from './Nav/Sidebar';
import About from './Nav/About';
import Contact from './Nav/Contact';
import Login from './Nav/Login';
import Register from './Nav/Register';
import Home from './Nav/Home';
import Dashboard from './Dashboard/Dashboard';

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