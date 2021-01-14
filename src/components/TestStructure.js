import React, { Component } from 'react';
import PropTypes from 'prop-types'
import TestCases from './TestCases'
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import '../App.css';


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 TestStructure.js
  ///   Contains subcomponent for TestCases.js and a small form to update notes
  //////////////////////////////////////////////////////////////////////////////////////
class TestStructure extends Component {
  state = {
    testcases: [

    ],
    noteUpdate: false
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 get-X-Style()
  ///   Just functions that make it somewhat neater when getting the css style
  //////////////////////////////////////////////////////////////////////////////////////
  getStyle = () => {
    return {
      paddingTop: '10px',
      paddingBottom: '0px',
      borderBottom: '1px solid #222831',
      background: '#393e46',
      color: '#eeeeee'
    }

  }

  getFormStyle = () => {
    return {
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '10px',
      paddingRight: '10px',
      background: '#393e46',
      border: '10px solid #222831',
      borderRadius: '25px',
      display: 'flex'
    }

  }

  getFormVisible = () => {
    return {
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '10px',
      display: this.props.test.IsOpen ?
        'block' :
        'none'
    }

  }

  getTestCasesStyle = () => {
    return {
      background: '#90EE90',
      border: '10px solid #222831',
      borderRadius: '25px'
    }

  }

  getStyleCheck = () => {
    return {
      display: this.props.test.Status == "Fail" ?
        'none' :
        'inline'
    }

  }
  getStyleCross = () => {
    return {
      display: this.props.test.Status != "Fail" ?
        'none' :
        'inline'
    }

  }

  getStyleNote = () => {
    return {
      marginTop: '6px',
      marginRight: '25px',
      float: 'right',
      display: this.props.test.Notes == "" ?
        'none' :
        'inline'
    }

  }

  getSubmitStyle = () => {
    return {
      color: this.state.noteUpdate == true ?
        '#90EE90' :
        '#393e46',
      background: this.state.noteUpdate == true ?
        '#393e46' :
        '#EEEEEE'
    }

  }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 testExpand()
  ///   Handles the expansion and collapse of the TestStructure, where it would reveal
  ///   all of its test cases, also unloads unused data when collapsed
  //////////////////////////////////////////////////////////////////////////////////////
  testExpand = () => {
    if (this.props.test.IsOpen) {
      const data = { id: this.props.test.id }
      fetch('/hciquerytestcases', {
        type: 'POST',
        method: 'POST',
        headers: {
          "content_type": "application/json",
        },
        body: JSON.stringify(data)
      }
      ).then(res => res.json()).then(data => {
        data = data.myLines;
        //only get the last 10 tests
        //data = data.slice([-10]);

        //reverse it so highest id comes first
        //data = data.reverse();
        //console.log(data);
        //data = JSON.parse(data);
        this.setState({ testcases: [] });
        data.forEach((testText) => {
          const newTestCase = {
            lid: testText["lid"],
            contents: testText["contents"],
            linenumber: testText["linenumber"],
            status: testText["status"],
            id: testText["id"]
          }
          this.setState({ testcases: [...this.state.testcases, newTestCase] });
        });
        //console.log(this.state.testcases);
        this.props.test.isPopulated = true;
        this.forceUpdate();
      });
    }
    else if (!this.props.test.IsOpen) {
      this.setState({ testcases: [] });
      this.props.test.isPopulated = false;
      this.forceUpdate();
    }

  }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 onSubmit()
  ///   Handles submit event to update the note of a test
  //////////////////////////////////////////////////////////////////////////////////////
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ noteUpdate: true });
    const data = {
      id: this.props.test.id,
      notes: document.getElementById("N" + this.props.test.id).value
    }
    fetch('/hciupdatenote', {
      type: 'POST',
      method: 'POST',
      headers: {
        "content_type": "application/json",
      },
      body: JSON.stringify(data)
    }
    );
    this.props.test.Notes = document.getElementById("N" + this.props.test.id).value;
    setTimeout(function () {
      this.setState({ noteUpdate: false });
      this.props.test.IsOpen = !this.props.test.IsOpen;
      this.testExpand();
    }.bind(this), 2000);
  }
  // only update the component
  populateNotes = () => {
    document.getElementById("N" + this.props.test.id).value = this.props.test.Notes;
  }

  render() {

    //console.log(this.props.test)
    return (
      //set on click to call a function instead that displays the other stuff?

      <div style={this.getStyle()}>
        <p style={{ paddingLeft: '15px', paddingRight: '15px' }} onClick={() => {
          //alert(this.props.test.id);
          this.props.test.IsOpen = !this.props.test.IsOpen;
          //this.forceUpdate();
          this.testExpand();
        }}>
          <i style={this.getStyleCross()} className="fa fa-times"></i>
          <i style={this.getStyleCheck()} className="fa fa-check"></i>
          {'     '} {this.props.test.DateTime} | {this.props.test.SerialNumber} | ({this.props.test.DeviceName}, {this.props.test.PartNumber}) <i style={this.getStyleNote()} className="fa fa-comment"></i>
          {" "}
        </p>
        <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          {this.props.test.IsOpen && this.props.test.isPopulated ?
            <React.Fragment>
              <div style={this.getTestCasesStyle()}>
                <TestCases testcases={this.state.testcases} />
              </div>
              {this.populateNotes()}
            </React.Fragment>

            :
            " "}
        </div>
        <div style={this.getFormVisible()}>
          <form style={this.getFormStyle()} onSubmit={this.onSubmit}>
            <p style={{ textAlign: 'center', display: 'block' }}>
              Notes:
                  </p>
            <br />
            <textarea name="testNote" id={"N" + this.props.test.id} style={{ resize: 'none', flex: '1' }} placeholder="Notes for correcting test failures"></textarea>

            <input type="submit" value={this.state.noteUpdate == true ? "Note Updated" : "Update Notes"} style={this.getSubmitStyle()} />
          </form>
        </div>
      </div>

    )
  }


}



TestStructure.propTypes = {
  test: PropTypes.object.isRequired
}

export default TestStructure;