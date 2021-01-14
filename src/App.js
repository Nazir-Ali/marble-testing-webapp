import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import './App.css';
import Tests from './components/Tests';
import Header from './components/Header';
import Search from './components/Search';



// Have button that only shows up when currentDisplay > 10 (0->9) (<<)
// Have button that only shows up when currentDisplay < tests.length (>>)
// Store all tests in a state maybe, and when the button is pressed, splice a different part into
// the tests: [] array, and update the view?
//If I had more time I planned on adding a paging system for test results using testData and currentDisplay
class App extends Component {
  state = {
    tests: [

    ],
    testData: "",
    currentDisplay: 10
  }


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 componentDidMount()
  ///   When App.js finishes mounting, grab tests from the database
  ///   and show the latest 10 tests on the page
  //////////////////////////////////////////////////////////////////////////////////////
  async componentDidMount() {
    fetch('/populatetests').then(res => res.json()).then(data => {

      //get the myTests array
      data = data.myTests;
      this.setState({ testData: data });
      //only get the last 10 tests
      data = data.slice([-10]);

      //reverse it so highest id comes first
      data = data.reverse();
      //console.log(data);
      //data = JSON.parse(data);
      this.setState({ tests: [] });
      data.forEach((testText) => {
        //console.log(testText);
        const newTest = {
          OperatorName: testText["operatorname"],
          DeviceName: testText["devicename"],
          PartNumber: testText["partnumber"],
          SerialNumber: testText["serialnumber"],
          DateTime: testText["datetime"],
          Status: testText["status"],
          IsOpen: false,
          isPopulated: false,
          Notes: testText["notes"],
          id: testText["id"]
        }
        var tempTime = newTest.DateTime;
        tempTime = tempTime.split('.')[0];
        newTest.DateTime = tempTime;
        this.setState({ tests: [...this.state.tests, newTest] });
      });
      //this.setState({ tests: [...this.state.tests, ]});
    });
  }


  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 searchPopulateTests()
  ///   Handle the data returned from the search button in Search.js (sent as a prop)
  ///   and show all tests that match the query result in reverse order
  //////////////////////////////////////////////////////////////////////////////////////
  searchPopulateTests = (data) => {

    //get the myTests array
    data = data.myTests;
    this.setState({ testData: data });
    //only get the last 10 tests
    //data = data.slice([-10]);

    //reverse it so highest id comes first
    data = data.reverse();
    //console.log(data);
    //data = JSON.parse(data);
    this.setState({ tests: [] });
    data.forEach((testText) => {
      //console.log(testText);
      const newTest = {
        OperatorName: testText["operatorname"],
        DeviceName: testText["devicename"],
        PartNumber: testText["partnumber"],
        SerialNumber: testText["serialnumber"],
        DateTime: testText["datetime"],
        Status: testText["status"],
        IsOpen: false,
        isPopulated: false,
        Notes: testText["notes"],
        id: testText["id"]
      }
      var tempTime = newTest.DateTime;
      tempTime = tempTime.split('.')[0];
      newTest.DateTime = tempTime;
      this.setState({ tests: [...this.state.tests, newTest] });
    });
    //this.setState({ tests: [...this.state.tests, ]});
  }


  render() {
    //console.log(this.state.tests);
    //this.populateTests();

    //console.log(this.state.tests);
    return (
      <React.Fragment>
        <div style={{ border: '10px solid #222831', borderRadius: '25px' }}>
          <Header />
          <Search tests={this.state.tests} searchPopulateTests={this.searchPopulateTests} />
          <Tests tests={this.state.tests} />
        </div>




      </React.Fragment>
    );
  }


}

export default App;
