import React,{ Component } from 'react';
import InfoModal from './InfoModal';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 Header.js
  ///   Just a header/title for the website which also contains an InfoModal.js to
  ///   show users how to use the app
  //////////////////////////////////////////////////////////////////////////////////////
class Header extends Component {



    render(){
        return(
            <header style={headerStyle}>
            <h1><p>Marble Electronics Testing Support Web-App <InfoModal/></p></h1>
            
            </header>
        );
    }

}

const headerStyle = {
    background: '#222831',
    color: '#EEEEEE',
    textAlign: 'center',
    padding: '10px'
}

export default Header;