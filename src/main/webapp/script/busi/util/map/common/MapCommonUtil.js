var MapCommonUtil = {
		// 百度经纬度转换常量
		BPI : 3.14159265358979324 * 3000.0 / 180.0,
		/**
		 * 84坐标系
		 */
		COORDINATE_TYPE_84 : 1,
		/**
		 * 02坐标系
		 */
		COORDINATE_TYPE_02 : 2,
		/**
		 * 百度地图偏移坐标系（js版）
		 */
		COORDINATE_TYPE_BDJS : 3,
		
		/**
		 * 02经纬度转百度经纬度
		 * 
		 * @param gg_lon
		 *            02坐标系经度
		 * @param gg_lat
		 *            02坐标系纬度
		 * @return {百度坐标系经度, 百度坐标系纬度}
		 */
		bd_encrypt : function(gg_lon, gg_lat){
			gg_lon = parseFloat(gg_lon);
			gg_lat = parseFloat(gg_lat);
			
			var bd_lat;
			var bd_lon;
			var x = gg_lon, y = gg_lat;
			var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.BPI);
			var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.BPI);
			bd_lon = z * Math.cos(theta) + 0.0065;
			bd_lat = z * Math.sin(theta) + 0.006;
			
			bd_lon = parseFloat(bd_lon);
			bd_lat = parseFloat(bd_lat);
			
			var result = new Array();
			result[0] = bd_lon;
			result[1] = bd_lat;
			
			return result;
		},
		/**
		 * 百度经纬度转02经纬度
		 * 
		 * @param bd_lon
		 *            百度坐标系经度
		 * @param bd_lat
		 *            百度坐标系纬度
		 * @return {02坐标系经度, 02坐标系纬度}
		 */
		bd_decrypt : function(bd_lon, bd_lat){
			bd_lon = parseFloat(bd_lon);
			bd_lat = parseFloat(bd_lat);
			
			var x = bd_lon - 0.0065, y = bd_lat - 0.006;
			var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.BPI);
			var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.BPI);
			var gg_lon = z * Math.cos(theta);
			var gg_lat = z * Math.sin(theta);
			
			gg_lon = parseFloat(gg_lon);
			gg_lat = parseFloat(gg_lat);
				
			var result = new Array();
			result[0] = gg_lon;
			result[1] = gg_lat;
			
			return result;
		},
		
		/**
		 * 经纬度转换
		 * @param pointArr 需要转换的point数组 [{longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}...]
		 * @param from 来源经纬度坐标系类型
		 * @param to 转换后的经纬度坐标系类型
		 * @returns 转换后的point数组
		 */
		convert : function(pointArr, from, to){

			if(pointArr == null || typeof(pointArr) == "undefined"){
				return pointArr;
			}
			
			var result = new Array();
			
			switch(from){
				case this.COORDINATE_TYPE_84:{
					
					switch(to){
						case this.COORDINATE_TYPE_84:{
							result = pointArr;
							break;
						}
						case this.COORDINATE_TYPE_02:{
							result = Wgs2Mars.latlon84To02(pointArr);
							break;
						}
						case this.COORDINATE_TYPE_BDJS:{
							
							/**
							 * 84转百度步骤:
							 *  1) 84转02
							 *  2) 02转百度
							 */
							
							// 1) 84转02
							var lonlat02Arr = this.convert(pointArr, this.COORDINATE_TYPE_84, this.COORDINATE_TYPE_02);
							
							// 2) 02转百度
							result = this.convert(lonlat02Arr, this.COORDINATE_TYPE_02, this.COORDINATE_TYPE_BDJS);
							
							break;
						}
						default:
							break;
					}
					
					break;
				}
				case this.COORDINATE_TYPE_02:{
					
					switch(to){
						case this.COORDINATE_TYPE_84:{
							result = Mars2Wgs.latlon02To84(pointArr);
							break;
						}
						case this.COORDINATE_TYPE_02:{
							result = pointArr;
							break;
						}
						case this.COORDINATE_TYPE_BDJS:{
							
							for(var i=0; i<pointArr.length; i++){
								var lon = pointArr[i].longitude;
								var lat = pointArr[i].latitude;
								
								var lonlat_bd = this.bd_encrypt(parseFloat(lon), parseFloat(lat));
								
								result.push({longitude: lonlat_bd[0], latitude: lonlat_bd[1]});
							}
							
							break;
						}
						default:
							break;
					}
					
					break;
				}
				case this.COORDINATE_TYPE_BDJS:{
					
					switch(to){
						case this.COORDINATE_TYPE_84:{
							/**
							 * 转84步骤:
							 *  1) 百度转02
							 *  2) 02转84
							 */
							
							// 1) 百度转02
							var lonlat02Arr = this.convert(pointArr, this.COORDINATE_TYPE_BDJS, this.COORDINATE_TYPE_02);
							
							// 2) 02转84
							result = this.convert(lonlat02Arr, this.COORDINATE_TYPE_02, this.COORDINATE_TYPE_84);
							
							break;
						}
						case this.COORDINATE_TYPE_02:{
							
							for(var i=0; i<pointArr.length; i++){
								var lon = pointArr[i].longitude;
								var lat = pointArr[i].latitude;
								
								var lonlat_bd = this.bd_decrypt(parseFloat(lon), parseFloat(lat));
								
								result.push({longitude: lonlat_bd[0], latitude: lonlat_bd[1]});
							}
							
							break;
						}
						case this.COORDINATE_TYPE_BDJS:{
							result = pointArr;
							break;
						}
						default:
							break;
					}
					
					break;
				}
				default:
					break;
			}
			
			
			return result;
		},
		
		/**
		 * 计算两点之间的距离
		 */
		distance : {
			/**
			 * 经纬度转换成三角函数中度分表形式
			 * @param d
			 * @returns {Number}
			 */
			rad : function(d){
				return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
			},
			
			/**
			 * 
			 * @param lat1 点1的纬度
			 * @param lng1 点1的经度
			 * @param lat2 点2的纬度
			 * @param lng2 点2的经度
			 * @returns {Number}
			 */
			distance : function(lat1,lng1,lat2,lng2){
				var radLat1 = this.rad(lat1);
			    var radLat2 = this.rad(lat2);
			    var a = radLat1 - radLat2;
			    var  b = rad(lng1) - rad(lng2);
			    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
			    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
			    s = s *6378.137 ;// EARTH_RADIUS;
			    s = Math.round(s * 10000) / 10000; //输出为公里
			    s = s*1000;  //输出为米
			    //s=s.toFixed(4);
			    return s;
			}
		}
		
};
