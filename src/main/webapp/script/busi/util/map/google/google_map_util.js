/**
 * google map
 */
//地图全局覆盖物列表
var overalyMap = new Map();

//地图可见点列表，每个value保存一个point数组（用来存放地图上的可见点，以便于地图根据这些点找到合适的中心点及地图级数）
var viewPointsMap = new Map();

var MAP_TOOLS = {
		/**
		 * 初始化地图
		 * @param {Object} params
		 * params = {
		   				domId: "mapdiv",												//地图div元素
		   				center:{longitude: 118.34551, latitude:29.29387},				//地图中心点
		   				zoom:8,															//地图级数
		   				zoomRange:{minZoom:4,maxZoom:8},		//地图级数范围
		   				control:{														//控件
		   					navigation:true, 											//平移缩放控件（默认显示）
		  					scale:true, 												//比例尺控件（默认显示）
		  					overviewMap:true,											//缩略地图控件（默认显示）
		  					mapType:false												//地图类型控件（默认不显示）
		  				}, 
		  				scrollWheelZoom:true											//滚轮放大缩小（默认启用）
		  			}
		 */
		initMap : function(params){
			
			var domId = params.domId;
			var center_longitude = params.center.longitude;
			var center_latitude = params.center.latitude;
			var zoom = params.zoom;
			var zoomRange_minZoom = 0;
			var zoomRange_maxZoom = 21;
			var control_navigation = true;
			var control_scale = true;
//			var control_overviewMap = true;
			var control_mapType = false;
			var scrollWheelZoom = true;
			
			// 设置地图级数范围
			if(params.zoomRange){
				zoomRange_minZoom = params.zoomRange.minZoom || 0;
				zoomRange_maxZoom = params.zoomRange.maxZoom || 21;
			}
			
			// 添加控件
			if(params.control != null){
				// 添加平移缩放控件
				if(params.control.navigation == null){
					control_navigation = true;
				}
				else{
					control_navigation =  params.control.navigation;
				}
				
				// 添加比例尺控件
				if(params.control.scale == null ){
					control_scale = true;
				}
				else{
					control_scale = params.control.scale;
				}
				
				//添加缩略地图控件
				if(params.control.overviewMap == null ){
					control_overviewMap = true;
				}
				else{
					control_overviewMap = params.control.overviewMap;
				}
				
				// 地图类型
				if(params.control.mapType == null){
					control_mapType = false;
				}
				else{
					control_mapType = params.control.mapType;
				}
			}
			
			//启用滚轮放大缩小
			if(params.scrollWheelZoom == null){
				// google map不支持此属性
				scrollWheelZoom = true;
			}
			else{
				scrollWheelZoom = params.scrollWheelZoom;
			}
			
			var mapOptions = {
					center : {lat: center_latitude, lng: center_longitude},
					zoom : zoom,
					minZoom : zoomRange_minZoom,
					maxZoom : zoomRange_maxZoom,
					mapTypeControl: control_mapType,
					scaleControl : control_scale,
					scrollwheel : scrollWheelZoom,
					zoomControl : control_navigation,
					streetViewControl : control_navigation
			};
			
			// 创建Map实例
			var map = new google.maps.Map(document.getElementById(domId), mapOptions);
			
			return map;
		},
		
		/**
		 * 获取地图中心点
		 params = {
		 	map: map
		 }
		 
		 * @return {TypeName} 
		 	{longitude: 118.2283, latitude: 29.23433}
		 */
		getCenter : function(params){
			
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			var center = map.getCenter();
			
			var result = {longitude: center.lng(), latitude: center.lat()};
			
			return result;
		},

		/**
		 * 设置地图中心点
		 
		 * @param {Object} params {map:map, point:{longitude: 118.2283, latitude: 29.23433}, cityName: "成都"}
		 * @return {TypeName} 
		 */
		setCenter : function(params){
			if(params.map == null){
				return false;
			}
			
			var map = params.map;
			// 以经纬度方式设置地图中心点
			if(params.point != null ){
				if(params.point.longitude != null && params.point.latitude != null){
					var point = new google.maps.LatLng({lat: params.point.latitude, lng: params.point.longitude});
					
					map.setCenter(point);
					
					return true;
				}
				
			}
			// 以城市名称方式设置地图中心点
			else if(params.cityName != null){
				map.setCenter(params.cityName);
				return true;
			}
			return false;
		},
		
		/*
		 * 获取地图当前级数
		 params = {
		 	map: map
		 }
		 * @return {TypeName} 
		   			{zoom: 8}
		 */
		getZoom : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			var zoom = map.getZoom();
			
			var result = {zoom: zoom};
			
			return result;
		},
		
		/**
		 * 
		 * @param {Object} 
		 params = {
		 	map: map,
		 	zoom: 8
		 }
		 * 
		 */
		setZoom : function(params){

			if(params.map == null){
				return;
			}
			
			var map = params.map;
			
			if(params.zoom){
				map.setZoom(params.zoom);
			}
		},
		
		/**
		 * 
		 * @param {Object} 
		 params = {
		 	map:map, 
		 	point:{longitude: 118.2283, latitude: 29.23433}, 
		 	cityName: "成都",
		 	zoom: 8
		 }
		 * 
		 */
		setCenterAndZoom : function(params){

			if(params.map == null){
				return false;
			}
			
			var map = params.map;
			// 以经纬度方式设置地图中心点
			if(params.point != null ){
				if(params.point.longitude != null && params.point.latitude != null){
					this.setCenter({map: map, point:{longitude: params.point.longitude, latitude: params.point.latitude}});
				}
				
			}
			// 以城市名称方式设置地图中心点
			else if(params.cityName != null){
//				map.setCenter(params.cityName);
			}
			
			if(params.zoom){
				this.setZoom({map: map, zoom: params.zoom});
			}
			
			return true;
			
		},
		
		/**
		 * 
		 * @param {Object} params {map: map, longitude:118.232, latitude:29.34343}
		 */
		newPoint : function(params){
			if(params){
				return new google.maps.Data.Point({lat : params.latitude, lng : params.longitude});
			}
			
			return null;
		},
		
		/**
		 * 添加标注点
		 * @param {Object} params
		 * params = {
		 			map: map,
		   		point: {longitude: 118.233, latitude: 29.29384}, //必填
		   		icon: {path:"/images/icon.png", size:{width:30, height:50}, anchor:{x:10,y:10}, imageSize:{width:30, height:50}},
		   		infoWindow: {open: true, content:"<p style='font-size:14px;'>哈哈，你看见我啦！我可不常出现哦！</p><p style='font-size:14px;'>赶快查看源代码，看看我是如何添加上来的！</p>",
		   			opts:{
						  width : 200,     // 信息窗口宽度
						  height: 60,     // 信息窗口高度
						  title : "海底捞王府井店" , // 信息窗口标题
						  enableMessage:true,//设置允许信息窗发送短息
						  message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
						}
		   		},
		   		label: {content:"这是Label", offset: {x:10, y:0}}
		   }
		 */
		newMarker : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			if(params.point == null || params.point.longitude == null || params.point.latitude == null){
				return null;
			}
			
			var marker = new google.maps.Marker({map : map, position: {lat : params.point.latitude, lng : params.point.longitude}});
			
			//图标
			if(params.icon != null && params.icon.path != null){
				
				
				var anchor = null;
				if(params.icon.anchor != null && params.icon.anchor.x != null && params.icon.anchor.y != null){
//						icon.setAnchor(new BMap.Size(params.icon.anchor.x, params.icon.anchor.y));
					anchor = new google.maps.Point(params.icon.anchor.x, params.icon.anchor.y);
				}
				
				var imageSize = null;
				if(params.icon.imageSize != null && params.icon.imageSize.width != null && params.icon.imageSize.height != null){
					imageSize = new google.maps.Size(params.icon.imageSize.width, params.icon.imageSize.height);
				}
				
				var icon = {
					url: params.icon.path,
					anchor : anchor,
					size : imageSize
				};
				
				marker.setIcon(icon);
				
			}
			
			//信息窗
			if(params.infoWindow != null){
				var infoWindow = new google.maps.InfoWindow({content : params.infoWindow.content});
						
				//注册Marker的点击事件
				marker.addListener('click', function() {
					infoWindow.open(map, marker);
				});
				
				//默认是否打开信息窗（但地图上同一时间只能打开一个信息窗）
				if(params.infoWindow.open != null && params.infoWindow.open){
					infoWindow.open(map, marker);
				}
				
			}
			
			//标签
			if(params.label != null){
				
				if(params.label.content != null){
					marker.setTitle(params.label.content);
				}
				
			}
			
			return marker;
		},
		
		/**
		 * 添加折线
		 * @param {Object} params
		 * params = {
		 			map: map,
		 			points:[{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437}],
		 			options:{
		 				strokeColor:"red",    	//折线颜色
				        strokeWeight: 3,       	//折线的宽度，以像素为单位。
				        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
				        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
				        fillColor:"red",      	//填充颜色。当参数为空时，圆形将没有填充效果。
				        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
		 			}
		   }
		 */
		newPolyline : function(params){
			
			if(params.points == null || params.points.length < 2){
				return null;
			}
			
			var points = params.points;
			
			var path = new Array();
			
			for(var i in points){
				path.push({lat : points[i].latitude, lng : points[i].longitude});
			}
			
			var polyline = new google.maps.Polyline({map : params.map, path : path});
			
			if(params.options != null){
				
				var polylineOptions = {
					strokeColor : params.options.strokeColor,
					strokeOpacity : params.options.strokeOpacity,
					strokeWeight : params.options.strokeWeight
				};
				
				polyline.setOptions(polylineOptions);
			}
			
			return polyline;
		},
		
		/**
		 * 添加矩形
		 * @param {Object} params
		 * params = { 			
		 			map: map,
		 			points:[{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437}],[左上、右上、右下、左下]
		 			options:{
		 				strokeColor:"red",    	//折线颜色
				        strokeWeight: 3,       	//折线的宽度，以像素为单位。
				        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
				        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
				        fillColor:"red",      	//填充颜色。当参数为空时，圆形将没有填充效果。
				        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
		 			}
		   }
		 */
		newRectangle : function(params){
			
			if(params.points == null || params.points.length != 4){
				return null;
			}
			
			var points = params.points;
			
			var north = points[0].latitude;
			var south = points[2].latitude;
			var west = points[0].longitude;
			var east = points[2].longitude;
			
			var rectangle = new google.maps.Rectangle({
				map : params.map, 
				bounds: {
				      north: north,
				      south: south,
				      east: east,
				      west: west
				    }
			});
			
			if(params.options != null){
				
				var rectangleOptions = {
					strokeColor : params.options.strokeColor,
					strokeOpacity : params.options.strokeOpacity,
					strokeWeight : params.options.strokeWeight,
					fillColor : params.options.fillColor,
					fillOpacity : params.options.fillOpacity
				};
				
				rectangle.setOptions(rectangleOptions);
			}
				
			return rectangle;
		},
		
		/**
		 * 添加多边形
		 * @param {Object} params
		 * params = {
		 			map: map,
		 			points:[{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437}],
		 			options:{
		 				strokeColor:"red",    	//折线颜色
				        strokeWeight: 3,       	//折线的宽度，以像素为单位。
				        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
				        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
				        fillColor:"red",      	//填充颜色。当参数为空时，圆形将没有填充效果。
				        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
		 			}
		   }
		 */
		newPolygon : function(params){
			
			if(params.points == null || params.points.length < 3){
				return null;
			}
			
			var points = params.points;
			
			var path = new Array();
			
			for(var i in points){
				path.push({lat: points[i].latitude, lng: points[i].longitude});
			}
			
			var polygon = new google.maps.Polygon({map : params.map, paths : path});
			
			if(params.options != null){
				
				var polygonOptions = {
					strokeColor : params.options.strokeColor,
					strokeOpacity : params.options.strokeOpacity,
					strokeWeight : params.options.strokeWeight,
					fillColor : params.options.fillColor,
					fillOpacity : params.options.fillOpacity
				};
				
				polygon.setOptions(polygonOptions);
			}
				
			return polygon;
		},
		
		/**
		 * 添加圆形
		 * @param {Object} params
		 * params = { 			
		 			map: map,
		 			center:{longitude:118.2347, latitude:29.23437},
		 			radius: 8,
		 			options:{
		 				strokeColor:"red",    	//折线颜色
				        strokeWeight: 3,       	//折线的宽度，以像素为单位。
				        strokeOpacity: 0.8,	   	//折线的透明度，取值范围0 - 1。
				        strokeStyle: 'solid', 	//折线的样式，solid或dashed。
				        fillColor:"red",      	//填充颜色。当参数为空时，圆形将没有填充效果。
				        fillOpacity: 0.6     	//填充的透明度，取值范围0 - 1。
		 			}
		   }
		 */
		newCircle : function(params){
			
			if(params.center == null || params.radius == null){
				return null;
			}
			
			var circle = new google.maps.Circle({
			      map: params.map,
			      center: {lat: params.center.latitude, lng: params.center.longitude},
			      radius: params.radius
		    });
			
			if(params.options != null){
				
				var circleOptions = {
					strokeColor : params.options.strokeColor,
					strokeOpacity : params.options.strokeOpacity,
					strokeWeight : params.options.strokeWeight,
					fillColor : params.options.fillColor,
					fillOpacity : params.options.fillOpacity
				};
				
				circle.setOptions(circleOptions);
			}
			
			return circle;
		},
		
		/**
		 * google map不支持
		 * @param {Object} params
		 * { 		
			    map: map,
			    title:"内容", 
			    content:"标题", 
			    opts : {
				  position : point,    // 指定文本标注所在的地理位置
				  offset   : new BMap.Size(30, -30)    //设置文本偏移量
				}
			}
		 */
		newLabel : function(params){
			if(params == null){
				return null;
			}
			
			return null;
		},
		
		/**
		 * 
		 * @param {Object} params
		 * {
		 				map: map,
		 				content:"<p style='font-size:14px;'>哈哈，你看见我啦！我可不常出现哦！</p><p style='font-size:14px;'>赶快查看源代码，看看我是如何添加上来的！</p>",
		   			opts:{
						  width : 200,     // 信息窗口宽度
						  height: 60,     // 信息窗口高度
						  title : "海底捞王府井店" , // 信息窗口标题
						  enableMessage:true,//设置允许信息窗发送短息
						  message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
						}
		   		}
		 */
		newInfoWindow : function(params){
			
			if(params){
				var infoWindow = new google.maps.InfoWindow({content : params.content});
				
				return infoWindow;
			}
			return null;
		},
		
		/**
		 * 
		 * @param {Object}  
		 	params=
		 * {map: map, infoWindow: infoWindow, point: point}
		 */
		openInfoWindow : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			var marker = new google.maps.Marker({position: {lat : params.point.latitude, lng : params.point.longitude}});
			
			params.infoWindow.open(map, marker);
		},
		
		/**
		 * 
		 * @param {Object} 
			 params : 
			  {
			  	map: map,
		 			id: "p_1_1",
			 		overalyMap: true, 		//是否添加为页面覆盖物，便于通过id查找覆盖物（默认true）
			 		viewPointsMap: true, 	//是否添加为自动获取中心点及地图级数（默认true）
			 		overlay: overlay      //覆盖物对象
		 		}
		 * @return {TypeName} 
		 		
		 */
		addOverlay : function(params){

			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			var overlay = params.overlay;
			//在地图上添加点
			overlay.setMap(map);
			
			//将标注点添加到全局覆盖物列表中
			if(params.overalyMap == null || params.overalyMap){
				overalyMap.put(params.id, overlay);
			}
			
		},
		
		/**
		 * 获取覆盖物
		 * @param {Object} params
		 * params = {
		 			id:"c_0_5"
		   }
		 */
		getOverlay : function(params){
			if(params.id == null){
				return null;
			}
			return overalyMap.get(params.id);
		},
		
		/**
		 * 
		 * @param {Object} 
		 	params = {
		 			map: map,
		 			overlay: overlay
		   }
		 * @return {TypeName} 
		 */
		removeOverlay : function(params){
			if(params.map == null){
				return false;
			}
			
			if(params.overlay == null){
				return false;
			}
			
			params.overlay.setMap(null);
			
			return true;
		},
		
		/**
		 * 删除地图覆盖物
		 * @param {Object} params
		 * params = {
		 			map: map,
		 			id: "p1_1"
		   }
		 */
		removeOverlayById : function(params){
			if(params.map == null){
				return false;
			}
			
			var map = params.map;
			
			if(params.id == null){
				return false;
			}
			
			//将地图上指定编号的覆盖物移除
			this.removeOverlay({map: map, overlay:overalyMap.get(params.id)});
			
			//将全局覆盖物列表中的覆盖物移除
			overalyMap.remove(params.id);
			
			//移除id对应的point数组
			viewPointsMap.remove(params.id);
			
			return true;
		},
		
		/**
		 * 
		 * @param {Object} 
		 	params = {
		 			map: map
		   }
		 * @return {TypeName} 
		 */
		clearOverlays : function(params){
			if(params.map == null){
				return false;
			}
			
			if(overalyMap != null){
				var len = overalyMap.size();
				for(var i=0; i<len; i++){
					overalyMap.element(i).setMap(null);
					
				}
				
				overalyMap.clear();
			}
			
			return true;
		},
		
		/**
		 * 自动寻找中心点和最佳地图级数
		 * @param {Object} params
			params = {
				map: map,
				points:[
					{longitude: 118.23245, latitude:29.28938},
					{longitude: 118.23245, latitude:29.28938},
					{longitude: 118.23245, latitude:29.28938}
				]
			}
		 */
		autoCenterAndZoom : function(params){

			if(params.map == null){
				return;
			}
			
			var map = params.map;
			
			//如果传递参数，则根据参数寻找中心点和最佳地图级数
			if(params != null && params.points != null){
				var points = params.points;
				
				var len = points.length;
				
				var bounds = new google.maps.LatLngBounds();
				
				for(var i=0; i<len; i++){
					
					bounds.extend(new google.maps.LatLng(points[i].latitude, points[i].longitude));
					
				}
				
				//根据提供的地理区域或坐标设置地图视野
				map.fitBounds(bounds);
			}
		},
		
		/**
		 * 获得当前视野经纬度范围
		 	 params = {
		 			map: map
		   }
		 * @return {TypeName} 
		 * 
		 {
			southWest: {longitude: 116.300015, latitude: 39.888155}, //左下经纬度
			northEast:{longitude: 116.506985, latitude: 39.941835}   //右上经纬度
		 }
		 */
		getBounds : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			var bs = map.getBounds();   //获取可视区域
			var bssw = bs.getSouthWest();   //可视区域左下角
			var bsne = bs.getNorthEast();   //可视区域右上角
			var result = {
							southWest: {longitude: bssw.lng(), latitude: bssw.lat()}, 
							northEast:{longitude: bsne.lng(), latitude: bsne.lat()}
						 };
			
			return result;
		},
		
		/**
		 * 地图添加监听事件
		 * @param {Object} params
		 * {map: map, eventName: "click", callback: eventMethod}
		 */
		addEventListener : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			if(params){
				google.maps.event.addListener(map, params.eventName, params.callback);
			}
		},
		
		/**
		 * 地图搜索
		 * @param {Object} params
		 {
		 	map : map,
		 	cityName: "重庆",
		 	keyword: "幸福广场",
		 	pageCapacity : 5,
		 	renderOptions:{
		 		map: map, 					//展现结果的地图实例。当指定此参数后，搜索结果的标注、线路等均会自动添加到此地图上。
		 		panel: "resultDIv",			//结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示。此属性对LocalCity无效。
		 		selectFirstResult: true,	//是否选择第一个检索结果。此属性仅对LocalSearch有效。
		 		autoViewport: true,			//检索结束后是否自动调整地图视野。此属性对LocalCity无效。
		 		highlightMode: HighlightModes	//驾车结果展现中点击列表后的展现策略。BMAP_HIGHLIGHT_STEP(驾车结果展现中点击列表后的展现点步骤。) BMAP_HIGHLIGHT_ROUTE(驾车结果展现中点击列表后的展现路段。)
		 	},
		 	searchCompleteCallback: searchCompleteCallbackFunction
		 }
		 * @return {TypeName} 
		 */
		search : function(params){
			
			if(params.map == null){
				return ;
			}
			
			var map = params.map;
			
			if(params.keyword == null){
				return null;
			}
			
			var keyword = params.keyword;
			
			var service = new google.maps.places.PlacesService(map);
			
			service.nearbySearch({keyword: keyword, bounds: map.getBounds()}, params.searchCompleteCallback);

			return service;
			
		},
		
		/**
		 * 地理服务
		 */
		geocoder : {
			
			geocoderObj : null,
			/**
			 * 初始化地理服务
			 * @param 
			 */
			init : function(){
				if(this.geocoderObj == null){
					this.geocoderObj = new google.maps.Geocoder();
				}
				
				return this.geocoderObj;
			},
			
			/**
			 * 地址解析
			 * @param {Object} params : {address: "重庆市幸福广场", cityName:"重庆", callback: callbackfunction}
			 */
			getPoint : function(params){
				
				var geocoder = this.init();
				
				geocoder.geocode({'address': params.address}, params.callback);
				
			},
			
			/**
			 * 逆地理解析
			 * @param {Object} params : {point: {longitude: 118.2563, latitude:29.2698}, callback: callbackfunction}
			 */
			getLocation : function(params){
				
				var geocoder = this.init();
				
				geocoder.geocode({'location': {lat: params.point.latitude, lng: params.point.longitude}}, params.callback);				

			}
		},
		
		/**
		 * 绘图工具
		 */
		drawingManager : {
			/**
			 * 为地图添加鼠标绘制工具栏
			 * @param {Object} params
			 * 
							{
								map: map,
			  					options:{
			  						drawingMode : null,
			  						drawingControl : true,
			  						drawingControlOptions : {
			  							position: google.maps.ControlPosition.TOP_RIGHT,
			  							drawingModes: [
							              google.maps.drawing.OverlayType.MARKER,
							              google.maps.drawing.OverlayType.CIRCLE,
							              google.maps.drawing.OverlayType.POLYGON,
							              google.maps.drawing.OverlayType.POLYLINE,
							              google.maps.drawing.OverlayType.RECTANGLE
							            ]
			  						},
						            markerOptions : markerOptions,
						            circleOptions : circleOptions,
						            polygonOptions : polygonOptions,
						            polylineOptions : polylineOptions,
						            rectangleOptions : rectangleOptions
			 					},
			  					overlaycomplete: overlaycompleteFunction
			  				}

			 */
			init : function(params){

				if(params.map == null){
					return null;
				}
				
				var map = params.map;
				
				var drawingManager = new google.maps.drawing.DrawingManager(params.options);
				
				drawingManager.setMap(map);
					
				if(params.overlaycomplete != null){
					
					google.maps.event.addListener(drawingManager, 'overlaycomplete', params.overlaycomplete);
				}
				
				return drawingManager;
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			open : function(params){
				params.drawingManager.setMap(params.map);
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			close : function(params){
				params.drawingManager.setDrawingMode(null);
			}
		}
};