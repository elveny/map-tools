/**
 * google map
 */

var MAP_TOOLS = {
		/**
		 * 地图全局覆盖物列表
		 */
		overalyMap : new Map(),
		/**
		 * 地图可见点列表，每个value保存一个point数组（用来存放地图上的可见点，以便于地图根据这些点找到合适的中心点及地图级数）
		 */
		viewPointsMap : new Map(),
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
					center : this.newPoint({map: null, longitude: center_longitude, latitude: center_latitude}),
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
					var point = this.newPoint({map: params.map, longitude: params.point.longitude, latitude: params.point.latitude});
					
					map.setCenter(point);
					
					return true;
				}
				
			}
			// 以城市名称方式设置地图中心点
			else if(params.cityName != null){
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
//				return {lat : params.latitude, lng : params.longitude};
				return new google.maps.LatLng(params.latitude, params.longitude);
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
			var map = params.map;
			
			if(params.map == null){
				map = null;
			}
			
			if(params.point == null || params.point.longitude == null || params.point.latitude == null){
				return null;
			}
			
			var marker = new google.maps.Marker({map : map, position: this.newPoint({map: map, longitude: params.point.longitude, latitude: params.point.latitude})});
			
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
		 * 重设marker位置
		 * @param params {marker: marker, position:{longitude: 116.32333, latitude: 29.23232}}
		 */
		resetMarkerPosition : function(params){
			if(params.marker == null){
				return null;
			}
			
			params.marker.setPosition(this.newPoint(params.position));
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
				path.push(this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude}));
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
			
			var north = parseFloat(points[0].latitude);
			var south = parseFloat(points[2].latitude);
			var west = parseFloat(points[0].longitude);
			var east = parseFloat(points[2].longitude);
			
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
				path.push(this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude}));
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
			      center: this.newPoint({map: params.map, longitude: params.center.longitude, latitude: params.center.latitude}),
			      radius: parseFloat(params.radius)
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
		 * 点聚合方法
		 * @param {Object} params
		 * 
						{
								map : map,																//地图的一个实例。
		  					options:{
									markers: [marker1, marker2...], 				//{Array} 要聚合的标记数组
									girdSize: 60, 													//{Number} 聚合计算时网格的像素大小，默认60
									maxZoom: 8, 														//{Number} 最大的聚合级别，大于该级别就不进行相应的聚合
									minClusterSize: 2, 											//{Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
									isAverangeCenter: false, 								//{Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点
									styles:{style1, style2, ...} 						//{Array} 自定义聚合后的图标风格，请参考TextIconOverlay类
		 						}
		  				}

		 */
		newMarkerClusterer : function(params){
			
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
			
			var marker = new google.maps.Marker({position: this.newPoint({map: params.map, longitude: params.point.longitude, latitude: params.point.latitude}),});
			
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
				this.overalyMap.put(params.id, overlay);
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
			return this.overalyMap.get(params.id);
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
			this.removeOverlay({map: map, overlay: this.overalyMap.get(params.id)});
			
			//将全局覆盖物列表中的覆盖物移除
			this.overalyMap.remove(params.id);
			
			//移除id对应的point数组
			this.viewPointsMap.remove(params.id);
			
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
			
			if(this.overalyMap != null){
				var len = this.overalyMap.size();
				for(var i=0; i<len; i++){
					this.overalyMap.element(i).value.setMap(null);
					
				}
				
				this.overalyMap.clear();
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
					bounds.extend(this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude}));
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
		
		
		search : {
			searchService : null,
			
			/**
			 * 
			 * @param params {map: map}
			 */
			init : function(params){
				if(params.map == null){
					return ;
				}
				
				this.searchService = new google.maps.places.PlacesService(params.map);
				
				return this.searchService;
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
				
				if(params.keyword == null){
					return null;
				}
				
				var map = params.map;
				
				if(this.searchService == null){
					this.init({map : map});
				}
				
				var keyword = params.keyword;
				
				this.searchService.nearbySearch({keyword: keyword, bounds: map.getBounds()}, function(results, status, pagination){
					
					var searchResults = new Array();
					
					if(status == google.maps.places.PlacesServiceStatus.OK){
						var _len = results.length;
						
						for(var i = 0; i < _len; i++){
							var placeResult = results[i];
							var name = placeResult.name;
							var geometry = placeResult.geometry;
							var location = geometry.location;
							var longitude = location.lng();
							var latitude = location.lat();
							
							searchResults.push({point:{longitude: longitude, latitude: latitude}, name : name});
						}
					}
					
					params.searchCompleteCallback(searchResults);
					
				});

				return this.searchService;
				
			},
			/**
			 * 
			 * @param params {map : map}
			 */
			clear : function(params){
				
			}
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
				
				geocoder.geocode({'address': params.address}, function(results, status){
					var resultArr = new Array();
					
					if(status == google.maps.GeocoderStatus.OK){
						for(var i = 0; i < results.length; i++){
							var point = results[i].geometry.location;
							
							resultArr.push({
								point: {longitude: point.lng(), latitude: point.lat()}
							});
						}
					}
					
					
					params.callback(resultArr);
				});
				
			},
			
			/**
			 * 逆地理解析
			 * @param {Object} params : {point: {longitude: 118.2563, latitude:29.2698}, callback: callbackfunction}
			 */
			getLocation : function(params){
				
				var geocoder = this.init();
				
				geocoder.geocode({'location': {lat: parseFloat(params.point.latitude), lng: parseFloat(params.point.longitude)}}, function(results, status){
					
					var formattedAddress = "";
					var province = "";
					var city = "";
					var district = "";
					var township = "";
					var street = "";
					var streetNumber = "";
					var neighborhood = "";
					var building = "";
					
					if(results){
						if(results[0]){
							formattedAddress = results[0].formatted_address;
						}
					}
					
					params.callback({
						formattedAddress: formattedAddress, 
						addressComponent:{
							province: province,
							city: city,
							district: district,
							township: township,
							street: street,
							streetNumber: streetNumber,
							neighborhood: neighborhood,
							building: building
						}
					});
				});				

			}
		},
		
		/**
		 * 绘图工具
		 */
		drawingManager : {
			drawingManagerObj : null,
			overlaycomplete : null,
			/**
			 * 为地图添加鼠标绘制工具栏
			 * @param  params
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
				
				if(this.drawingManagerObj == null){
					if(params.map == null){
						return null;
					}
					
					this.drawingManagerObj = new google.maps.drawing.DrawingManager(params.options);
					
					this.overlaycomplete = params.overlaycomplete;
						
				}
				return this.drawingManagerObj;
				
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			open : function(params){
				if(params){
					if(params.drawingManager){
						params.drawingManager.setMap(params.map);
					}
					else{
						this.drawingManagerObj.setMap(params.map);
					}
				}
				else{
					
					this.drawingManagerObj.setMap(params.map);
				}
				
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			close : function(params){
				
				if(params){
					if(params.drawingManager){
						params.drawingManager.setMap(null);
					}
					else{
						this.drawingManagerObj.setMap(null);
					}
				}
				else{
					
					this.drawingManagerObj.setMap(null);
				}
			},
			
			/**
			 * 
			 * @param params {map: map, mode : mode, overlaycomplete: overlaycomplete}
			 * mode [DRAWING_MARKER, 
					DRAWING_CIRCLE, 
					DRAWING_POLYLINE, 
					DRAWING_POLYGON, 
					DRAWING_RECTANGLE]
			 */
			setDrawingMode : function(params){
				if(this.drawingManagerObj == null){
					alert("绘图工具错误：使用之前请先初始化");
					return null;
				}
				
				this.open({map: params.map});
				
				var overlaycomplete = null;
				
				if(params.overlaycomplete){
					overlaycomplete = params.overlaycomplete;
				}
				else{
					overlaycomplete = this.overlaycomplete;
				}
				
				if(params.mode == "DRAWING_MARKER"){
					this.drawingManagerObj.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
					
					google.maps.event.addListener(this.drawingManagerObj, 'markercomplete', function(marker){
						overlaycomplete({type: "marker", point: {longitude: marker.getPosition().lng(), latitude: marker.getPosition().lat()}, overlay: marker});
					});
					
				}
				else if(params.mode == "DRAWING_CIRCLE"){
					this.drawingManagerObj.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
					
					google.maps.event.addListener(this.drawingManagerObj, 'circlecomplete', function(circle){
						
						overlaycomplete({type: "circle", center: {longitude: circle.getCenter().lng(), latitude: circle.getCenter().lat()}, radius: circle.getRadius(), overlay: circle});
					});
				}
				else if(params.mode == "DRAWING_POLYLINE"){
					this.drawingManagerObj.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
					
					google.maps.event.addListener(this.drawingManagerObj, 'polylinecomplete', function(polyline){
						var path = polyline.getPath();
						
						var points = new Array();
						
						var len = path.getLength();
						
						for(var i=0; i<len; i++){
							points.push({longitude: path.getAt(i).lng(), latitude: path.getAt(i).lat()});
						}
						
						overlaycomplete({type: "polyline", points: points, overlay: polyline});
						
					});
					
				}
				else if(params.mode == "DRAWING_POLYGON"){
					this.drawingManagerObj.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
					
					google.maps.event.addListener(this.drawingManagerObj, 'polygoncomplete', function(polygon){
						var path = polygon.getPath();
						
						var points = new Array();
						
						var len = path.getLength();
						
						for(var i=0; i<len; i++){
							points.push({longitude: path.getAt(i).lng(), latitude: path.getAt(i).lat()});
						}
						
						overlaycomplete({type: "polygon", points: points, overlay: polygon});
					});
				}
				else if(params.mode == "DRAWING_RECTANGLE"){
					this.drawingManagerObj.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
					google.maps.event.addListener(this.drawingManagerObj, 'rectanglecomplete', function(rectangle){
						var bounds = rectangle.getBounds();
						
						var points = new Array();
						
						var northEast = bounds.getNorthEast();
						var ne_lat = northEast.lat();
						var ne_lon = northEast.lng();
						var southWest = bounds.getSouthWest();
						var sw_lat = southWest.lat();
						var sw_lon = southWest.lng();
						
						points.push({longitude: sw_lon, latitude: ne_lat});
						points.push({longitude: ne_lon, latitude: ne_lat});
						points.push({longitude: ne_lon, latitude: sw_lat});
						points.push({longitude: sw_lon, latitude: sw_lat});
						
						
						overlaycomplete({type: "rectangle", points: points, overlay: rectangle});
					});
					
				}
			}
		},
		
		/**
		 * 测距工具
		 */
		distanceTool:{
			distanceToolObj : null,
			/**
			 * 初始化工具
			 * @param params{map: map}
			 */
			
			init:function(params){
//				if(this.distanceToolObj == null){
//					this.distanceToolObj = new BMapLib.DistanceTool(params.map);
//				}
				
				return this.distanceToolObj;
			},
			
			/**
			 * 打开测距工具
			 * @param params{map: map}
			 */
			open : function(params){
				var distanceToolObj = this.init(params);
//				distanceToolObj.open();
			},
			
			/**
			 * 关闭测距工具
			 * @param params{map: map}
			 */
			close : function(params){
				var distanceToolObj = this.init(params);
//				distanceToolObj.close();
			}
		},
		
		/**
		 * 驾车路线规划
		 */
		driving :{
			/**
			 * 
			 * @param {Object} params
			 {
			 	map:map,
		 		panel: domId   //类型：String|HTMLElement。结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示。此属性对LocalCity无效。
			 }
			 * @return {DrivingRoute} 
			 * 
			 */
			newDriving : function(params){
				if(params.map == null){
					return null;
				}
				
				var driving = new google.maps.DirectionsService();
				
				return driving;
			},
			
			/**
			 * 
			 * @param {Object} params
			 {
			 	map: map,
			 	points: points,
			 	callback: callback(points)
			 }
			 * @return 
			 * 
			 */
			drivingRoutePoints : function(params){
				var driving = this.newDriving({map: params.map});
				
				var points = params.points;
				
				//结果点数组
				var drivingRouteResultPoints = new Array(); 
				
				//添加第一个点到结果数组中
				drivingRouteResultPoints.push(points[0]);
				
				this.native_driving_route_recursion(params.map, driving, 1, points, drivingRouteResultPoints, params.callback);
			},
			
			/**
			 * 递归函数
			 * @param map
			 * @param driving
			 * @param num
			 * @param points
			 * @param drivingRouteResultPoints
			 * @param callback
			 */
			native_driving_route_recursion : function(map, driving, num, points, drivingRouteResultPoints, callback){
				
				if(num < points.length){
					
					var start_point = points[num-1];
					var end_point = points[num];
					
					var distance = MapCommonUtil.distance.distance(start_point.latitude, start_point.longitude, end_point.latitude, end_point.longitude);
					
					if(distance > 20){
						
						var request = {
							    origin: MAP_TOOLS.newPoint({map: map, longitude: start_point.longitude, latitude: start_point.latitude}),
							    destination: MAP_TOOLS.newPoint({map: map, longitude: end_point.longitude, latitude: end_point.latitude}),
							    travelMode: google.maps.TravelMode.DRIVING,
							  };
						
						
						driving.route(request, function(result, status) {
							
						    if (status == google.maps.DirectionsStatus.OK) {
						    	
						    	var routes = result.routes;
						    	var overview_path = routes[0].overview_path;
						    	
						    	for(var j=0; j<overview_path.length; j++){
						    		
						    		drivingRouteResultPoints.push({longitude: overview_path[j].lng(), latitude: overview_path[j].lat()});
						    	}
						    	
						    	if(num < (points.length-1)){
									MAP_TOOLS.driving.native_driving_route_recursion(map, driving, num+1, points, drivingRouteResultPoints, callback);
								}
								else{
									
									callback(drivingRouteResultPoints);
									return;
									
								}
						    }
						    else{
						    	if(num < (points.length-1)){
									MAP_TOOLS.driving.native_driving_route_recursion(map, driving, num+1, points, drivingRouteResultPoints, callback);
								}
								else{
									
									callback(drivingRouteResultPoints);
									return;
									
								}
						    }
						});
					}
					else{
						drivingRouteResultPoints.push(end_point);
						if(num < (points.length-1)){
							MAP_TOOLS.driving.native_driving_route_recursion(map, driving, num+1, points, drivingRouteResultPoints, callback);
						}
						else{
							
							callback(drivingRouteResultPoints);
							return;
							
						}
					}
				}
				else{
					callback(drivingRouteResultPoints);
					return;
				}
			}
		}
};