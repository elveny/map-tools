/**
 * amap map
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
			var control_overviewMap = true;
			var scrollWheelZoom = true;
			
			// 设置地图级数范围
			if(params.zoomRange){
				zoomRange_minZoom = params.zoomRange.minZoom || 0;
				zoomRange_maxZoom = params.zoomRange.maxZoom || 18;
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
					center : new AMap.LngLat(center_longitude, center_latitude),
					zoom : zoom,
					zooms : [zoomRange_minZoom, zoomRange_maxZoom],
					scrollwheel : scrollWheelZoom
			};
			
			// 创建Map实例
			var map = new AMap.Map(domId, mapOptions);
			
			if(control_scale){
				map.addControl(new AMap.Scale({visible: true}));
			}
			
			if(control_overviewMap){
				map.addControl(new AMap.OverView({visible: true}));
			}
			
			if(control_navigation){
				map.addControl(new AMap.ToolBar({visible: true}));
			}
			
			if(control_mapType){
				map.addControl(new AMap.MapType({visible: true}));
			}
			
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
			
			var result = {longitude: center.getLng(), latitude: center.getLat()};
			
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
					var point = new AMap.LngLat(params.point.longitude, params.point.latitude);
					
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
				map.setCity(params.cityName);
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
				return new AMap.LngLat(params.longitude, params.latitude);
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
			
			var point = this.newPoint({map: map, longitude: params.point.longitude, latitude: params.point.latitude});
			
			var marker = new AMap.Marker({map : map, position: point});
			
			//图标
			if(params.icon != null && params.icon.path != null){
				
				var size = '';
				if(params.icon.size != null && params.icon.size.width != null && params.icon.size.height != null){
					size = new AMap.Size(params.icon.size.width, params.icon.size.height);
				}
				
				var anchor = '';
				if(params.icon.anchor != null && params.icon.anchor.x != null && params.icon.anchor.y != null){
					anchor = new AMap.Pixel(params.icon.anchor.x, params.icon.anchor.y);
				}
				
				var imageSize = '';
				if(params.icon.imageSize != null && params.icon.imageSize.width != null && params.icon.imageSize.height != null){
					imageSize = new AMap.Size(params.icon.imageSize.width, params.icon.imageSize.height);
				}
				
				var icon = new AMap.Icon({
						image: params.icon.path,
						size : size,
						imageOffset : anchor,
						imageSize : imageSize
				});
				
				marker.setIcon(icon);
				
			}
			
			//信息窗
			if(params.infoWindow != null){
				
				var infoWindow = this.newInfoWindow({map: map, content : params.infoWindow.content});
						
				//注册Marker的点击事件
				AMap.event.addListener(marker, "click", function(){
					MAP_TOOLS.openInfoWindow({map: map, infoWindow: infoWindow, point: params.point});
				});
				
//				this.addEventListener({eventObj: marker, eventName: "click", callback: function(){
//					MAP_TOOLS.openInfoWindow({map: map, infoWindow: infoWindow, point: params.point});
//				}});
				
				//默认是否打开信息窗（但地图上同一时间只能打开一个信息窗）
				if(params.infoWindow.open != null && params.infoWindow.open){
					this.openInfoWindow({map: map, infoWindow: infoWindow, point: params.point});
				}
				
			}
			
			//标签
			if(params.label != null){
				
				var content = "";
				var offset = null;
				if(params.label.content != null){
					content = params.label.content;
				}
				
				if(params.label.offset != null && params.label.offset.x != null && params.label.offset.y != null){
					offset = new AMap.Pixel(params.label.offset.x, params.label.offset.y);
				}
				
				marker.setLabel({
					offset : offset,
					content : content
				});
				
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
			
			var map = params.map;
			
			if(params.map == null){
				map = null;
			}
			
			if(params.points == null || params.points.length < 2){
				return null;
			}
			
			var points = params.points;
			
			var path = new Array();
			
			for(var i in points){
				path.push(this.newPoint({map: map, longitude: points[i].longitude, latitude: points[i].latitude}));
			}
			
			var polyline = new AMap.Polyline({map : map, path : path});
			
			if(params.options != null){
				
				var polylineOptions = {
					strokeColor : params.options.strokeColor,
					strokeOpacity : params.options.strokeOpacity,
					strokeWeight : params.options.strokeWeight,
					strokeStyle : params.options.strokeStyle
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
			
			var map = params.map;
			
			if(params.map == null){
				map = null;
			}
			
			if(params.points == null || params.points.length != 4){
				return null;
			}
			
			var points = params.points;
			
			var path = new Array();
			
			for(var i=0; i<points.length; i++){
				path.push(this.newPoint({map: map, longitude: points[i].longitude, latitude: points[i].latitude}));
			}
			
						
			var rectangle = new AMap.Polygon({
				map : map, 
				path : path
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
			
			var map = params.map;
			
			if(params.map == null){
				map = null;
			}
			
			if(params.points == null || params.points.length < 3){
				return null;
			}
			
			var points = params.points;
			
			var path = new Array();
			
			for(var i in points){
				path.push(this.newPoint({map: map, longitude: points[i].longitude, latitude: points[i].latitude}));
			}
			
			var polygon =  new AMap.Polygon({
				map : map, 
				path : path
			});
			
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
			
			var map = params.map;
			
			if(params.map == null){
				map = null;
			}
			
			if(params.center == null || params.radius == null){
				return null;
			}
			
			var circle = new AMap.Circle({
			      map: map,
			      center: this.newPoint({map: map, longitude: params.center.longitude, latitude: params.center.latitude}),
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
				var infoWindow = new AMap.InfoWindow({content : params.content, offset: new AMap.Pixel(0, -30)});
				
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
		 * {map: map, infoWindow: infoWindow, point: {longitude:118.32323, latitude: 29.23243}}
		 */
		openInfoWindow : function(params){
			if(params.map == null){
				return null;
			}
			
			var map = params.map;
			
			params.infoWindow.open(map, this.newPoint({map: map, longitude: params.point.longitude, latitude: params.point.latitude}));
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
			this.removeOverlay({map: map, overlay:this.overalyMap.get(params.id)});
			
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
			
			params.map.clearMap();
			
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
			
			var points = params.points;
			
			if(points){
				
				if(points.length == 1){
					points.push({longitude: points[0].longitude, latitude: points[0].latitude});
				}
				
				var overlays = new Array();
				
				// 为适应高德地图自动缩放地图视野
				overlays.push(this.newPolyline({map: null, points: points}));
				
				map.setFitView(overlays);
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
							southWest: {longitude: bssw.getLng(), latitude: bssw.getLat()}, 
							northEast:{longitude: bsne.getLng(), latitude: bsne.getLat()}
						 };
			
			return result;
		},
		
		/**
		 * 地图添加监听事件
		 * @param {Object} params
		 * {eventObj: obj, eventName: "click", callback: eventMethod}
		 */
		addEventListener : function(params){
			if(params.map == null){
				return null;
			}
			
			if(params){
				AMap.event.addListener(params.eventObj, params.eventName, params.callback);
			}
		},
		
		
		search : {
			searchService : null,
			/**
			 * 
			 * @param params {map : map, panel: panel}
			 */
			init : function(params){
				
				AMap.service(["AMap.PlaceSearch"], function() {
					this.searchService = new AMap.PlaceSearch(params);
		        });
				
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
				
//				var map = params.map;
				
				if(params.keyword == null){
					return null;
				}
				
				var keyword = params.keyword;
				
				var pageCapacity = 5;
				if(params.pageCapacity != null){
					pageCapacity = params.pageCapacity;
				}
				
				var panel = null;
				if(params.renderOptions != null){
					panel = params.renderOptions.panel;
				}
				
				if(this.searchService == null){
//					this.init({map : map, panel: panel});
					this.init({map : null, panel: panel});
				}
				
				AMap.service(["AMap.PlaceSearch"], function() {
					if(params.cityName){
						this.searchService.setCity(params.cityName);
					}
					
					this.searchService.setPageIndex(1);
					this.searchService.setPageSize(pageCapacity);
					
					this.searchService.search(keyword, function(status, result){
						
						var searchResults = new Array();
						
						if("complete" == status){
							
							var poiList = result.poiList;
							
							var pois = poiList.pois;
							
							var _len = pois.length;
							
							for(var i = 0; i < _len; i++){
								var poi = pois[i];
								var name = poi.name;
								var location = poi.location;
								var longitude = location.getLng();
								var latitude = location.getLat();
								
								searchResults.push({point:{longitude: longitude, latitude: latitude}, name : name});
							}
						}
						
						params.searchCompleteCallback(searchResults);
					});
					
					return this.searchService;
		        });
				
				
				
			},
			
			/**
			 * 
			 * @param params {map : map}
			 */
			clear : function(params){
				if(this.searchService != null){
					AMap.service(["AMap.PlaceSearch"], function() {
						this.searchService.clear();
			        });
					
				}
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
					this.geocoderObj = new AMap.Geocoder();
				}
				
				return this.geocoderObj;
			},
			
			/**
			 * 地址解析
			 * @param {Object} params : {address: "重庆市幸福广场", cityName:"重庆", callback: callbackfunction}
			 */
			getPoint : function(params){
				
				var geocoder = this.init();
				
				geocoder.getLocation(params.address, function(status, results){
					var resultArr = new Array();
					
					var geocodes = results.geocodes;
					
					for(var i = 0; i < geocodes.length; i++){
						var geocode = geocodes[i];
						
						if(geocode){
							
							resultArr.push({
								point: {longitude: geocode.location.getLng(), latitude: geocode.location.getLat()}
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
				
				geocoder.getAddress(MAP_TOOLS.newPoint({longitude: params.point.longitude, latitude: params.point.latitude}) , function(status, results){
					
					var regeocode = results.regeocode;
					
					var formattedAddress = "";
					var province = "";
					var city = "";
					var district = "";
					var township = "";
					var street = "";
					var streetNumber = "";
					var neighborhood = "";
					var building = "";
					
					if(regeocode){
						formattedAddress = regeocode.formattedAddress;
						
						if(result.addressComponent){
							province = result.addressComponent.province;
							city = result.addressComponent.city;
							district = result.addressComponent.district;
							township = result.addressComponent.township;
							street = result.addressComponent.street;
							streetNumber = result.addressComponent.streetNumber;
							neighborhood = result.addressComponent.neighborhood;
							building = result.addressComponent.building;
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
		 * 地图插件
		 */
		plugin : {
			/**
			 * 鼠标工具插件
			 */
			mousetool : {
				mousetoolObj : null,
				listener : null,
				/**
				 * 初始化鼠标工具插件
				 * @param params {map : map}
				 */
				init : function(params){
					
					if(this.mousetoolObj == null){
						this.mousetoolObj = new AMap.MouseTool(params.map);
					}
					
					return this.mousetoolObj;
				},
				
				/**
				 * 点标注模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				marker : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.marker();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						var marker = result.obj;
						
						params.callback({type: "marker", point: {longitude: marker.getPosition().getLng(), latitude: marker.getPosition().getLat()}, overlay: marker});
					});
				},
				
				/**
				 * 折线模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				polyline : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.polyline();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						var polyline = result.obj;
						
						var path = polyline.getPath();
						
						var len =path.length;
						
						var points = new Array();
						
						for(var i=0; i<len; i++){
							points.push({longitude: path[i].getLng(), latitude: path[i].getLat()});
						}
						
						params.callback({type: "polyline", points: points, overlay: polyline});
					});
				},
				
				/**
				 * 多边形模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				polygon : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.polygon();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						var polygon = result.obj;
						
						var path = polygon.getPath();
						
						var len =path.length;
						
						var points = new Array();
						
						for(var i=0; i<len; i++){
							points.push({longitude: path[i].getLng(), latitude: path[i].getLat()});
						}
						
						params.callback({type: "polygon", points: points, overlay: polygon});
					});
				},
				
				/**
				 * 矩形模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				rectangle : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.rectangle();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						var rectangle = result.obj;
						
						var path = rectangle.getPath();
						
						var len =path.length;
						
						var points = new Array();
						
						for(var i=0; i<len; i++){
							points.push({longitude: path[i].getLng(), latitude: path[i].getLat()});
						}
						
						params.callback({type: "rectangle", points: points, overlay: rectangle});
					});
				},
				
				/**
				 * 画圆模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				circle : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.circle();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						var circle = result.obj;
						
						var center = circle.getCenter();
						var radius = circle.getRadius();
						
						params.callback({type: "circle", center: {longitude: center.getLng(), latitude: center.getLat()}, radius: radius, overlay: circle});
					});
				},
				
				/**
				 * 画圆模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				rule : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.rule();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						params.callback({type: "rule"});
					});
				},
				
				/**
				 * 面积量测模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				measureArea : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.measureArea();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						params.callback({type: "measureArea"});
					});
				},
				
				/**
				 * 鼠标拉框放大模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				rectZoomIn : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.rectZoomIn();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						params.callback({type: "rectZoomIn"});
					});
				},
				
				/**
				 * 鼠标拉框缩小模式
				 * @param params {map : map, callback: callbackFunction}
				 */
				rectZoomOut : function(params){
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor("crosshair");
					
					this.mousetoolObj.rectZoomOut();
					
					this.listener = AMap.event.addListener(this.mousetoolObj, 'draw', function(result){
						params.callback({type: "rectZoomOut"});
					});
				},
				
				/**
				 * 关闭鼠标工具插件
				 * @param params {map : map}
				 */
				close : function(params){
					if(this.mousetoolObj){
						this.mousetoolObj.close();
					}
					
					if(this.listener){
						AMap.event.removeListener(this.listener);
					}
					
					params.map.setDefaultCursor(null);
				}
			},
			
			/**
			 * 测距工具
			 */
			rangingTool:{
				rangingToolObj : null,
				/**
				 * 初始化工具
				 * @param params{map: map}
				 */
				
				init:function(params){
					if(this.rangingToolObj == null){
						this.rangingToolObj = new AMap.RangingTool(params.map);
					}
					
					return this.rangingToolObj;
				},
				
				/**
				 * 打开测距工具
				 * @param params{map: map}
				 */
				open : function(params){
					var rangingToolObj = this.init(params);
					rangingToolObj.turnOn();
				},
				
				/**
				 * 关闭测距工具
				 * @param params{map: map}
				 */
				close : function(params){
					var rangingToolObj = this.init(params);
					rangingToolObj.turnOff();
				}
			},
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
									isOpen: true,											//是否开启绘制模式 
									enableDrawingTool: true,								//是否添加绘制工具栏控件，默认不添加
									drawingToolOptions: {									//可选的输入参数，非必填项。可输入选项包括 
							            anchor: BMAP_ANCHOR_TOP_RIGHT, 						//停靠位置、默认左上角 
							            offset: new BMap.Size(5, 5), 						//偏移值
							            scale: 0.6, 										//工具栏的缩放比例,默认为1 
							            drawingModes:[
							            			  BMAP_DRAWING_MARKER, 
							            			  BMAP_DRAWING_CIRCLE, 
							            			  BMAP_DRAWING_POLYLINE, 
							            			  BMAP_DRAWING_POLYGON, 
							            			  BMAP_DRAWING_RECTANGLE
							            			  ]
							        },
							        enableCalculate: false,									//绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形) （对地图绘制效率有些影响）
							        markerOptions: BMAP_DRAWING_MARKER,						//点的样式
							        circleOptions: BMAP_DRAWING_CIRCLE, 					//圆的样式
							        polylineOptions: BMAP_DRAWING_POLYLINE, 				//线的样式
							        polygonOptions: BMAP_DRAWING_POLYGON, 					//多边形的样式
							        rectangleOptions: BMAP_DRAWING_RECTANGLE  				//矩形的样式
			 					},
			  					overlaycomplete: overlaycompleteFunction
			  				}

			 */
			init : function(params){
				
				if(this.drawingManagerObj == null){
					this.drawingManagerObj = MAP_TOOLS.plugin.mousetool.init({map: params.map});
					this.overlaycomplete = params.overlaycomplete;
				}
				
				return this.drawingManagerObj;

			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			open : function(params){
				
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			close : function(params){
				MAP_TOOLS.plugin.mousetool.close({map: params.map});
				
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
				
				var overlaycomplete = null;
				
				if(params.overlaycomplete){
					overlaycomplete = params.overlaycomplete;
				}
				else{
					overlaycomplete = this.overlaycomplete;
				}
				
				if(params.mode == "DRAWING_MARKER"){
					MAP_TOOLS.plugin.mousetool.marker({map : params.map, callback: overlaycomplete});
				}
				else if(params.mode == "DRAWING_CIRCLE"){
					MAP_TOOLS.plugin.mousetool.circle({map : params.map, callback: overlaycomplete});
				}
				else if(params.mode == "DRAWING_POLYLINE"){
					MAP_TOOLS.plugin.mousetool.polyline({map : params.map, callback: overlaycomplete});
				}
				else if(params.mode == "DRAWING_POLYGON"){
					MAP_TOOLS.plugin.mousetool.polygon({map : params.map, callback: overlaycomplete});
				}
				else if(params.mode == "DRAWING_RECTANGLE"){
					MAP_TOOLS.plugin.mousetool.rectangle({map : params.map, callback: overlaycomplete});
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
				return MAP_TOOLS.plugin.rangingTool.init(params);
			},
			
			/**
			 * 打开测距工具
			 * @param params{map: map}
			 */
			open : function(params){
				MAP_TOOLS.plugin.rangingTool.open(params);
			},
			
			/**
			 * 关闭测距工具
			 * @param params{map: map}
			 */
			close : function(params){
				MAP_TOOLS.plugin.rangingTool.close(params);
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
				
				var driving = new AMap.Driving({panel: params.panel, policy: AMap.DrivingPolicy.LEAST_DISTANCE, extensions: 'base', hideMarkers: true});
				
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
						
						driving.search(
								MAP_TOOLS.newPoint({map: map, longitude: start_point.longitude, latitude: start_point.latitude}),
								MAP_TOOLS.newPoint({map: map, longitude: end_point.longitude, latitude: end_point.latitude}),
								function(status, result){
							
							if("complete" == status){
								
								var route = result.routes[0];
								
								var steps = route.steps;
								
								for(var i=0; i<steps.length; i++){
									var path = steps[i].path;
									
									for(var j =0; j<path.length; j++){
										drivingRouteResultPoints.push({longitude: path[j].getLng(), latitude: path[j].getLat()});
									}
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