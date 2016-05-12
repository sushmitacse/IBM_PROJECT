'use strict';

//Required include
var database = require('../config/database');
var genRes = require('./controllers/genres.js');

//User defined Directories
var agency = require('./controllers/Agency.js');
var version = require('./controllers/Version.js');
var versionModel = require('./models/Version.js');
var transactionSet = require('./controllers/TransactionSet.js');
var segmentUsage = require('./controllers/SegmentUsage.js');
var segmentDescription = require('./controllers/SegmentDescription.js');
var elementUsageDefs = require('./controllers/ElementUsageDefs.js');
var code = require('./controllers/Code.js');

//Required include
var _ = require('underscore');
var fs = require('fs');
// var dimension = require('image-size');
var path = require('path');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var cc = require('coupon-code');
var pdfkit = require('pdfkit');
//var doc = new jsPDF("portrait","px","a4");

//local variables
var numberOfElements=0;
var numberOfElementsRetrieved=0;

//user defined modules

mongoose.connect(database.url);
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); // Error handler
var db = mongoose.connection;

var invalid_auth_error = "Invalid session : auth failed";

exports.index = function (req, res) {
		if(res){
			res.send('You got yourself into the api');
		}
		else{
			res.send('Invalid Request');
		}
}

/*
Middleware functions for api/*
*/

//Get Agency Api /api/getAgency

exports.getAgency = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency
	};

	agency.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllAgency = function(req,res){
	var params=req.body;
	var query={};

	agency.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

//Get Version Api /api/getVersion

exports.getVersion = function(req,res){
	var params=req.body;
	var query={
		"Agency": params.agency ,
		"Version" : params.version
	};
	version.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllVersion = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency ,
	};
	version.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

//Get Transaction Set Api /api/getTransactionSet

exports.getTransactionSet = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency ,
		"Version" : params.version,
		"TransactionSet" : params.transactionSet				
	};
	transactionSet.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllTransactionSet = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency ,
		"Version" : params.version,				
	};
	transactionSet.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}
//Get Segment Description Api /api/segmentDescription/get

exports.getSegmentDescription = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"SegmentID" : params.segment
	};
	segmentDescription.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;	
		res.send(JSON.stringify(obj));
	});	
}


//Get Segment Usage Api /api/getSegmentUsage

exports.getSegmentUsage = function(req,res){
	var params=req.body;
	var obj={};
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"TransactionSetID" : params.transactionSet,
		"SegmentID" : params.segment
	};
	console.log(query);
	segmentUsage.get(query,function(msg,data){
		obj=JSON.parse(msg);
		obj.data=data;
		if(data!=undefined && data.length>0)
		{
			query={
				"Agency" : params.agency,
				"Version" : params.version, 
				"SegmentID" : params.segment
			};
			segmentDescription.get(query,function(msg,data){
				msg=JSON.parse(msg);
				obj.status=msg.status;
				obj.message=msg.message;
				if(data)
				{
					
					obj.description=data[0]['Description'];	
					res.send(JSON.stringify(obj));
				}
				else
				{
					res.send(JSON.stringify(obj));	
				}
			});
		}
		else
		{
			console.log("No segment found");
			res.send(JSON.stringify(obj));
		}
	});	
}

exports.getSegmentUsageFromPosition = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"TransactionSetID" : params.transactionSet,
		"Position" : params.segment
	};
	console.log(query);
	segmentUsage.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		//res.send(JSON.stringify(obj));
		if(data!=undefined && data.length>0)
		{
			query={
				"Agency" : params.agency,
				"Version" : params.version, 
				"SegmentID" : data[0]['SegmentID']
			};
			console.log(query);
			segmentDescription.get(query,function(msg,data){
				// console.log(msg);
				// console.log(data);
				msg=JSON.parse(msg);
				obj.status=msg.status;
				obj.message=msg.message;
				if(data)
				{
					obj.description=data[0]['Description'];	
					res.send(JSON.stringify(obj));
				}
				else
				{
					res.send(JSON.stringify(obj));	
				}
			});
		}
		else
		{
			console.log("No segment found");
			res.send(JSON.stringify(obj));
		}
	});
}

exports.getAllSegmentUsage = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"TransactionSetID" : params.transactionSet,
	};
	segmentUsage.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}


//Get ElementUsageDefs Api /api/getElementUsageDefs

exports.getMandatoryElementStatus = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"SegmentID" : params.segmentId,
		"RequirementDesignator" : 'M'
	};
	elementUsageDefs.getOne(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getElementUsageDefs = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"SegmentID" : params.segmentId
	};
	elementUsageDefs.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getElementUsageDefsFromPosition = function(req,res){
	var params=req.body;
	var segmentPosition=params.segmentPosition;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"SegmentID" : params.segmentId,
		"Position" : params.position
	};

	console.log(query);
	elementUsageDefs.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		obj.segmentPosition=segmentPosition;
		res.send(JSON.stringify(obj));
	});
}

exports.getElementUsageDefsWithCode = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version, 
		"SegmentID" : params.segmentId
	};
	elementUsageDefs.getWithCode(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		numberOfElements=data.length;
		if(numberOfElements==0)
		{
			res.send(obj);
		}
		else
		{
			numberOfElementsRetrieved=0;
			getCodeWithElement(obj,res);
		}
	});	
}

//Get Code Api /api/getCode
exports.getAllCode = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version				
	};

	code.get(query,function(msg,data){
		// console.log(obj);
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}

exports.getCode = function(req,res){
	var params=req.body;
	var query={
		"Agency" : params.agency,
		"Version" : params.version,
		"ElementID" : params.element		
	};

	code.get(query,function(msg,data){
		var obj=JSON.parse(msg);
		obj.data=data;
		res.send(JSON.stringify(obj));
	});
}


function getCodeWithElement(obj,res){
	// console.log(numberOfElementsRetrieved+"/"+numberOfElements);
	if(numberOfElementsRetrieved<numberOfElements)
	{
		obj.data[numberOfElementsRetrieved]['Code']="";
		var params=obj.data[numberOfElementsRetrieved];
		var query={
			"Agency" : params['Agency'],
			"Version" : params['Version'],		
			"ElementID" : params['ElementID']
		};

		code.getOne(query,function(msg,data){
			obj.data[numberOfElementsRetrieved]['Code']=JSON.parse(msg)['status'];					
			//console.log(msg["message"]);
			// console.log(obj.data[numberOfElementsRetrieved]['Code']);
			// obj.data[numberOfElementsRetrieved]['code']=msg.status;
			numberOfElementsRetrieved++;
			getCodeWithElement(obj,res);
		});		
	}
	else
	{
		res.send(obj);
		// res.send(JSON.stringify(obj.data.Code));
	}
}

//Api for pdf generation

exports.getPdf = function(req,res){
	var params=req.body;
	var fs=require('fs');
	var filePath='';
	var x;	
	var transactionSet=params.transactionSet;
	var version=params.version;
	var transactionDescription=params.transactionDescription;
	var transactionFunctionalGroup=params.transactionFunctionalGroup;
	var headingText=params.headingText;	
	var footerText=params.footerText;
	footerText=footerText.split('$');
	var businessPartnerText=params.businessPartnerText;
	var numberOfHeadingSegments=params.numberOfHeadingSegments;
	var numberOfDetailSegments=params.numberOfDetailSegments;
	var numberOfSummarySegments=params.numberOfSummarySegments;
	var presentLoop='';
	console.log(typeof params.segmentUsage);
	console.log(params.segmentUsage);
	console.log(params.segmentUsage[0]);
	var segmentUsage=JSON.parse(params.segmentUsage);
	var numberOfElementsInSegment=JSON.parse(params.numberOfElementsInSegment);
	var elementUsageDefs=JSON.parse(params.elementUsageDefs);
	var segmentText=JSON.parse(params.segmentText);
	var elementCode=JSON.parse(params.code);
		
	var doc=new pdfkit({	size: 'a4',
        					layout: 'portrait',
        					margin : 50,
        					bufferPages: true
        				});
	var y,z,a;
	var tempElementCode=elementCode;

	var fileName=businessPartnerText+'_'+transactionSet+'_'+version+'.pdf';

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'attachment; filename='+fileName);
	

	filePath=__dirname+'/../EDIFiles/pdf/'+fileName;

	for(x in tempElementCode)
	{
		for(y in tempElementCode[x])
		{
			for(z in tempElementCode[x][y])
			{
				console.log(tempElementCode[x][y][z]);
			}
		}
	}

	for(y in segmentText)
	{
		segmentText[y]=segmentText[y].split('$');
	}

	fs.open(filePath,'w+',function(err,fd){

		if(!err)
		{
			doc.pipe(fs.createWriteStream(filePath));
			doc.pipe(res);
		//	doc.addPage();

//HEADING PART /////////////////////////////////////////////////////////////////////////////////////////////////////////////			
			
			//TransactionSet and Version
			doc.font('Helvetica-Bold');
			doc.fontSize(30);
			doc.text(transactionSet);			
			doc.fontSize(10);
			doc.fillColor('red');
			doc.text('VER.'+version);
			doc.font('Helvetica');

			//Heading line definition
			doc.lineWidth(2.5);
			doc.moveTo(120,50).lineTo(550,50).stroke();
			doc.lineWidth(2.5);
			doc.moveTo(120,80).lineTo(550,80).stroke();
			
			//Transaction Description
			doc.fillColor('black');
			doc.fontSize(20);
			doc.font('Helvetica-Bold');
			doc.text(transactionDescription,125,57,{lineBreak:false}).text(' - Functional Group='+transactionFunctionalGroup);

//END HEADING PART//////////////////////////////////////////////////////////////////////////////////////////////////
			
//SUMMARY OF SEGMENTS //////////////////////////////////////////////////////////////////////////////////////////////			
			
			//Heading text
			doc.fillColor('black');
			doc.font('Helvetica');
			doc.fontSize(10);
			doc.text(headingText,50,120,{lineBreak:true});

			if(numberOfHeadingSegments>0)
			{

				//Heading table heading
				doc.moveDown(2);
				doc.fontSize(15);
				doc.font('Helvetica-BoldOblique');
				doc.text('Heading',{underline:true});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS',{underline:true,indent:5});
				doc.moveUp(1);
				doc.text('ID',{underline:true,indent:45});
				doc.moveUp(1);
				doc.text('Segment Name',{underline:true,indent:85});
				doc.moveUp(1);
				doc.text('Req',{underline:true,indent:320});
				doc.moveUp(1);
				doc.text('Max Use',{underline:true,indent:355});
				doc.moveUp(1);
				doc.text('Repeat',{underline:true,indent:410});
				doc.moveUp(1);
				doc.text('Notes',{underline:true,indent:460});
				
				doc.fontSize(10);						
				doc.fillColor('#757575');

				for(x in segmentUsage)
				{
					if(segmentUsage[x]['Section']=='H')
					{					
						if(segmentUsage[x]['LoopID']!=''&&presentLoop!=segmentUsage[x]['LoopID'])
						{
							doc.rect(doc.x-3,doc.y+4,503,20).fillAndStroke('#0d47a1','#0d47a1');
							presentLoop=segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('LOOP ID - '+segmentUsage[x]['SegmentID'],{indent:5,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:45});
							doc.moveUp(1);
							doc.text(' ',{indent:85});
							doc.moveUp(1);
							doc.text(' ',{indent:333});
							doc.moveUp(1);
							doc.text(' ',{indent:368});
							doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'],{indent:423,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:473});
							doc.fillColor('#757575');	
						}
						
						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position']=='')?' ':segmentUsage[x]['Position'],{indent:5});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID']=='')?' ':segmentUsage[x]['SegmentID'],{indent:45});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription']=='')?' ':segmentUsage[x]['Description'],{indent:85});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator']=='')?' ':segmentUsage[x]['RequirementDesignator'],{indent:323});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage']=='')?' ':segmentUsage[x]['MaximumUsage'],{indent:358});
						doc.moveUp(1);
						doc.text(' ',{indent:413});
						doc.moveUp(1);
						doc.text(' ',{indent:463});
						//doc.moveDown(1);						
					}
				}
			}

			if(doc.y>600)
			{
				doc.addPage();
			}

			if(numberOfDetailSegments>0)
			{

				//Heading table heading
				doc.moveDown(3);
				doc.fontSize(15);
				doc.fillColor('black');
				doc.font('Helvetica-BoldOblique');
				doc.text('Detail',{underline:true});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS',{underline:true,indent:5});
				doc.moveUp(1);
				doc.text('ID',{underline:true,indent:45});
				doc.moveUp(1);
				doc.text('Segment Name',{underline:true,indent:85});
				doc.moveUp(1);
				doc.text('Req',{underline:true,indent:320});
				doc.moveUp(1);
				doc.text('Max Use',{underline:true,indent:355});
				doc.moveUp(1);
				doc.text('Repeat',{underline:true,indent:410});
				doc.moveUp(1);
				doc.text('Notes',{underline:true,indent:460});
				
				doc.fontSize(10);						
				doc.fillColor('#757575');

				for(x in segmentUsage)
				{
					if(segmentUsage[x]['Section']=='D')
					{										
						if(segmentUsage[x]['LoopID']!=''&&presentLoop!=segmentUsage[x]['LoopID'])
						{
							doc.rect(doc.x-3,doc.y+4,503,20).fillAndStroke('#0d47a1','#0d47a1');
							presentLoop=segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('LOOP ID - '+segmentUsage[x]['SegmentID'],{indent:5,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:45});
							doc.moveUp(1);
							doc.text(' ',{indent:85});
							doc.moveUp(1);
							doc.text(' ',{indent:333});
							doc.moveUp(1);
							doc.text(' ',{indent:368});
							doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'],{indent:423,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:473});
							doc.fillColor('#757575');	
						}
						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position']=='')?' ':segmentUsage[x]['Position'],{indent:5});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID']=='')?' ':segmentUsage[x]['SegmentID'],{indent:45});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription']=='')?' ':segmentUsage[x]['Description'],{indent:85});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator']=='')?' ':segmentUsage[x]['RequirementDesignator'],{indent:323});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage']=='')?' ':segmentUsage[x]['MaximumUsage'],{indent:358});
						doc.moveUp(1);
						doc.text(' ',{indent:413});
						doc.moveUp(1);
						doc.text(' ',{indent:463});
						//doc.moveDown(1);						
					}
				}				
			}

			if(doc.y>600)
			{
				doc.addPage();
			}

			if(numberOfSummarySegments>0)
			{

				//Heading table heading
				doc.moveDown(3);
				doc.fontSize(15);
				doc.fillColor('black');
				doc.font('Helvetica-BoldOblique');
				doc.text('Summary',{underline:true});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS',{underline:true,indent:5});
				doc.moveUp(1);
				doc.text('ID',{underline:true,indent:45});
				doc.moveUp(1);
				doc.text('Segment Name',{underline:true,indent:85});
				doc.moveUp(1);
				doc.text('Req',{underline:true,indent:320});
				doc.moveUp(1);
				doc.text('Max Use',{underline:true,indent:355});
				doc.moveUp(1);
				doc.text('Repeat',{underline:true,indent:410});
				doc.moveUp(1);
				doc.text('Notes',{underline:true,indent:460});
				
				doc.fontSize(10);						
				doc.fillColor('#757575');

				for(x in segmentUsage)
				{
					if(segmentUsage[x]['Section']=='S')
					{										
						if(segmentUsage[x]['LoopID']!=''&&presentLoop!=segmentUsage[x]['LoopID'])
						{
							doc.rect(doc.x-3,doc.y+4,503,20).fillAndStroke('#0d47a1','#0d47a1');
							presentLoop=segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('LOOP ID - '+segmentUsage[x]['SegmentID'],{indent:5,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:45});
							doc.moveUp(1);
							doc.text(' ',{indent:85});
							doc.moveUp(1);
							doc.text(' ',{indent:333});
							doc.moveUp(1);
							doc.text(' ',{indent:348});
							doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'],{indent:423,underline:true});
							doc.moveUp(1);
							doc.text(' ',{indent:473});
							doc.fillColor('#757575');	
						}
						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position']=='')?' ':segmentUsage[x]['Position'],{indent:5});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID']=='')?' ':segmentUsage[x]['SegmentID'],{indent:45});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription']=='')?' ':segmentUsage[x]['Description'],{indent:85});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator']=='')?' ':segmentUsage[x]['RequirementDesignator'],{indent:323});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage']=='')?' ':segmentUsage[x]['MaximumUsage'],{indent:358});
						doc.moveUp(1);
						doc.text(' ',{indent:413});
						doc.moveUp(1);
						doc.text(' ',{indent:463});
						//doc.moveDown(1);						
					}
				}				
			}

// END OF SUMMARY OF SEGMENTS //////////////////////////////////////////////////////////////////////////////////////////////////////

// Footer Part ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if(doc.y>750&&footerText.length>1)
			{
				doc.addPage();
			}

			for(x in footerText)
			{
				if(x%2!=0)
				{
					doc.moveDown(2);
					doc.font('Helvetica-Bold');
					doc.text(footerText[x],{lineBreak:true,underline:true});
				}
				else
				{
					doc.font('Helvetica');
					doc.text(footerText[x],{lineBreak:true});
				}
			}

			//Heading text
			//doc.fillColor('black');
			
//End of footer part////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Element Summary With Segments ///////////////////////////////////////////////////////////////////////////////////////////////////
			doc.moveDown(1);
			for(x in segmentUsage)
			{
				//Title
				doc.addPage();
				doc.fillColor('black');
				doc.font('Helvetica-Bold');
				doc.fontSize(35);
				doc.text(segmentUsage[x]['SegmentID'],{lineBreak:false});
				
				//Line Graphics of each page
				doc.lineWidth(1);
				var g=doc.x+10;			
				doc.moveTo(doc.x+10,doc.y-5).lineTo(550,doc.y-5).stroke('#0d47a1');
				doc.rect(400,doc.y-5,150,40).stroke();

				doc.fontSize(12);
				doc.text("    "+segmentUsage[x]['Description'],{columns:1,width:300});
				doc.moveUp(1);

				//Side Summary Box
				doc.font('Courier');
				doc.fontSize(10);				
				doc.text('POS: '+segmentUsage[x]['Position'],405,doc.y);
				doc.moveUp(1);
				doc.text('Max: '+segmentUsage[x]['MaximumUsage'],{align:'right'});
				doc.text(((segmentUsage[x]['Section']=='H')?'Heading':'')+((segmentUsage[x]['Section']=='D')?'Detail':'')+((segmentUsage[x]['Section']=='S')?'Summary':'')+" - "+((segmentUsage['RequirementDesignator']=='M')?'Mandatory':'Optional'),425,doc.y);
				doc.text('Loop: '+((segmentUsage[x]['LoopID']=="")?'N/A':segmentUsage[x]['LoopID']),405,doc.y);
				doc.moveUp(1);
				doc.text('Elements: '+numberOfElementsInSegment[segmentUsage[x]['Position']],{align:'right'});			
				
				//Table Heading
				doc.font('Helvetica-BoldOblique');
				doc.fontSize(15);
				doc.text('Element Summary',55,120,{underline:true});
				
				//Table Body
				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('Ref',{underline:true,indent:5});
				doc.moveUp(1);
				doc.text('ID',{underline:true,indent:43});
				doc.moveUp(1);
				doc.text('Segment Name',{underline:true,indent:75});
				doc.moveUp(1);
				doc.text('Req',{underline:true,indent:320});
				doc.moveUp(1);
				doc.text('Type',{underline:true,indent:355});
				doc.moveUp(1);
				doc.text('Min/Max',{underline:true,indent:410});
				doc.moveUp(1);
				doc.text('Notes',{underline:true,indent:460});

				for(y in elementUsageDefs[segmentUsage[x]['Position']])
				{
					doc.fillColor('#757575');															
					doc.moveDown(1);
					doc.font('Helvetica');
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['SegmentID']+elementUsageDefs[segmentUsage[x]['Position']][y]['Position'],{indent:5});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['ElementID'],{indent:43});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['Description'],{indent:75});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['RequirementDesignator'],{indent:323});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['Type'],{indent:358});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['MinimumLength']+'/'+elementUsageDefs[segmentUsage[x]['Position']][y]['MaximumLength'],{indent:413});
					doc.moveUp(1);
					doc.text(' ',{indent:463});

					if(elementCode[segmentUsage[x]['Position']]!=undefined&&elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']]!=undefined)
					{
						doc.moveDown(2);
						doc.font('Helvetica-Bold');
						doc.moveUp(1);
						doc.text('Code',{underline:true,indent:90});
						doc.moveUp(1);
						doc.text('Name',{underline:true,indent:140});
						doc.font('Helvetica');

						for(a in elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']])
						{	
							doc.text(elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']][a]['value'],{indent:90,lineGap:2});
							doc.moveUp(1);
							doc.text(elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']][a]['description'],{indent:140,lineGap:2});
						//	doc.moveDown(1);							
						}
					}

				//	doc.moveDown(1);										
				}

				//Segment ElementSummary Footer

				for(z in segmentText[segmentUsage[x]['Position']])
				{
					if(z%2!=0)
					{
						doc.moveDown(2);
						doc.font('Helvetica-Bold');
						doc.text(segmentText[segmentUsage[x]['Position']][z],{lineBreak:true,underline:true});
					}
					else
					{
						doc.font('Helvetica');
						doc.text(segmentText[segmentUsage[x]['Position']][z],{lineBreak:true});
					}
				}
			}			

//End element summary with segments ///////////////////////////////////////////////////////////////////////////////////////////////
	
			// Add header and footer data

			

			var range = doc.bufferedPageRange();
			var i;
			for(i=range.start;i<(range.start+range.count);i++)
			{
			  doc.switchToPage(i);
			  //doc.font('Helvetica-Bold');
			  doc.fontSize(12);
			  doc.text(businessPartnerText,10,10);
			}

			// # finalize the PDF and end the stream
			doc.end()			
		}
		else
		{
			console.log(err);
			res.send('Error');
		}
		
	});
}
