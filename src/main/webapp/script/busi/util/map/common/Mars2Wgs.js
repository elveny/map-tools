var Mars2Wgs = {
		reversal : function(lon, lat){
			lon = parseFloat(lon);
			lat = parseFloat(lat);
			
			var result = new Array();
			
			var latlon = Wgs2Mars.convert(lon, lat);
			
			var lon1 = latlon[0];
			var lat1 = latlon[1];
			
			result[0] = lon - (lon1 - lon);
			result[1] = lat - (lat1 - lat);
			
			return result;
		},
		
		/**
		 * 经纬度转换：02坐标系转84坐标系
		 * @param pointArr 需要转换的point数组 [{longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}...]
		 * @returns 转换后的point数组
		 */
		latlon02To84 : function(pointArr){
			//空值判断
			if(pointArr == null || typeof(pointArr) == "undefined"){
				return pointArr;
			}
			
			var result = new Array();
			
			//解析经纬度串
			var len = pointArr.length;
			
			for(var i=0; i<len; i++){
				//异常经纬度判断，目前是将异常经纬度直接返回
				if(pointArr[i] == null || typeof(pointArr[i]) == "undefined"){
					result.push(pointArr[i]);
				}				
				else{
					var longitude = pointArr[i].longitude;
					var latitude = pointArr[i].latitude;
					if(longitude != null && typeof(longitude) != "undefined"
						&& latitude != null && typeof(latitude) != "undefined"){
						
						var lon = parseFloat(longitude);
						var lat = parseFloat(latitude);
						
						var afterLonlat = this.reversal(lon,lat);
						result.push({longitude: afterLonlat[0], latitude: afterLonlat[1]});
					}
					else{
						result.push(pointArr[i]);
					}
						
				}
			}
			
			return result;
		}

}; 
