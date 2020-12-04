import React from 'react';
import '../assets/css/footer.css';

class Footer extends React.Component {
    render() {
        return(
            <nav class="navbar navbar-dark bg-dark text-white col-12 justify-content-center">
                <p className="mb-0 flex-auto mr-xs-0 mr-sm-2 mr-lg-2 mr-xl-2 mr-md-2">Copyright &copy; 2020 Jakub Sarnowski</p><p className="mb-0 flex-auto ml-xs-0 ml-sm-2 ml-xl-2 ml-lg-2 ml-md-2"><a className="footer-link" href="https://github.com/jsarnowski96">https://github.com/jsarnowski96</a></p>
            </nav>
        )
    }    
}

export default Footer;