# Problem with Version
import pymongo						
from sys import stdout
from pymongo import MongoClient

path=input('Enter the path to the file : ');
collection=input('Enter the collection name : ')

client=MongoClient()
db=client['IBM']
collection=db[collection]

fo=open(path,'r');

content=fo.read();
content=content.split('\r\n');

header=content[0].split(',');

for j in range(0,len(header)):
	header[j]=header[j].replace('"','');

for i in range(1,len(content)-1):
	val=content[i].split(',');
	res={}
	for j in range(0,len(header)):		
		val[j]=val[j].replace('"','');
		# print(header[j]);
		# print(val[j])
		res[header[j]]=val[j];		
	_id=collection.insert_one(res)
	stdout.write("\rStatus : "+str(i)+"/"+str(len(content)-1))
	stdout.flush();

fo.close();