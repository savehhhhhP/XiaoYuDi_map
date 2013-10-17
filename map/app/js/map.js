//医院类
function Hospital() {
    this.name = "未知";
    this.address = "未知";
    this.province = "未知";
    this.times = 0;
    this.lat = 0.00;
    this.lng = 0.00;
}

var mapObj;                  //地图
var markers = new Array();  //存储当前搜索到的医院maker数组
var windowsArr = new Array();//存储当前搜索到的医院信息框数组


//基本地图加载
function mapInit() {
    mapObj = new AMap.Map("iCenter",{
        center:new AMap.LngLat(116.397428,39.90923), //地图中心点   北京
            level:4  //地图显示的比例尺级别
    });
}
/**
 * //根据id 打开搜索结果点tip
 * @param pointid
 * @param thiss
 */
function openMarkerTipById1(pointid, thiss) {

    thiss.style.background = '#CAE1FF';
    windowsArr[pointid].open(mapObj, markers[pointid].getPosition());
}
/**
 * //鼠标移开后点样式恢复
 * @param pointid
 * @param thiss
 */
function onmouseout_MarkerStyle(pointid, thiss) {
    thiss.style.background = "";
}

/**
 * 对省份信息进行修改          short ->long
 */
function formatProvinceL(proName){
    switch(proName){
        case "宁夏":
            return "中国宁夏回族自治区";
            break;
        case "新疆":
            return "中国新疆维吾尔自治区";
            break;
        case "内蒙古":
            return "内蒙古自治区";
            break;
        case "西藏":
            return "中国西藏自治区";
            break;
        case "广西":
            return "中国广西壮族自治区";
        case "澳门":
            break;
        case "台湾":
            break;
        case "香港":
            break;
        case "北京":
        case "重庆":
        case "天津":
        case "上海":
            return proName +"市";
        default :
            return proName+"省";
    }
}
/**
 *  //窗体内容  字符串处理的一个方法
 */
function TipContents( address, times) {
    if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {
        address = "暂无";
    }
    if (times == "" || times == "undefined" || times == null || times == " undefined" ) {
        times = "暂无";
    }
    var str = "&nbsp;&nbsp;" + address + "<br /><p style='color: darkred'>&nbsp;&nbsp;历史就诊次数：" + times +"</p>";
    return str;
}
