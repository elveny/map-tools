/**
 * baidu map
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
		   				domId: "baidumap",												//地图div元素
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
				scrollWheelZoom = true;
			}
			else{
				scrollWheelZoom = params.scrollWheelZoom;
			}
			
			var mapOptions = {
					minZoom : zoomRange_minZoom, 
					maxZoom : zoomRange_maxZoom
			};
			
			// 创建Map实例
			var map = new BMap.Map(domId, mapOptions);
			// 初始化地图,设置中心点坐标和地图级别
			map.centerAndZoom(this.newPoint({longitude: center_longitude, latitude: center_latitude }), zoom);
			
			if(control_scale){
				map.addControl(new BMap.ScaleControl());
			}
			
			if(control_overviewMap){
				map.addControl(new BMap.OverviewMapControl({isOpen:true}));
			}
			
			if(control_navigation){
				map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT }));
			}
			
			if(control_mapType){
				map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT, mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));
			}
			
			//启用滚轮放大缩小
			if(scrollWheelZoom){
				map.enableScrollWheelZoom();
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
			
			var result = {longitude: center.lng, latitude: center.lat};
			
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
					var point = new BMap.Point(params.point.longitude, params.point.latitude);
					
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
				map.setCenter(params.cityName);
			}
			
			if(params.zoom){
				this.setZoom({map: map, zoom: params.zoom});
			}
			
			return true;
			
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
		 * @param {Object} params {map: map, longitude:118.232, latitude:29.34343}
		 */
		newPoint : function(params){
			if(params){
				return new BMap.Point(params.longitude, params.latitude);
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
			
			var marker = new BMap.Marker(point);
			
			//图标
			if(params.icon != null && params.icon.path != null){
				
				var anchor = null;
				if(params.icon.anchor != null && params.icon.anchor.x != null && params.icon.anchor.y != null){
					anchor = new BMap.Size(params.icon.anchor.x, params.icon.anchor.y);
				}
				
				var imageSize = null;
				if(params.icon.imageSize != null && params.icon.imageSize.width != null && params.icon.imageSize.height != null){
					imageSize = new BMap.Size(params.icon.imageSize.width, params.icon.imageSize.height);
				}
				
				var icon = new BMap.Icon(params.icon.path, 
										new BMap.Size(params.icon.size.width, params.icon.size.height),
										{anchor: anchor, imageSize: imageSize});
				
				marker.setIcon(icon);
				
			}
			
			//信息窗
			if(params.infoWindow != null){
				var infoWindow = this.newInfoWindow(params.infoWindow);
				
				//注册Marker的点击事件
				marker.addEventListener("click", function(){this.openInfoWindow(infoWindow);});
				
				//默认是否打开信息窗（但地图上同一时间只能打开一个信息窗）
				if(params.infoWindow.open != null && params.infoWindow.open){
					
					this.openInfoWindow({map: map, infoWindow: infoWindow, point: point});
					
				}
			}
			
			//标签
			if(params.label != null){
				var label = new BMap.Label();
				
				if(params.label.content != null){
					label.setContent(params.label.content);
				}
				
				if(params.label.offset != null && params.label.offset.x != null && params.label.offset.y != null){
					label.setOffset(new BMap.Size(params.label.offset.x, params.label.offset.y));
				}
				
				marker.setLabel(label);
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
				var point = this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude});
				path.push(point);
			}
			
			var polyline = new BMap.Polyline(path, params.options);
			
			
			return polyline;
		},

		/**
		 * 添加矩形
		 * @param {Object} params
		 * params = { 			
		 			map: map,
		 			points:[{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437},{longitude:118.2347, latitude:29.23437}], //[左上、右上、右下、左下]
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
			
			var path = new Array();
			
			for(var i in points){
				var point = this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude});
				path.push(point);
			}
			
			var rectangle = new BMap.Polygon(path, params.options);
				
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
				var point = this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude});
				path.push(point);
			}
			
			var polygon = new BMap.Polygon(path, params.options);
				
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
			
			var center = this.newPoint({map: params.map, longitude: params.center.longitude, latitude: params.center.latitude});
			var radius = params.radius;
			
			var circle = new BMap.Circle(center, radius, params.options);
				
			return circle;
		},

		/**
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
			
			var label = new BMap.Label(params.content, params.opts);
			
			label.setTitle(params.title);
			
			label.setStyle({
				 color : "red",
				 fontSize : "12px",
				 height : "20px",
				 lineHeight : "20px",
				 fontFamily:"微软雅黑"
			 });
			
			return label;
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
				var infoWindow = new BMap.InfoWindow(params.content, params.opts);
				
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
			
			map.openInfoWindow(params.infoWindow, params.point); //开启信息窗口
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
			map.addOverlay(overlay);
			
			//将标注点添加到全局覆盖物列表中
			if(params.overalyMap == null || params.overalyMap){
				this.overalyMap.put(params.id, overlay);
			}
			
			//将点数组添加到viewPointsMap中
			if(params.viewPointsMap == null || params.viewPointsMap){
				
				//marker
				if(overlay.toString() == "[object Marker]"){
					var viewPoints = new Array();
					viewPoints.push(overlay.getPosition());
					this.viewPointsMap.put(params.id, viewPoints);
				}
				
				//Polyline & Polygon
				if(overlay.toString() == "[object Polyline]" || overlay.toString() == "[object Polygon]"){
					this.viewPointsMap.put(params.id, overlay.getPath());
				}

				//Circle
				if(overlay.toString() == "[object Circle]"){
					var bounds = overlay.getBounds();
					var viewPoints = new Array();
					viewPoints.push(bounds.getSouthWest());
					viewPoints.push(bounds.getNorthEast());
					this.viewPointsMap.put(params.id, viewPoints);
				}
				
				//label
				if(overlay.toString() == "[object Label]"){
					var viewPoints = new Array();
					viewPoints.push(overlay.getPosition());
					this.viewPointsMap.put(params.id, viewPoints);
				}
				
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
		 			map: map,
		 			overlay: overlay
		   }
		 * @return {TypeName} 
		 */
		removeOverlay : function(params){
			if(params.map == null){
				return false;
			}
			
			var map = params.map;
			//将地图上指定编号的覆盖物移除
			map.removeOverlay(params.overlay);
			
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
			
			var map = params.map;
			//将地图上指定编号的覆盖物移除
			map.clearOverlays();
			
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
				
				var viewPoints = new Array();
				
				for(var i in points){
					viewPoints.push(this.newPoint({map: params.map, longitude: points[i].longitude, latitude: points[i].latitude}));
				}
				
				//根据提供的地理区域或坐标设置地图视野
				map.setViewport(viewPoints);
			}
			//否则根据本页面当前地图上的覆盖物来寻找中心点和最佳地图级数
			else if(!this.viewPointsMap.isEmpty()){
				
				var viewPoints = new Array();
				
				var values = this.viewPointsMap.values();
				for(var i in values){
					var points = values[i];
					for(var j in points){
						viewPoints.push(points[j]);
					}
				}
				
				//根据提供的地理区域或坐标设置地图视野
				map.setViewport(viewPoints);
			}
			//如果以上两种都没找到，则根据地图上所有的覆盖物来寻找中心点和最佳地图级数
			else{
				
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
							southWest: {longitude: bssw.lng, latitude: bssw.lat}, 
							northEast:{longitude: bsne.lng, latitude: bsne.lat}
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
				map.addEventListener(params.eventName, params.callback);
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
			
			var cityName = params.cityName;
			var keyword = params.keyword;
			
			var local ;
			if(cityName){
				local = new BMap.LocalSearch(cityName, {renderOptions: params.renderOptions});
			}
			else{
				local = new BMap.LocalSearch(map, {renderOptions: params.renderOptions});
			}
			
			if(params.pageCapacity != null){
				local.setPageCapacity(params.pageCapacity);
			}
			
			if(params.searchCompleteCallback != null){
				local.setSearchCompleteCallback(params.searchCompleteCallback);
			}
			
			local.search(keyword);
			
			return local;
			
		},

		geocoder : {
			
			geocoderObj : null,
			/**
			 * 初始化地理服务
			 * @param 
			 */
			init : function(){
				if(this.geocoderObj == null){
					this.geocoderObj = new BMap.Geocoder();
				}
				
				return this.geocoderObj;
			},
			
			/**
			 * 地址解析
			 * @param {Object} params : {address: "重庆市幸福广场", cityName:"重庆", callback: callbackfunction}
			 */
			getPoint : function(params){
				
				var myGeo = this.init();
				
				myGeo.getPoint(params.address, params.callback, params.cityName);

			},
			
			/**
			 * 逆地理解析
			 * @param {Object} params : {point: {longitude: 118.2563, latitude:29.2698}, callback: callbackfunction}
			 */
			getLocation : function(params){
				
				var myGeo = this.init();
				
				myGeo.getLocation(MAP_TOOLS.newPoint({longitude: params.point.longitude, latitude: params.point.latitude}), params.callback);

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
							        markerOptions:BMAP_DRAWING_MARKER,						//点的样式
							        circleOptions: BMAP_DRAWING_CIRCLE, 					//圆的样式
							        polylineOptions: BMAP_DRAWING_POLYLINE, 				//线的样式
							        polygonOptions: BMAP_DRAWING_POLYGON, 					//多边形的样式
							        rectangleOptions: BMAP_DRAWING_RECTANGLE  				//矩形的样式
			 					},
			  					overlaycomplete: overlaycompleteFunction
			  				}

			 */
			init : function(params){

				if(params.map == null){
					return null;
				}
				
				var map = params.map;
				
				var drawingManager = new BMapLib.DrawingManager(map, params.options);
					
				if(params.overlaycomplete != null){
					drawingManager.addEventListener('overlaycomplete', params.overlaycomplete);
				}
				
				return drawingManager;
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			open : function(params){
				params.drawingManager.open();
			},
			
			/**
			 * 
			 * @param params {map: map, drawingManager : drawingManager}
			 */
			close : function(params){
				params.drawingManager.close();
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
				if(this.distanceToolObj == null){
					this.distanceToolObj = new BMapLib.DistanceTool(params.map);
				}
				
				return this.distanceToolObj;
			},
			
			/**
			 * 打开测距工具
			 * @param params{map: map}
			 */
			open : function(params){
				var distanceToolObj = this.init(params);
				distanceToolObj.open();
			},
			
			/**
			 * 关闭测距工具
			 * @param params{map: map}
			 */
			close : function(params){
				var distanceToolObj = this.init(params);
				distanceToolObj.close();
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
			 	renderOptions:{
			 		map: map,
			 		panel: domId,   //类型：String|HTMLElement。结果列表的HTML容器id或容器元素，提供此参数后，结果列表将在此容器中进行展示。此属性对LocalCity无效。
			 		selectFirstResult: true,	//类型：Boolean。是否选择第一个检索结果。此属性仅对LocalSearch有效。
			 		autoViewport: true,		//类型：Boolean。检索结束后是否自动调整地图视野。此属性对LocalCity无效。
			 		highlightMode: BMAP_HIGHLIGHT_STEP 	//类型：HighlightModes。驾车结果展现中点击列表后的展现策略。（BMAP_HIGHLIGHT_STEP或BMAP_HIGHLIGHT_ROUTE）
			 	}
			 }
			 * @return {DrivingRoute} 
			 * 
			 */
			newDrivingRoute : function(params){
				if(params.map == null){
					return null;
				}
				
				var driving = new BMap.DrivingRoute(params.map, {renderOptions: params.renderOptions});
				
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
				var driving = this.newDrivingRoute({map: params.map});
				
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
					
					var distance = map.getDistance(start_point, end_point);
					
					if(distance > 20){
						
						driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
						
						driving.setSearchCompleteCallback(function(results){
							
							if(driving.getStatus() == BMAP_STATUS_SUCCESS){
								var plan = results.getPlan(0);
							
								var route = plan.getRoute(0);
								var path = route.getPath();
								
								for(var i =0; i<path.length; i++){
									drivingRouteResultPoints.push(path[i]);
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
						
						driving.search(start_point, end_point);
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


