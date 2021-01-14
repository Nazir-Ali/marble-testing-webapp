import React,{ Component } from 'react';
import TestCaseStructure from './TestCaseStructure'
import PropTypes from 'prop-types'

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 TestCases.js
  ///   Component that maps every testcase from TestStructure.js to a subcomponent
  //    TestCaseStructure.js
  //////////////////////////////////////////////////////////////////////////////////////
class TestCases extends Component {
    render (){
        //console.log(this.props.testcases);
        return this.props.testcases.map((testcase) => (
            <TestCaseStructure key={testcase.lid} testcase={testcase}/>
            //<p>yeee</p>
        ));
    }

}

//PropTypes
TestCases.propTypes = {
    testcases: PropTypes.array.isRequired
}

export default TestCases;