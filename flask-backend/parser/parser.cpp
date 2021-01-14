#include <iostream>
#include <fstream>
#include <algorithm>

using namespace std;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        cout << "{\"Status\" : \"No file provided\"}";
        return 1;
    }
    // int firstNumber, secondNumber, sumOfTwoNumbers;

    // cout << "Enter two integers: ";
    // cin >> firstNumber >> secondNumber;

    // // sum of two numbers in stored in variable sumOfTwoNumbers
    // sumOfTwoNumbers = firstNumber + secondNumber;

    // // Prints sum
    // cout << firstNumber << " + " <<  secondNumber << " = " << sumOfTwoNumbers;

    // return 0;
    // Create a text string, which is used to output the text file
    string myText;

    // Read from the text file
    ifstream MyReadFile(argv[1]);

    if(!MyReadFile){
        cout << "{\"Status\" : \"No file provided\"}";
        return 1;
    }
    // Use a while loop together with the getline() function to read the file line by line
    int foundFirstLine = 0;
    int testPassed = 1;
    //Store the array of all test lines in here
    std::string allLines = "\"myLines\":[";
    std::string deviceJSON = "{ ";
    int deviceInfoCounter = 0;
    while (getline(MyReadFile, myText))
    {
        // Output the text from the file

        if (deviceInfoCounter < 6)
        {
            //"Operator Name: xpuser"
            //"Device Name: XCAP Base Box - 218349 Test without OCM"
            //"Part Number: 218349 without OCM"
            //"Serial Number: H2520#04"
            //"Date(M/D/Y): 8/25/2020"
            //"Time(H:M:S): 10:51:13"
            if(myText.compare("\"Serial Number: \"") == 0 || myText.compare("\"Serial Number:\"") == 0 ){
                myText = "\"Serial Number: N/A\"";
            }
            std::string delimiter = ": ";
            std::string deviceLine = myText.substr(0, myText.find(delimiter));
            //cout << deviceLine << endl;

            deviceJSON += deviceLine + "\" : \"";

            int delimiterPos = myText.find(delimiter);
            myText.erase(0, delimiterPos + delimiter.length());
            deviceLine = myText;
            //cout << deviceLine << endl;

            deviceJSON += deviceLine + ", ";

            //std::replace( myText.begin(), myText.end(), ": ", "\" :\" ");

            deviceInfoCounter++;
            continue;
        }

        std::string delimiter = ")";
        std::string lineNumber = myText.substr(0, myText.find(delimiter));

        lineNumber.erase(0, 1);
        lineNumber.erase(0, 1);

        if (lineNumber.size() == 0)
        {
            break;
        }
        if (lineNumber.at(0) == '1')
        {
            foundFirstLine = 1;
        }

        if (foundFirstLine == 1)
        {
            if (isdigit(lineNumber.at(0)) == true)
            {
                //cout << lineNumber << endl;
                if (myText.find("Fail") != string::npos)
                {
                    testPassed = 0;
                    //cout << "failure on line " << lineNumber << endl;
                    std::string anEntry = "{ \"lineNumber\":\"" + lineNumber + "\", " + "\"content\":" + myText + ", " + "\"status\":\"Fail\"}";
                    //cout << anEntry << endl;
                    allLines += anEntry + ", ";
                }
                else if (myText.find("User Pressed Cancel") != string::npos)
                {
                    std::string anEntry = "{ \"lineNumber\":\"" + lineNumber + "\", " + "\"content\":" + myText + ", " + "\"status\":\"User Pressed Cancel\"}";
                    //cout << anEntry << endl;
                    allLines += anEntry + ", ";
                }
                else
                {
                    std::string anEntry = "{ \"lineNumber\":\"" + lineNumber + "\", " + "\"content\":" + myText + ", " + "\"status\":\"Pass\"}";
                    //cout << anEntry << endl;
                    allLines += anEntry + ", ";
                }
            }
        }

        if (myText.find(" 1)") != string::npos)
        {
            //cout << myText << endl;
        }
        if (myText.find(" 1)") != string::npos)
        {
            //cout << myText << endl;
        }
        //cout << myText;
    }
    if (allLines.size() > 13)
    {
        allLines.pop_back();
        allLines.pop_back();
    }
    allLines += "]";
    if (testPassed == 1){
        allLines += ", \"Status\" : \"Pass\"}";
    }
    else{
        allLines += ", \"Status\" : \"Fail\"}";
    }
    deviceJSON += allLines;
    cout << deviceJSON << endl;

    // Close the file
    MyReadFile.close();
    return 0;
}