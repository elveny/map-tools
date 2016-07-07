

var Wgs2Mars = {
		PI : 3.141592653589793,
		convert_a : function(paramDouble){
			
			paramDouble = parseFloat(paramDouble);
			
			var i = 0;
			if (paramDouble < 0.0) {
				paramDouble = -paramDouble;
				i = 1;
			}
			var l = parseInt(paramDouble / (2*this.PI));
			var d1 = paramDouble - l * (2*this.PI);
			
			if (d1 > this.PI) {
				d1 -= this.PI;
				i = (i == 1 ? 0 : 1);
			}
			
			paramDouble = d1;
			
			var d2 = paramDouble;
			var d3 = paramDouble;
			
			d1 *= d1;
			
			d3 *= d1;
			
			d2 -= d3 * 0.166666666666667;
			d3 *= d1;
			d2 += d3 * 0.00833333333333333;
			d3 *= d1;
			d2 -= d3 * 0.000198412698412698;
			d3 *= d1;
			d2 += d3 * 2.75573192239859E-006;
			d3 *= d1;
			d2 -= d3 * 2.50521083854417E-008;
			if (i == 1){
				d2 = -d2;
			}
			return d2;
		
		},
		convert_a_1 : function(paramDouble1, paramDouble2){
			paramDouble1 = parseFloat(paramDouble1);
			paramDouble2 = parseFloat(paramDouble2);
			
			var d = 300.0 
						+ 1.0 * paramDouble1 
						+ 2.0 * paramDouble2 
						+ 0.1 * paramDouble1 * paramDouble1 
						+ 0.1 * paramDouble1 * paramDouble2 
						+ 0.1 * Math.sqrt(Math.sqrt(paramDouble1 * paramDouble1));
			
			d += (20.0 * this.convert_a(18.849555921538759 * paramDouble1) 
					+ 20.0 * this.convert_a((2*this.PI) * paramDouble1))
				 * 0.6667;
			
			d += (20.0 * this.convert_a(this.PI * paramDouble1) 
					+ 40.0 * this.convert_a(this.PI * paramDouble1 / 3.0))
				 * 0.6667;
			
			d += (150.0 * this.convert_a(this.PI * paramDouble1 / 12.0) 
					+ 300.0 * this.convert_a(this.PI * paramDouble1 / 30.0))
				 * 0.6667;
			
			return d;
		},
		convert_b : function(paramDouble1, paramDouble2){
			paramDouble1 = parseFloat(paramDouble1);
			paramDouble2 = parseFloat(paramDouble2);
			
			d = -100.0 
						+ 2.0 * paramDouble1 
						+ 3.0 * paramDouble2 
						+ 0.2 * paramDouble2 * paramDouble2 
						+ 0.1 * paramDouble1 * paramDouble2 
						+ 0.2 * Math.sqrt(Math.sqrt(paramDouble1 * paramDouble1));
			
			d += (20.0 * this.convert_a(18.849555921538759 * paramDouble1) 
					+ 20.0 * this.convert_a((2*this.PI) * paramDouble1))
				 * 0.6667;
			
			d += (20.0 * this.convert_a(this.PI * paramDouble2) 
					+ 40.0 * this.convert_a(this.PI * paramDouble2 / 3.0))
				 * 0.6667;
			
			d += (160.0 * this.convert_a(this.PI * paramDouble2 / 12.0) 
					+ 320.0 * this.convert_a(this.PI * paramDouble2 / 30.0))
				 * 0.6667;
			
			return d;
		},
		convert_c : function(paramDouble1, paramDouble2){
			paramDouble1 = parseFloat(paramDouble1);
			paramDouble2 = parseFloat(paramDouble2);
			
			var d1 = this.convert_a(paramDouble1 * this.PI / 180.0);
			
			var d2 = Math.sqrt(1.0 - 0.00669342 * d1 * d1);
			
			d2 = paramDouble2 * 180.0 / (6378245.0 / d2 * Math.cos(paramDouble1 * this.PI / 180.0) * this.PI);
			return d2;
		},
		convert_d : function(paramDouble1, paramDouble2){
			paramDouble1 = parseFloat(paramDouble1);
			paramDouble2 = parseFloat(paramDouble2);
			
			var d1 = this.convert_a(paramDouble1 * this.PI / 180.0);
			
			var d2 = 1.0 - 0.00669342 * d1 * d1;
			
			var d3 = 6335552.7273521004 / (d2 * Math.sqrt(d2));
			
			return paramDouble2 * 180.0 / (d3 * this.PI);
		},
		convert : function(paramDouble1, paramDouble2){
			paramDouble1 = parseFloat(paramDouble1);
			paramDouble2 = parseFloat(paramDouble2);
			
			var result = new Array();
			
			var d1 = this.convert_a_1(paramDouble1 - 105.0, paramDouble2 - 35.0);
			
			var d2 = this.convert_b(paramDouble1 - 105.0, paramDouble2 - 35.0);
			
			result[0] = (paramDouble1 + this.convert_c(paramDouble2, d1));
			
			result[1] = (paramDouble2 + this.convert_d(paramDouble2, d2));
			
			return result;
		},
		
		/**
		 * 经纬度转换：84坐标系转02坐标系
		 * @param pointArr 需要转换的point数组 [{longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}, {longitude:119.3322, latitude:29.32324}...]
		 * @returns 转换后的point数组
		 */
		latlon84To02 : function(pointArr){
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
						
						var afterLonlat = this.convert(lon,lat);
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
