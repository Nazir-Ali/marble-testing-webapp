import React, { Component } from 'react';
import PropTypes from 'prop-types'


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 TestCaseStructure.js
  ///   Contains a testcase for its parent test
  //////////////////////////////////////////////////////////////////////////////////////
class TestCaseStructure extends Component {

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 get-X-Style()
  ///   Just functions that make it somewhat neater when getting the css style
  //////////////////////////////////////////////////////////////////////////////////////
    getStyle = () => {
        return {
            paddingTop: '5px',
            paddingBottom: '0px',
            fontSize: '15px',
            color: this.props.testcase.status == "Fail" ?
                '#393e46' :
                '#eeeeee',
            borderBottom: '1px solid #222831',
            display: 'block',
            overflow: 'auto',
            background: this.props.testcase.status == "Fail" ?
                '#f18c8a' :
                '#393e46'
        }

    }


    getStyleP = () => {
        return {
            marginBottom: '8px',
            paddingLeft: '15px'
        }

    }

    render() {
        //console.log(this.props.test)
        //console.log(this.props.testcase);
        return (
            <div style={this.getStyle()}>
                <p style={this.getStyleP()}>
                    {'     '}{this.props.testcase.contents}
                </p>
            </div>

        )
    }

}

TestCaseStructure.propTypes = {
    testcase: PropTypes.object.isRequired
}

export default TestCaseStructure;