import xml.etree.ElementTree as ET
import sys
import requests
import simplejson as json
from StringIO import StringIO
import re

f=open(sys.argv[1],'r')
tree = ET.parse(sys.argv[2])
root = tree.getroot()
nm='{http://www.stercomm.com/SI/Map}'
url = "http://localhost:4000"
agency=""
version=""
bindingId=""
pos = " "
posSeg=0
loopId =" "
queryPdf ={}
query1 = ""
Tdescription =" "
TfunctionalId =" "
active=" "
queryEle ={}
queryEleUsage={}
noOfHeaders=0
noOfDetails=0
noOfSummary=0
for child in root.iter(nm+'EDIAssociations_IN'):
	agency = child.find(nm+'AgencyID').text
	version = child.find(nm+'VersionID').text
	bindingId = child.find(nm+'BindingID').text
	query={'agency': agency}
	res = requests.post(url+"/api/agency/get",data = query)	
	o = json.loads(res.text)
	print o['data'][0]['Description']
	query={'agency': agency , 'version' : version}
	res = requests.post(url+"/api/version/get",data = query)
	o = json.loads(res.text)
	print o['data'][0]['Description']
	query={'agency' : agency , 'version' : version , 'transactionSet' : bindingId}
	res = requests.post(url+"/api/transactionSet/get", data = query)
	o = json.loads(res.text)
	print'xyz'
	print o['data'][0]['Description']
	Tdescription = o['data'][0]['Description']
	print o['data'][0]['FunctionalGroupID']
	TfunctionalId = o['data'][0]['FunctionalGroupID']
tag=" "

for seg in f.readlines() :
	values = seg.split('~')
	print values[0]
	
	v=re.split(r'[*]*',values[0])
	#print v[0]
	posSeg=0
	for ch in root.iter(nm+'INPUT'):
		
		for child in ch.iter(nm+'Segment'):
			posSeg+=1
			for block in child.findall(nm+'BlockSig') :
				
				tag=block.find(nm+'Tag')
				if(tag!='' and tag.text==v[0]) :
					print tag.text
					#print posSeg
				else:
					break
			if(tag.text!=v[0]):
				continue

				
			
				
			query={'agency':agency ,'version':version ,'transactionSet':bindingId,'segment':posSeg}
			res=requests.post(url+"/api/segmentUsage/getFromPosition", data = query)
			o = json.loads(res.text)
			pos = 0

			if o['data']!=None :
				
				print 'loopID'+o['data'][0]['LoopID']
				
				print o['data'][0]
				
				
				

				queryPdf[str(posSeg)]={}
				queryPdf[str(posSeg)]=o['data'][0]
				if(o['data'][0]['Section']=='H'):
					noOfHeaders+=1
					print "no OF HEADRERS"+str(noOfHeaders)
				elif(o['data'][0]['Section']=='D'):
					noOfDetails+=1
					print "no of details"+str(noOfDetails)
				elif(o['data'][0]['Section']=='S'):
					noOfSummary+=1
					print "no of summary"+str(noOfSummary)
				
			i=1
			j=len(v)
			print 'j='+str(j)
			count=1
			active =0
			for field  in child.iter(nm+'Field'):
				
				if (i<j):
					
					if((v[i].isspace())):
						a=1
						print 'space'+v[i]
				
					elif(v[i]!='>'):
						 
						if(i<j):
							active+=1
							for name_in_field in field.findall(nm+'Name'):
								print "element ID is : :"+name_in_field.text
								break
								query={'agency':agency ,'version':version , 'segmentId':tag.text,'position':i}
								res=requests.post(url+"/api/elementUsageDefs/getFromPosition", data = query)
								o = json.loads(res.text)
								if o['data']!=None :
									print "element ID is"+name_in_field.text
									print 'Description of element'+name_in_field.text+' has '+o['data'][0]['Description']
									queryEleUsage[str(posSeg)]=o['data'][0]
				elif(i>=j) :
					queryEle[str(posSeg)]=active	
					break

				i=i+1
			if(i>=j):

				break
		break
			
query1={'version':version,'transactionSet' :bindingId,'transactionDescription':Tdescription,'transactionFunctionalGroup':TfunctionalId,'numberOfElementsInSegment':json.dumps(queryEle),'elementUsageDefs':json.dumps(queryEleUsage), 
	'headingText':'','footerText':'','businessPartnerText':'SushmitaInbound','numberOfHeadingSegments':noOfHeaders,'numberOfDetailSegments':noOfDetails,'segmentUsage':json.dumps(queryPdf),'numberOfSummarySegments':noOfSummary,'segmentText':"{}",'code':"{}"}
requests.post(url+"/api/pdf/create",data = query1)		









