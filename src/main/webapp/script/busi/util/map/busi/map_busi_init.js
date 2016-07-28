var mapObj;
$(function(){
	
		var hasCenterPoint = false;
		
		if(center_lon != null && center_lon != ""
			&& center_lat != null && center_lat != ""){
			hasCenterPoint = true;
		}
	
		center_lon = (center_lon==null||center_lon=="") ? 116.307852:center_lon;
		center_lat = (center_lat==null||center_lat=="") ? 40.057031:center_lat;
		
		mapObj = MAP_TOOLS.initMap({
		   				domId: "map_div",												//地图div元素
		   				center:{longitude: center_lon, latitude:center_lat},				//地图中心点
		   				zoom: map_zoomLevel,															//地图级数
		   				control:{														//控件
		   					navigation: true, 											//平移缩放控件（默认显示）
		  					scale: true, 												//比例尺控件（默认显示）
		  					overviewMap: true,											//缩略地图控件（默认显示）
		  					mapType: false												//地图类型控件（默认不显示）
		  				}, 
		  				scrollWheelZoom:true											//滚轮放大缩小（默认启用）
		  			});
		
		setTimeout(function(){
			if(hasCenterPoint){
				MAP_TOOLS.setCenter({map:mapObj, point:{longitude: center_lon, latitude: center_lat}});
			}
			else{
				MAP_TOOLS.setCenter({map:mapObj, cityName: defaultCapital});
			}
	    },1000);
		
	    setTimeout(function(){
	    	//1.位置定义点
	    	markPoints(positionDefineStr);
	    	//2.位置定义线
			markLines(positionDefineLineStr);
	    },10);
		
		if(personId!="")
		{
			setTimeout(function(){baiduMap.drawPoint('1,2,3,4,5,6,7,8',personId);},1010);
		}
		
		MAP_TOOLS.drawingManager.init({map: mapObj, overlaycomplete: function(result){}});
		//初始化客户图标
		//initCustomerPoint();
});

//标注位置定义点
function markPoints(positionDefineStr){
	if(positionDefineStr!='')
	{	
		var markers = new Array();
		var positionDefineArr = positionDefineStr.split("|");
		for(var i=0;i<positionDefineArr.length;i++)
		{
		    var tempLength = positionDefineArr[i].length;
			var temp = positionDefineArr[i].substring(1,tempLength-1);
			var tempArr = temp.split(",");
			var infoContent = 
			"<div style='padding: 5px; width: 280px; height: 199px; overflow: auto; position: relative; word-break: break-all;'>"+
			"   位置点名称："+tempArr[3]+",经度："+tempArr[5]+",纬度："+tempArr[6]+
			"</div>";
			
			//图标
			var iconId = tempArr[4];
			var iconPath = tempArr[7];
			var icon = "";
			if(iconId != "0"){
				icon = getRootPath()+"/page/ability/positiondefined/showPic.jsp?id="+iconId;
			}else{
				icon = getRootPath()+iconPath;
			}
		    var _marker = MAP_TOOLS.newMarker({
		    	map: mapObj,
		    	point:{
		    		longitude:tempArr[5],
		    		latitude:tempArr[6]
		    	},
		    	infoWindow:{
		    		open: false, 
		    		content:infoContent,
		    		opts:{
					  width : 300,     // 信息窗口宽度
					  height: 60,     // 信息窗口高度
					  title : tempArr[3] , // 信息窗口标题
					  enableMessage: false//设置允许信息窗发送短息
					}
		    	},
		    	label: {content:tempArr[3],offset: {x:20, y:0}},
		    	icon: {path:icon, size:{width:32, height:32}, anchor:{x:10,y:0}, imageSize:{width:32, height:32}}
		    });
		    
		    markers.push(_marker);
		    if(markers.length==100){
	    		MAP_TOOLS.newMarkerClusterer({
					map: mapObj,
					options:{
						markers: markers,
						maxZoom: 19,
						minClusterSize: 5,
						isAverangeCenter: true
						}	
					});
		    	markers = new Array();
		    	
		    }
		}
		if(markers.length>0){
			MAP_TOOLS.newMarkerClusterer({
				map: mapObj,
				options:{
					markers: markers,
					maxZoom: 19,
					minClusterSize: 5,
					isAverangeCenter: true
					}	
			});
			
		}
//		MAP_TOOLS.autoCenterAndZoom({map:mapObj});
	}
}

//标注位置定义线
function markLines(positionDefineLineStr){
	if(positionDefineLineStr!='')
	{	
		var positionDefineLineArr = positionDefineLineStr.split("|");
		for(var i=0;i<positionDefineLineArr.length;i++)
		{	
			var tempLength = positionDefineLineArr[i].length;
			var temp = positionDefineLineArr[i].substring(1,tempLength-1);
			var tempArr = temp.split("-");
		    var points = tempArr[2];
		    var color = tempArr[3];
		    var transparency = tempArr[5];
	      	var stroke = tempArr[6];
		    var line_points = new Array();
		    var pointsArry = points.split(";");
		    for(var j=0;j<pointsArry.length;j++){
				line_points.push({longitude: pointsArry[j].split(",")[0], latitude: pointsArry[j].split(",")[1]});
			}
			var _line = MAP_TOOLS.newPolyline({
			map: mapObj,
			points: line_points,
			options:{
				strokeColor:"#"+color,
				strokeWeight:stroke,       		//折线的宽度，以像素为单位。
		        strokeOpacity:transparency	   	//折线的透明度，取值范围0 - 1。
			}
			});
			MAP_TOOLS.addOverlay({
	 			map: mapObj,
	 			id: "selfdefineline_"+tempArr[0],
		 		overlay: _line,
		 		overalyMap: false
	 		});
			
//			MAP_TOOLS.autoCenterAndZoom({map:mapObj});
		}
	}
}

//初始化加载客户图标
function initCustomerPoint(){
	
	$.ajax({   
       	url: 'getCustomerPositionAjaxMapBar.do',   //接收页面   
       	type: 'get',      //POST方式发送数据   
       	async: false,      //ajax同步   
       	//data: ,   
       	success: function(msg) { 
       		
       		if(msg.length > 0 ){
       			var markers = new Array();
       			var arry = msg.split("|");
    			for(var i=0;i<arry.length;i++){
    				var cus = arry[i].split(",");
    				var  _content = "<div style='width:100%;'><div style=\"color: #000;height: 20px;width: 100%;line-height: 20px;font-weight: bold;background: #f5f5f5;text-indent: 1em;margin: 5px 0;\"><div style=\"float:left;\">"+cus[6]+"</div><div  style=\"float: right;display: block;background: #00adf1;color: #fff;width: 70px;height: 20px;text-align: center;text-indent: 0;\"></div></div>";
    				_content += "<div  style='color: #000;height: 20px;width: 100%;line-height: 20px;background: #f5f5f5;text-indent: 1em;margin-top: 1px;overflow: hidden; text-overflow: ellipsis; '>联系地址:"+cus[5]+"</div><div style=\"color: #000;height: 20px;width: 100%;line-height: 20px;background: #f5f5f5;text-indent: 1em;margin-top: 1px;\">联系人:"+cus[1]+"</div><div style=\"color: #000;height: 20px;width: 100%;line-height: 20px;background: #f5f5f5;text-indent: 1em;margin-top: 1px;\">联系电话:"+cus[4]+"</div>";
    				_content += "</div>";
    				var marker = MAP_TOOLS.newMarker({
	    					map: mapObj,
	    					point: {longitude: cus[2], latitude: cus[3]},
	    					icon: {path:"images/customer_pos.png", size:{width:32, height:32}, anchor:{x:16,y:32}, imageSize:{width:32, height:32}},
	    					infoWindow: {open: false, content:_content,
	    			   			opts:{
	    							  width : 180,     // 信息窗口宽度
	    							  height: 100,     // 信息窗口高度
	    							  title : "" , // 信息窗口标题
	    							  enableMessage:false//设置允许信息窗发送短息
	    							}
	    			   		}
    					});
    				
    				markers.push(marker);
    			    if(markers.length==100){
			    		var markers_overlay = MAP_TOOLS.newMarkerClusterer({
	    					map: mapObj,
	    					options:{
	    						markers: markers,
	    						maxZoom: 16,
	    						minClusterSize: 5,
	    						isAverangeCenter: true
	    						}	
	    					});
    			    	MAP_TOOLS.addOverlay({
        					map: mapObj,
        		 			id: "",
        			 		overlay: markers_overlay,
        			 		overalyMap: false
        		 		});
    			    	markers = new Array();
    			    	
    			    }
    			}
    			
    			if(markers.length>0){
					var markers_overlay = MAP_TOOLS.newMarkerClusterer({
    					map: mapObj,
    					options:{
    						markers: markers,
    						maxZoom: 16,
    						minClusterSize: 5,
    						isAverangeCenter: true
    						}	
    				});
    				MAP_TOOLS.addOverlay({
    					map: mapObj,
    		 			id: "",
    			 		overlay: markers_overlay,
    			 		overalyMap: false
    		 		});
    				
    			}
    			
       		}
			
       	}   
   	});
}
