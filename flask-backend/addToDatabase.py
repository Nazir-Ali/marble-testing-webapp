import MySQLdb, MySQLdb.cursors, json, datetime
import os
import subprocess
import sys
from subprocess import check_output

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

command = "./parser/parser.exe"
output = subprocess.check_output([command, "./parser/PASS.txt"])
jsonObject = eval(output)
if jsonObject["Status"] == "{\"Status\" : \"No file provided\"}":
    sys.exit(1)
#print(jsonObject["Operator Name"])

#tempYear,tempMonth,tempDay= jsonData["searchDateTime"].split("-")
jsonObject["Date(M/D/Y)"] =  jsonObject["Date(M/D/Y)"] + " " + jsonObject["Time(H:M:S)"]
jsonObject["Date(M/D/Y)"] = datetime.datetime.strptime(jsonObject["Date(M/D/Y)"], '%m/%d/%Y %H:%M:%S')
#print(jsonObject["Date(M/D/Y)"])
#try:
cmd = "INSERT INTO TESTS VALUES(NULL, %s, %s, %s, %s, %s, %s, \"\")"
try:
    cursor.execute(cmd, (jsonObject["Operator Name"], jsonObject["Device Name"], jsonObject["Part Number"], jsonObject["Serial Number"], jsonObject["Date(M/D/Y)"], jsonObject["Status"]))
except MySQLdb.IntegrityError:
    pass
db.commit()
cursor.execute("SELECT * FROM TESTS ORDER BY ID DESC LIMIT 1")
latestTest = cursor.fetchone()

try:
    cmd = "INSERT INTO DEVICENAMES VALUES(NULL, %s)"
    cursor.execute(cmd, (jsonObject["Device Name"], ))
except MySQLdb.IntegrityError:
    pass

try:
    cmd = "INSERT INTO PARTNUMBERS VALUES(NULL, %s)"
    cursor.execute(cmd, (jsonObject["Part Number"], ))
except MySQLdb.IntegrityError:
    pass





latestID = latestTest['id']
#print(latestID)
myLines = jsonObject['myLines']
for singleLine in myLines:
    cmd = 'INSERT INTO TESTCASES VALUES (NULL, %s, %s, %s, %s)'
    try:
        cursor.execute(cmd, (latestID, singleLine['lineNumber'], singleLine['content'], singleLine['status']))
    except MySQLdb.IntegrityError:
        pass
    





db.commit()

cursor.close()
db.close()