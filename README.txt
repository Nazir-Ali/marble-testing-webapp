Student Name: Nazir Ali

Note:
This app was made in a Windows 10 64-bit system,
you will need an internet connection to use it, as the
database is remotely accessed.

General Notes:
Within the hci-app/flask-backend directory there is an addToDatabase.py,
while marking it you won't need to use it, but it was a simple python file
I made that would call my parser and add its files to my database.
There is also a directory within there called parser, it contains the test
files that I parsed, as well as the source code and more importantly, the
parser.exe program that I coded to parse the files and return json strings
for the back-end to use.

Back-end:
1. Ensure you have python 3.9.1 (I'm very new to this so im not sure how strict having the exact version is)
2. Install dependencies:
    For Flask: pip install Flask
    For MySQLdb: I heard there were some issues that came up with it when using it on windows, so instead of
                    pip install MySQLdb I used the version found on https://www.radishlogic.com/coding/python-3/installing-mysqldb-for-python-3-in-windows/ ->  https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient
                    After downloading the file I went to the directory the file was at and did 'pip install mysqlclient-1.4.6-cp39-cp39-win_amd64.whl'
3. Enter the hci-app/flask-backend directory and run 'python app.py' to start the Back-end


Front-end:
1. Enter hci-app directory
2. Install the dependencies with: 'yarn install'
3. Start the front-end with: 'yarn start'
4. Front-end is up and running, access it by going to localhost:3000
5. App was tested through-out the development process in Google Chrome, but FireFox also seemed to be working correctly on light inspection

Work Done by Me:
hci-app/src:
    App.js
    App.css
hci-app/src/components:
    Header.js
    Search.js
    TestCases.js
    TestCaseStructure.js
    Tests.js
    TestStructure.js
hci-app/flask-backend:
    app.py
    addToDatabase.py                This is the file to add a test to the database, it wont be used
hci-app/flask-backend/parser:       in the system itself, but instead as a part of the system it would integrate with.
    parser.cpp
    parser.exe                      This file converts test files into JSON for the addToDatabase function, also wont
                                    be used in the system, its part of the integration for the system.


Used Libraries:
The template for the front-end was generated using create-react-app, I don't think this counts
as using an external library, but I wasnt entirely sure, so im including it.
The other file that comes from external sources is the slightly modified Modal
example that can be found on the Material-UI website, where I took the example and modified
it to fit my own use case in the info (?) button, this is found in hci-app/src/InfoModal.js
and modal.css.