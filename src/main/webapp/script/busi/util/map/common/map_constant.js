/**地图常量**/
function MAP(){}

/**mapbar地图常量**/
MAP.CONSTANT = {};

/**地图操作模式常量**/
MAP.CONSTANT.MODE = {};

/**展示：将参数中的数据按照数据类型展示到地图上**/
MAP.CONSTANT.MODE.SHOW = 'show';

/**返回：根据参数中的数据类型，返回给调用页面经纬度数据**/
MAP.CONSTANT.MODE.BACK = 'back';

/**数据类型**/
MAP.CONSTANT.DATATYPE = {};
/**数据类型：点**/
MAP.CONSTANT.DATATYPE.POINT = 'point';
/**数据类型：线**/
MAP.CONSTANT.DATATYPE.POLYLINE = 'polyline';
/**数据类型：四边形**/
MAP.CONSTANT.DATATYPE.RECTANGLE = 'rectangle';
/**数据类型：多边形**/
MAP.CONSTANT.DATATYPE.POLYGON = 'polygon';
/**数据类型：圆**/
MAP.CONSTANT.DATATYPE.CIRCLE = 'circle';
/**数据类型：所有**/
MAP.CONSTANT.DATATYPE.ALL = 'all';

/**mapbar地图常量：默认信息（默认中心点经纬度，默认地图显示级别）**/
MAP.CONSTANT.DEFAULT = {};
MAP.CONSTANT.DEFAULT.CENTER_LONGITUDE = 104.06497114;
MAP.CONSTANT.DEFAULT.CENTER_LATITUDE = 30.65850480;
MAP.CONSTANT.DEFAULT.ZOOMLEVEL = 10;
