/************************
百度地图操作
	1.实时监控
	2.位置定义
	......
**************************/
function rightTopMap(){}


//保留选中的人员
var personOldMap = new Map();

// 人员标记点集合
var personPointsMap = new Map();

//保留选中的车辆
var carOldMap = new Map();

/******************
实时监控
*******************/

//选择人员后打点
rightTopMap.drawPoint = function(personinfo,personid){
	//获取人员的信息
	var params = "personsId="+personid+"&"+Math.random();    //URL参数
	$.ajax({   
           url: 'getPersonInfoAjaxMapBar.do',   //接收页面   
           type: 'get',      //POST方式发送数据   
           async: true,      //ajax同步   
           data: params,   
           success: function(msg) {
				result = trim(msg);
				if(result!=""){
					_drawPoint(personinfo,result);
				}else{
					alert("无经纬度信息-人员！");
				}
           }   
    });
};

//选择车辆后打点
rightTopMap.drawCarPoint = function(carInfo,carid){
	
	//获取车辆的信息
	var params = "carsId="+carid+"&"+Math.random();    //URL参数  
	$.ajax({   
           url: 'getCarInfoAjaxMapBar.do',   //接收页面  
           type: 'get',      //POST方式发送数据   
           async: true,      //ajax同步   
           data: params,   
           success: function(msg) {
				result = trim(msg);
				if(result!=""){
					_drawCarPoint(carInfo,result);
				}else{
					alert("无经纬度信息-车辆！");
				}
           }   
    });
};

/**
 打点
 @personinfo 自定义信息窗口显示的内容,默认”1,2,3,4,5,6,7,8“
 @personStr  打点的人员信息，多个人员之间用”|“隔开
*/
_drawPoint = function(personinfo,personStr){
	var personArr = personStr.split("|");
	for(var i = 0; i < personArr.length; i ++){
		var person = personArr[i];
		person = person.substring(1,person.length-1);
		var personInfoArr = person.split(";");
		var personId = personInfoArr[0];//人员编号
		var longitude = personInfoArr[1];//经度(真实)
		var latitude = personInfoArr[2];//纬度(真实)
		var collectionTime = personInfoArr[3];//定位时间
		var image_url = personInfoArr[4];//人员头像
		var departmentAllName = personInfoArr[5];//所在部门全称
		var gridName = personInfoArr[6];//所属网格
		var personName = personInfoArr[7];//人员姓名
		var sex = personInfoArr[8];//性别
		var post = personInfoArr[9];//职位
		var id_no = personInfoArr[10];//身份证号码
		var contactNumber = personInfoArr[11];//联系电话
		var simId = personInfoArr[12];//通讯终端号
		var imei = personInfoArr[13];//IMEI
		var remark = personInfoArr[14];//
		var mobilePhoneType = personInfoArr[15];//终端类型
		var rolePicPath = getRootPath()+"/images/person.png";//岗位图标
		if(personInfoArr[16] && personInfoArr[16] != null && personInfoArr[16] != "" && personInfoArr[16] != "null"){
			rolePicPath = personInfoArr[16]; 
		}
		
		var latlon = personInfoArr[17];//
		var baidu_latlon = personInfoArr[18];//百度经纬度
		
	   	//信息框显示内容
	   	var name = "";
	   	name = personBean.showContent(image_url, personName, sex, departmentAllName, post, simId, imei, contactNumber, id_no, gridName);
		var infoWindowContent = name;
		var _marker = MAP_TOOLS.newMarker({
			map: mapObj,
			point:{longitude:personInfoArr[18].split(",")[0],latitude:personInfoArr[18].split(",")[1]},
			icon: {
				path:rolePicPath, 
				size:{width:32, height:32}, 
				anchor:{x:10,y:10},
				imageSize:{width:32, height:32}
			},
			infoWindow:{
				open: false,
				content:infoWindowContent,
				opts:{
					width : 300,     // 信息窗口宽度
					height: 280,     // 信息窗口高度
					enableMessage:false//设置允许信息窗发送短息
				}
			},
			label: {content:personName+" | "+simId,offset: {x:20, y:0},style:{border:0}}
		});
		rightTopMap.removePoint(personId);
		
		personOldMap.put(personId,personId);
		
		var isView = true;
//		if(personInfoArr[18].split(",")[0]*1<1||personInfoArr[18].split(",")[1]*1<1){
//			isView = false;
//		}
		
		if(isView){
			personPointsMap.put(personId, {longitude:personInfoArr[18].split(",")[0],latitude:personInfoArr[18].split(",")[1]});
		}
		
		var obj = MAP_TOOLS.getZoom({map: mapObj});
		if(obj.zoom == 19){
			MAP_TOOLS.setZoom({map: mapObj, zoom: 18});
		}
		MAP_TOOLS.addOverlay({
			map: mapObj,
			id: "person_"+personId,
			overlay: _marker
		});
	}
	
	var personPoints = new Array();
	for(var k=0; k<personPointsMap.size(); k++){
		personPoints.push(personPointsMap.element(k).value);
	}
	
	MAP_TOOLS.autoCenterAndZoom({map:mapObj, points: personPoints});
};


/**
 车辆打点
 @carinfo 自定义信息窗口显示的内容,默认”0,1,2,3,4,5,6,7,8“
 @carStr  打点的人员信息，多个人员之间用”|“隔开
*/
_drawCarPoint = function(carinfo,carStr){
	
	var carArr = carStr.split("|");
	for(i=0;i<carArr.length;i++){
		var carId; 
		var vehicle = carArr[i];
		vehicle = vehicle.substring(1,vehicle.length-1);
		var carInfoArr = vehicle.split(",");
		carId  = carInfoArr[0];
		carOldMap.put(carId,carId);
		var carNo  = carInfoArr[1];
		var simId  = carInfoArr[2];
		var speed  = carInfoArr[3];
		var orientation = carInfoArr[4];
		var getType = "";
		if(carInfoArr[5]!=null)
		{
			if(carInfoArr[5]=='0')
				getType="GPS";
			else if(carInfoArr[5]=='1')
				getType="LBS";	
		}
		var collectionTime = carInfoArr[6];
		var mileage = carInfoArr[7];
		var longitude = carInfoArr[8];
		var latitude = carInfoArr[9];
		var latlon = carInfoArr[10]+","+carInfoArr[11];
		var carType = carInfoArr[12];
		var accflag = carInfoArr[13];
		var terminalStatus = carInfoArr[14];
		
		var img =""; 
		if(orientation!=undefined&&orientation>=0){
			//判断车辆方向
			var carOrientation = monitor.getorientation(orientation,carType);	
			//跟根据方向和状态得到图片
			img = monitor.getpic(carOrientation,status,carType,terminalStatus);
		}else
		{
			if(carType!= '' && carType!= null && carType  == VEHICLE.CARTYPE.TYPE2)
			{
				img =  getRootPath()+"/js/common/gis/img/truck_normal_east.gif";			
			}
			else if(carType!= '' && carType!= null && carType  == VEHICLE.CARTYPE.TYPE3)
			{
				img =  getRootPath()+"/js/common/gis/img/struck_normal_east.png";
			}
			else if(carType!= '' && carType!= null && carType  == VEHICLE.CARTYPE.TYPE7)
			{
				img =  getRootPath()+"/js/common/gis/img/car_normal_east.png";
			}
			else if(carType!= '' && carType!= null && carType  == VEHICLE.CARTYPE.TYPE5)
			{
				img =  getRootPath()+"/js/common/gis/img/bus_normal_east.png";
			}
			else
			{
	    		img = getRootPath()+"/js/common/gis/img/car_1.gif";
			}
		}	
		
		
		
		//var infoWindowName ="<span style='color:red;' onclick=javascript:Utils.deletePoint('"+mMarker+"');>车辆详细信息</span>";
	   	var name = vehicleBean.showContent(carinfo,carNo,speed,orientation,getType,collectionTime,mileage);	
		
		//信息框显示内容
		var infoWindowContent ="<a href=\"javascript:monitor.vehicleDetail('"+carId+"');\">详细资料</a>"
			+"<br><br>"
			+"<span>"+name+
			"</span>";
		
		var label = "车牌号:<font color=red>" + carNo+"</font>;"
		label += "速度:<font color=red>" + speed+"(km/h)"+"</font>";
		
		
		var _marker = MAP_TOOLS.newMarker({
//			map:mapObj,
			point:{longitude:carInfoArr[10],latitude:carInfoArr[11]},
			icon: {
				path:img, 
				size:{width:32, height:32}, 
				anchor:{x:10,y:10},
				imageSize:{width:32, height:32}
			},
			infoWindow:{
				open: false,
				content:infoWindowContent,
				opts:{
					width : 300,     // 信息窗口宽度
					height: 200,     // 信息窗口高度
					enableMessage:false//设置允许信息窗发送短息
				}
			},
			label: {content:label,offset: {x:20, y:0}}
		});
		rightTopMap.removeCarPoint(carId);
		carOldMap.put(carId,carId);
		MAP_TOOLS.addOverlay({
			map:mapObj,
			id: "car_"+carId,
			overalyMap: false,
			overlay: _marker
		});
	}
};



/**
去掉人员打点
*/
rightTopMap.removePoint = function(personid){
	personPointsMap.remove(personid);
	personOldMap.remove(personid);
	MAP_TOOLS.removeOverlayById({
		map:mapObj,
		id:"person_"+personid
	});
};

/**
去掉车辆打点
*/
rightTopMap.removeCarPoint = function(carid){
	carOldMap.remove(carid);
	MAP_TOOLS.removeOverlayById({
		map:mapObj,
		id:"car_"+carid
	});
};

/**
*获取保留人员Map
*/
rightTopMap.getPersonOldMap = function(){
	return personOldMap;
};

/**
*获取保留车辆Map
*/
rightTopMap.getCarOldMap = function(){
	return carOldMap;
};


/**
监控控制
*/
rightTopMap.monitorCtrl = function(obj){
	//0表示开始监控，1表示停止监控
 	var monitorFlag = obj.monitorFlag;
 	if(monitorFlag == 'undefined' || monitorFlag == undefined){
 		monitorFlag="0";
 	}
 	
 	if(monitorFlag=="0"){
 		_startMonitor(obj);
 	}else{
 		_stopMonitor(obj);
 	}
};

/**
开始监控
*/
_startMonitor = function(obj){
	 //车辆显示信息----0：车牌号；1:速度; 2:方向; 3:定位方式; 4:定位时间; 5:行驶里程(公里);
	 carInfo = parent.abilityLeftFrame.window.document.getElementById("carInfo").value;
	 var carsId = "";
	//被选中的人员checkbox
	var personsId = parent.abilityLeftFrame.treeIframe.window.getPersonCheckBox();
	//被选中的车辆checkbox
	var carsId = parent.abilityLeftFrame.treeIframe.window.getCarCheckBox();
	
	//0表示开始监控，1表示停止监控
 	var monitorFlag = obj.monitorFlag;
 	//公司类型
	var corptype;
	var params = "ajax=true&"+Math.random();    //URL参数  
	$.ajax({   
			url: 'corptypeCheck.do',   //接收页面   
			type: 'get',      //POST方式发送数据   
			async: false,      //ajax同步   
			data: params,   
			success: function(msg) 
			{   
				corptype=msg;
			}   
	}); 
 	if(parent.abilityLeftFrame.treeIframe.document.readyState!="complete"){
		alert("页面正在加载");
 	}else{
 		if(personsId.length==0&&carsId.length==0)
	 	{
	 		if(corptype=="0")
	 		{
	 			alert("请选择需要监控人员");
	 		}
	 		else if(corptype=="1")
	 		{
	 			alert("请选择需要监控车辆");
	 		}
	 		else if(corptype=="2")
	 		{
	 			alert("请选择需要监控车辆或人员");
	 		}
	 	}else{
	 		//是否可以进行监控
	 		obj.value = "停止监控";
			var isMonitor=true;
			if(personsId.length>0){
				rightTopMap.drawPoint("1,2,3,4,5,6,7,8",personsId);
			}
			if(carsId.length>0){
				rightTopMap.drawCarPoint("1,2,3,4,5,6,7,8",carsId);
			}
			if(isMonitor)
 			{ 
 				obj.monitorFlag	= "1";
 				//监控表格
 				var url = 'startmonitorWait.do?carsId='+carsId+"&carInfo="+carInfo+"&personsId="+personsId
 						+"&monitorFlag="+monitorFlag+"&"+Math.random();;
 				parent.abilityRightFrame.rows="300,10,80";
 				window.open(url,'abilityRightBottomFrame');	
 			}
	 	}
 	}
};

//停止监控
_stopMonitor = function(obj){
	obj.value = "开始监控";
	obj.monitorFlag	= "0";
	//如果监控窗口未产生，则“停止监控”时也不需要停止监听
	if(parent.abilityRightBottomFrame.window.roadInfoTimeOut!=undefined&&parent.abilityRightBottomFrame.window.refreshMapTimeOut!=undefined&&
	parent.abilityRightBottomFrame.window.refreshSelfTimeOut!=undefined)
 		parent.abilityRightBottomFrame.window.clearTimeOut();
};

//弹出层客户详情
rightTopMap.wcDetail = function(personId,x,y){
	openArtDialog("fieldworkclientList.do?personid="+personId+"&longitude="+x+"&latitude="+y+"&wc=1",'客户资料',true,900,480);
}

//弹出层任务派发
rightTopMap.mission = function(personId,customerid){
	openArtDialog("taskAdd.do?personid="+personId+"&customerid="+customerid,'任务派发',true,900,480);
}

//弹出层添加公告
rightTopMap.addNotice = function(personId){
	openArtDialog("noticeAdd.do?PERSONID="+personId,'添加公告',true,900,480);
}


/******************
定制地图
*******************/
//自定义点画点
rightTopMap.selfDefineDrawPoint = function(lon,lat,imgSrc,msg){
	//MAP_TOOLS.removeOverlayById({map:mapObj,id:"selfdisplay_"+lon+"_"+lat});
	//先查找地图上是否已经打点，如果打点，设置中心显示该点
	var _marker = null;
	_marker = MAP_TOOLS.getOverlay({map:mapObj,id:"selfdisplay_"+lon+"_"+lat});
	if(_marker!=null){
		MAP_TOOLS.setCenter({map:mapObj,point:{longitude:lon, latitude:lat}});
	}else{
		_marker = MAP_TOOLS.newMarker({
//			map:mapObj,
			point:{
			    longitude:lon,
			    latitude:lat
			},
			infoWindow:{
	    		open: false, 
	    		content: msg
	    	},
			label: {content:msg,offset: {x:20, y:0}},
			icon: {path:imgSrc, size:{width:32, height:32}, anchor:{x:10,y:30}, imageSize:{width:32, height:32}}
			});
		selfDisplayOverlay =  _marker;
		MAP_TOOLS.addOverlay({
			map:mapObj,
			id: "selfdisplay_"+lon+"_"+lat,
			overalyMap: false,
			overlay: _marker
		});
		MAP_TOOLS.setCenter({map:mapObj,point:{longitude:lon,latitude:lat}});
	}
};

//自定义线画线
rightTopMap.selfDefineDrawLine = function(id,points,color,stroke,transparency){
	//先查找地图上是否已经画线，如果画线，设置中心显示该线
	var _polyLine = null;
	var pointsArry = new Array();
	_polyLine = MAP_TOOLS.getOverlay({map: mapObj,id:"selfdefineline_"+id});
	
	if(_polyLine!=null){
		pointsArry = _polyLine.getPath();
		var tempArry = new Array();
		for(var i=0;i<pointsArry.length;i++){
			var points = pointsArry[i];
			tempArry.push({longitude: points.lng, latitude: points.lat});
		}
		
		MAP_TOOLS.autoCenterAndZoom({map: mapObj, points: tempArry});
		
	}else{
		MAP_TOOLS.removeOverlayById({map:mapObj,id:"selfdefineline_1"});
		var line_points = new Array();
		var lineArry = points.split(";");
		for(var i=0;i<lineArry.length;i++){
			line_points.push({longitude:lineArry[i].split(",")[0],latitude:lineArry[i].split(",")[1]});
		}
		var line_color = $(parent.positionDefinedLeftFrame.document).find("input[name='roadColor']").val();//颜色
		var line_weight = $(parent.positionDefinedLeftFrame.document).find("select[name='stroke']").val();//粗细
		var line_transparency = $(parent.positionDefinedLeftFrame.document).find("select[name='transparency']").val();//透明度
		_polyLine = MAP_TOOLS.newPolyline({
			map: mapObj,
 			points: line_points,
 			options:{
 				strokeColor:line_color,    	//折线颜色
		        strokeWeight: line_weight,       	//折线的宽度，以像素为单位。
		        strokeOpacity: line_transparency,	   	//折线的透明度，取值范围0 - 1。
		        strokeStyle: 'solid'	//折线的样式，solid或dashed。
 			}
		});
		MAP_TOOLS.addOverlay({
		    map: mapObj,
		 	id: "selfdefineline_1",
		 	overalyMap: true,
			overlay: _polyLine
		});
		
		MAP_TOOLS.autoCenterAndZoom({map: mapObj, points: line_points});
	}
};

//移动地图
rightTopMap.move = function(){
	MAP_TOOLS.drawingManager.close({map: mapObj});
	MAP_TOOLS.distanceTool.close({map: mapObj});
};

//地图测距
rightTopMap.measure = function(){
	MAP_TOOLS.distanceTool.open({map : mapObj});
};

//地图框选
rightTopMap.addRegion = function(){
	MAP_TOOLS.drawingManager.init({map: mapObj,	overlaycomplete: function(result) {}});
	
	MAP_TOOLS.drawingManager.setDrawingMode({map: mapObj, mode: MAP.CONSTANT.DRAWINGTYPE.DRAWING_RECTANGLE, overlaycomplete: callbackAddRegion});
};

var backOverlay = null;

// 地图框选回调
callbackAddRegion = function(result){
	if(backOverlay != null){
		MAP_TOOLS.removeOverlay({map: mapObj, overlay:backOverlay});
	}
	
	var backOverlayPoints = result.points;
	backOverlay = result.overlay;
	
	var leftTop = backOverlayPoints[0].longitude+","+backOverlayPoints[0].latitude;
	var rightBottom = backOverlayPoints[2].longitude+","+backOverlayPoints[2].latitude;
	
	var regionVehicle = getRegionVehicle(backOverlayPoints[0].longitude,backOverlayPoints[0].latitude,backOverlayPoints[2].longitude,backOverlayPoints[2].latitude,leftTop,rightBottom);
	openUpdatePwdDiv(regionVehicle);
	
	rightTopMap.move();
	MAP_TOOLS.removeOverlay({map: mapObj, overlay:backOverlay});
}

/******************************************************
人员告警
******************************************************/
//画多边形区域
rightTopMap.drawArea = function(points){
	var pointsArry = new Array();
	var tempArry = points.split(";");
	for(var i=0;i<tempArry.length;i++){
		pointsArry.push({longitude:tempArry[i].split(",")[0],latitude:tempArry[i].split(",")[1]});
	}
	
	var ploygon = MAP_TOOLS.newPolygon({
		points:pointsArry,
		options:{
 				strokeColor:"red",    	//折线颜色
		        strokeWeight: 3,       	//折线的宽度，以像素为单位。
		        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
		        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
		        fillColor:"green",      	//填充颜色。当参数为空时，圆形将没有填充效果。
		        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
 		}
	});
	
	MAP_TOOLS.addOverlay({
			map: mapObj,
			id: "ploygon_1",
			overalyMap: false,
			overlay: ploygon
	});
	MAP_TOOLS.autoCenterAndZoom({map:mapObj, points: pointsArry});
};

//画矩形区域
rightTopMap.drawRect = function(points){
	var tempArry = points.split(";");
	var pointsArr = new Array();
	if(tempArry.length==2){
		var lonlat1 = tempArry[0];
		var lon1 = lonlat1.split(",")[0];
		var lat1 = lonlat1.split(",")[1];		
		var lonlat2 = tempArry[1];	
		var lon2 = lonlat2.split(",")[0];
		var lat2 = lonlat2.split(",")[1];
		
		pointsArr.push({longitude: lon1, latitude: lat1});
		pointsArr.push({longitude: lon2, latitude: lat1});
		pointsArr.push({longitude: lon2, latitude: lat2});
		pointsArr.push({longitude: lon1, latitude: lat2});
	}
	
	var _rectangle = MAP_TOOLS.newRectangle({
		map: mapObj,
		points:pointsArr,
		options:{
 				strokeColor:"red",    	//折线颜色
		        strokeWeight: 3,       	//折线的宽度，以像素为单位。
		        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
		        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
		        fillColor:"green",      	//填充颜色。当参数为空时，圆形将没有填充效果。
		        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
 		}
	});
	MAP_TOOLS.addOverlay({
			map: mapObj,
			id: "rectangle_1",
			overalyMap: false,
			overlay: _rectangle
	});
	MAP_TOOLS.autoCenterAndZoom({map:mapObj, points: pointsArr});
	
};

/**
画人员
* @param {Object} params
	params = {
		longitude:118.23245,
		latitude:29.28938,
		icon:/images/person.png
	}
*/
rightTopMap.drawPerson = function(params){
	var icon = "";
	if(params.icon!=null){
		icon = params.icon;
		icon = getRootPath()+icon;
	}
	
	var _marker = MAP_TOOLS.newMarker({
		point:{longitude:params.longitude,latitude:params.latitude},
		icon: {path:icon, size:{width:32, height:32}, anchor:{x:10,y:30}, imageSize:{width:32, height:32}}
	});
	MAP_TOOLS.addOverlay({
		map: mapObj,
		id: "alertperson_1",
		overalyMap: false,
		overlay: _marker
	});
};

rightTopMap.getPersonHead = function(mobile){
	var img_url = "";
	alert("aa");
	var params = "mobile="+mobile+"&"+Math.random();    //URL参数  
	$.ajax({   
		url: 'getPersonHeadAjax.do',   //接收页面  
	    type: 'get',      //POST方式发送数据   
	    async: true,      //ajax同步   
	    data: params,   
	    success: function(msg) {
	    	result = trim(msg);
			if(result!=""){
				var obj = eval('(' + result + ')');
				img_url = obj.image_url;
			}
	    }   
	});
	
	return img_url;
}
