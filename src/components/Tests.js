import React, { Component } from 'react';
import TestStructure from './TestStructure'
import PropTypes from 'prop-types'


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 Tests.js
  ///   Component that maps every test from App.js to a subcomponent TestStructure.js
  //////////////////////////////////////////////////////////////////////////////////////
class Tests extends Component {
    render() {
        //console.log(this.props.tests)
        return this.props.tests.map((test) => (
            <React.Fragment key={test.id}>
                <TestStructure test={test} />
            </React.Fragment>

        ));
    }

}

//PropTypes
Tests.propTypes = {
    tests: PropTypes.array.isRequired
}

export default Tests;