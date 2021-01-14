from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import MySQLdb, MySQLdb.cursors, json, datetime
import os
import subprocess
from subprocess import check_output

app = Flask(__name__)

db = MySQLdb.connect(host="***",
		user="***",
		passwd="***",
		db="***",
        cursorclass=MySQLdb.cursors.DictCursor)
		
cursor = db.cursor()

#cursor.execute('set global max_allowed_packet=67108864')
#cursor.execute("DROP TABLE IF EXISTS USERS")

sql = """CREATE TABLE IF NOT EXISTS TESTS (
	id INT NOT NULL AUTO_INCREMENT,
	operatorname VARCHAR(50) NOT NULL,
    devicename VARCHAR(50) NOT NULL,
	partnumber VARCHAR(50) NOT NULL,
    serialnumber VARCHAR(20) NOT NULL,
    datetime DATETIME NOT NULL,
    status VARCHAR(25) NOT NULL,
    notes TEXT,
	PRIMARY KEY(id))"""
	
cursor.execute(sql)

sql = """CREATE TABLE IF NOT EXISTS TESTCASES (
	lid INT NOT NULL AUTO_INCREMENT,
	id INT NOT NULL,
    linenumber INT NOT NULL,
    contents VARCHAR(250) NOT NULL,
    status VARCHAR(25) NOT NULL,
	PRIMARY KEY(lid))"""
	
cursor.execute(sql)

sql = """CREATE TABLE IF NOT EXISTS DEVICENAMES (
	id INT NOT NULL AUTO_INCREMENT,
    devicename VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY(id))"""
	
cursor.execute(sql)

sql = """CREATE TABLE IF NOT EXISTS PARTNUMBERS (
	id INT NOT NULL AUTO_INCREMENT,
    partnumber VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY(id))"""
	
cursor.execute(sql)

db.commit()



@app.route('/api', methods=['GET'])
def api():
    return output

#this one will find all tests that match the given description
@app.route('/hciquery', methods=['GET'])
def hciquery():
    tempSerial = request.args['Serial Number']
    cursor.execute("SELECT * FROM TESTS ORDER BY ID DESC LIMIT 1")
    latestTest = cursor.fetchone()
    return latestTest

#this one will find all tests *CASES* for a given test
@app.route('/hciquerytestcases', methods=['POST'])
def hciquerytestcases():
    tempID = request.json
    tempID = tempID["id"]
    cmd = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'lid', lid, 'contents', contents, 'linenumber', linenumber, 'status', status)) FROM TESTCASES WHERE id=%s"
    #cmd = 'INSERT INTO TESTCASES WHERE id=%s'
    #print(cmd)
    cursor.execute(cmd, (tempID, ))
    #allTestCases = cursor.fetchall()

    #proper json array:
    #cursor.execute("SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'lid', lid, 'contents', contents, 'status', status)) FROM TESTCASES WHERE id=1")
    testCases = cursor.fetchone()
    jsonTestCases = "{\"myLines\" : " + testCases["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'lid', lid, 'contents', contents, 'linenumber', linenumber, 'status', status))"] + "}"

    return jsonTestCases


#this one will find all tests *CASES* for a given test
@app.route('/hciupdatenote', methods=['POST'])
def hciupdatenote():
    jsonData = request.json
    tempID = jsonData["id"]
    tempNotes = jsonData["notes"]
    #print(tempID)
    #print(tempNotes)
    cmd = "UPDATE TESTS SET notes=%s WHERE id=%s"
    #cmd = 'INSERT INTO TESTCASES WHERE id=%s'
    #print(cmd)
    cursor.execute(cmd, (tempNotes, tempID))
    db.commit()
    status = "{status : \"success\"}"
    #allTestCases = cursor.fetchall()
    return status

#returns every single test in the database
@app.route('/populatedevicenames', methods=['GET'])
def populatedevicenames():
    devicedb = MySQLdb.connect(host="67.205.133.34",
		user="hciapp",
		passwd="hciapp123",
		db="hcidb",
        cursorclass=MySQLdb.cursors.DictCursor)
		
    devicecursor = devicedb.cursor()
    devicecursor.execute("SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'devicename', devicename)) FROM DEVICENAMES")
    deviceNames = devicecursor.fetchone()
    jsonDeviceNames = "{\"myDeviceNames\" : " + deviceNames["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'devicename', devicename))"] + "}"
    devicecursor.close()
    devicedb.close()
    return jsonDeviceNames

#returns every single test in the database
@app.route('/populatepartnumbers', methods=['GET'])
def populatepartnumbers():
    partdb = MySQLdb.connect(host="67.205.133.34",
		user="hciapp",
		passwd="hciapp123",
		db="hcidb",
        cursorclass=MySQLdb.cursors.DictCursor)
		
    partcursor = partdb.cursor()
    cmd = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'partnumber', partnumber)) FROM PARTNUMBERS"
    partcursor.execute(cmd)
    partNumbers = partcursor.fetchone()
    jsonPartNumbers = "{\"myPartNumbers\" : " + partNumbers["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'partnumber', partnumber))"] + "}"
    partcursor.close()
    partdb.close()
    return jsonPartNumbers

#returns every single test in the database
@app.route('/populatetests', methods=['GET'])
def populateTests():
    cmd = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes)) FROM TESTS ORDER BY ID ASC LIMIT 10"
    #print(cmd)
    cursor.execute(cmd)
    initialTests = cursor.fetchone()
    jsonInitialTests = "{\"myTests\" : " + initialTests["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes))"] + "}"
    
    return jsonInitialTests

#this one will find all tests *CASES* for a given test
@app.route('/hcisearch', methods=['POST'])
def hcisearch():
    searchdb = MySQLdb.connect(host="67.205.133.34",
		user="hciapp",
		passwd="hciapp123",
		db="hcidb",
        cursorclass=MySQLdb.cursors.DictCursor)
		
    searchcursor = searchdb.cursor()
    jsonData = request.json

    searchOperatorName= ''
    searchDeviceName= ''
    searchPartNumber= ''
    searchSerialNumber= ''
    searchDateTime= ''
    searchStatus= ''
    searchNotes= ''
    #print(jsonData["searchDateTime"])
    if jsonData["searchOperatorName"] != '':
        searchOperatorName = "OPERATORNAME=\"" + jsonData["searchOperatorName"] + "\" AND "

    if jsonData["searchDeviceName"] != 'Any':
        searchDeviceName = "DEVICENAME=\"" + jsonData["searchDeviceName"] + "\" AND "
    
    if jsonData["searchPartNumber"] != 'Any':
        searchPartNumber = "PARTNUMBER=\"" + jsonData["searchPartNumber"] + "\" AND "
    
    if jsonData["searchSerialNumber"] != '':
        searchSerialNumber = "SERIALNUMBER=\"" + jsonData["searchSerialNumber"] + "\" AND "
    
    if jsonData["searchDateTime"] != '':
        tempYear,tempMonth,tempDay= jsonData["searchDateTime"].split("-")
        searchDateTime = "YEAR(datetime)=" + tempYear+ " AND MONTH(datetime)=" + tempMonth + " AND DAY(datetime)=" + tempDay + " AND "
    
    if jsonData["searchStatus"] != 'Either':
        searchStatus = "STATUS=\"" + jsonData["searchStatus"] + "\" AND "
    
    if jsonData["searchNotes"]:
        searchNotes = "NOTES <> ''" + " AND "
    
    #print(jsonData["searchNotes"])
    cmd = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes)) FROM TESTS WHERE %s%s%s%s%s%s%s1=1"%(searchOperatorName, searchDeviceName, searchPartNumber, searchSerialNumber, searchDateTime, searchStatus, searchNotes)
    #print(cmd)
    searchcursor.execute(cmd)
    searchResults = searchcursor.fetchone()
    #print(searchResults)
    jsonSearchResults = "{\"myTests\": [] }"


    if searchResults["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes))"] != None:
        #print(searchResults["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes))"])
        jsonSearchResults = "{\"myTests\" : " + searchResults["JSON_ARRAYAGG(JSON_OBJECT('id', id, 'operatorname', operatorname, 'devicename', devicename, 'partnumber', partnumber, 'serialnumber', serialnumber, 'datetime', datetime, 'status', status, 'notes', notes))"] + "}"

    searchcursor.close()
    searchdb.close()
    return jsonSearchResults


if __name__ == '__main__':
    app.run(debug=True)