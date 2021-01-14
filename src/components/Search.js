import React, { Component } from 'react';

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 Search.js
  ///   Component that handles the Search form, and sends data back to App.js via
  ///   the prop function sent to it
  //////////////////////////////////////////////////////////////////////////////////////
class Search extends Component {
    state = {
        deviceNames: [
            {
                DeviceName: "Any",
                id: 0
            }
        ],
        partNumbers: [
            {
                PartNumber: "Any",
                id: 0
            }
        ]
    }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 get-X-Style()
  ///   Just functions that make it somewhat neater when getting the css style
  //////////////////////////////////////////////////////////////////////////////////////
    getStyle = () => {
        return {
            background: '#222831',
            color: '#EEEEEE',
            textAlign: 'center',
            padding: '10px'
        }
    }

    getFormStyle = () => {
        return {

            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            background: '#393e46',
        }

    }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 onSubmit()
  ///   Handles the creation of the data json object which contains all the
  //    search parameters and returns that data to App.js
  //////////////////////////////////////////////////////////////////////////////////////
    onSubmit = (e) => {
        e.preventDefault();
        const data = {
            searchOperatorName: document.getElementById("searchOperatorName").value,
            searchDeviceName: document.getElementById("searchDeviceName").value,
            searchPartNumber: document.getElementById("searchPartNumber").value,
            searchSerialNumber: document.getElementById("searchSerialNumber").value,
            searchDateTime: document.getElementById("searchDateTime").value,
            searchStatus: document.getElementById("searchStatus").value,
            searchNotes: document.getElementById("searchNotes").checked
        }
        fetch('/hcisearch', {
            type: 'POST',
            method: 'POST',
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify(data)
        }
        ).then(res => res.json()).then(data => {
            //get the myTests array
            this.props.searchPopulateTests(data);
        });
    }

  //////////////////////////////////////////////////////////////////////////////////////
  ///                                 componentDidMount()
  ///   On page load it fills up to select input with data from the server for a drop
  ///   down menu that will make searching more efficient (no need to search for sub
  ///   strings this way)
  //////////////////////////////////////////////////////////////////////////////////////
    async componentDidMount() {
        fetch('/populatedevicenames').then(res => res.json()).then(data => {

            //get the myDeviceNames array
            data = data.myDeviceNames;

            //this.setState({ deviceNames: [] });
            data.forEach((testText) => {
                //console.log(testText);
                const newDevice = {
                    DeviceName: testText["devicename"],
                    id: testText["id"]
                }

                this.setState({ deviceNames: [...this.state.deviceNames, newDevice] });
            });
            //console.log(this.state.deviceNames)
            //this.setState({ tests: [...this.state.tests, ]});
        });
        fetch('/populatepartnumbers').then(res => res.json()).then(data => {

            //get the myDeviceNames array
            data = data.myPartNumbers;

            //this.setState({ partNumbers: [] });
            data.forEach((testText) => {
                //console.log(testText);
                const newPart = {
                    PartNumber: testText["partnumber"],
                    id: testText["id"]
                }

                this.setState({ partNumbers: [...this.state.partNumbers, newPart] });
            });
            //console.log(this.state.partNumbers)
            //this.setState({ tests: [...this.state.tests, ]});
        });
    }

    render() {
        //console.log(this.props.tests)
        return (
            <React.Fragment>
                <div style={this.getStyle()}>

                    <form style={this.getFormStyle()} onSubmit={this.onSubmit}>
                        <div style={{display: "table", width: "100%", textAlign: "center"}}>
                        <div style={{ marginBottom:'10px', display: "table-cell" , textAlign: "right", paddingLeft: "100px"}}>
                            <p style={{ marginBottom: '0', marginTop: '6px' }}>
                                Operator Name:
                            </p>

                            <p style={{ marginBottom: '0', marginTop: '30px' }}>
                                Serial Number:
                            </p>
                            <p style={{ marginBottom: '0', marginTop: '32px' }}>
                                Date:
                            </p>
                        
                        </div>


                        <div style={{ marginBottom:'10px', display: "table-cell", textAlign: "left"}}>
                            <p>
                            <input name="searchOperatorName" id="searchOperatorName" style={{ resize: 'none', margin: '5px', width:"300px" }} type="text" placeholder="xpuser" />
                            </p>

                            <p>
                            <input name="searchSerialNumber" id="searchSerialNumber" style={{ resize: 'none', margin: '5px', width:"300px"  }} type="text" placeholder="A2019#01" />
                            </p>

                            <p>
                            <input name="searchDateTime" id="searchDateTime" style={{ resize: 'none', margin: '5px', width:"300px"  }} type="date" />
                            </p>
                        </div>

                        <div style={{display: "table-cell", textAlign: "right"}}>
                            <p style={{ marginBottom: '0', marginTop: '3px' }}>
                                Device Name:
                            </p>
                            <p style={{ marginBottom: '0', marginTop: '24px' }}>
                                Part Number:
                            </p>
                            <p style={{ marginBottom: '0', marginTop: '25px' }}>
                                Status:
                            </p>
                        </div>

                        <div style={{display: "table-cell", textAlign: "left", paddingRight: "50px"}}>
                            <p>
                                <select name="searchDeviceName" id="searchDeviceName" style={{  margin: '5px', width:"300px"  }}>
                                    {this.state.deviceNames.map(device => (
                                        <option key={device.DeviceName} value={device.DeviceName}>
                                            {device.DeviceName}
                                        </option>
                                    ))}
                                </select>
                            </p>


                            <p>
                                <select name="searchPartNumber" id="searchPartNumber" style={{ margin: '5px', width:"300px"  }}>
                                    {this.state.partNumbers.map(part => (
                                        <option key={part.PartNumber} value={part.PartNumber}>
                                            {part.PartNumber}
                                        </option>
                                    ))}
                                </select>
                            </p>

                            <p>
                                <select name="searchStatus" id="searchStatus" style={{ flex: 'auto', margin: '5px', width:"300px"  }}>
                                    <option value="Either">
                                        Either
                                    </option>
                                    <option value="Pass">
                                        Pass
                                    </option>
                                    <option value="Fail">
                                        Fail
                                    </option>
                                </select>
                            </p>

                        </div>

                        </div>
                        <div style={{ display: 'flex'}}>
                            <p style={{ flex: 'auto', margin: '5px' }}>
                                Only search for tests with filled in notes:    {"   "}
                                <input type="checkbox" name="searchNotes" id="searchNotes" value="Notes" style={{ width: '30px', height: '30px', verticalAlign: 'middle' }} />
                            </p>


                        </div>
                        <input type="submit" value={"Search"} style={{ flex: 'auto', margin: '5px' }} />


                    </form>
                </div>
            </React.Fragment>

        );



    }

}


export default Search;