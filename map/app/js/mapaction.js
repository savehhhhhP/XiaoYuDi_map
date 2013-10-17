/**
 * Created by Appchina on 13-9-30.
 */
function Print(log){   //测试函数
    console.log(log);
}

//页面加载完成后执行   onload（）
window.onload= function(){
    mapInit();//调用地图加载函数
    var txtInput = document.getElementById("search_text");
    txtInput.onkeypress = getProLocation($scope.location);
}
/**
 * 添加一个省内标记
 * @param proName
 * @param hospitals
 */
function addMarker(proName,hospitals){
    mapObj.clearInfoWindow();  //清除信息窗口
    mapObj.clearOverlays();    //清除覆盖物
    //回复信息框数组和标记点数组
    markers = new Array();
    windowsArr = new Array();
    document.getElementById("result").innerHTML = "";
    var i= 0;
    for(;i<hospitals.length;i++){

        if(hospitals[i].province==proName){         //查找本省内的医院
            //创建一个医院的对象
            var myHospital = new Hospital();
            myHospital.province = formatProvinceL(hospitals[i].province);
            myHospital.name = hospitals[i].hospital;
            myHospital.times = hospitals[i].times;
            getHospPosition(myHospital);            //取得医院地理位置 并且添加标记
        }
    }
    mapObj.setFitView();
}
/**
 * //添加省内的医院标记  和信息窗口
 * @param hospital
 */
function addMarkerInPro(hospital){
    var markerPosition = new AMap.LngLat(hospital.lng,hospital.lat);;
    var marker = new AMap.Marker({
        map:mapObj,
        position:markerPosition,
        offset:new AMap.Pixel(-13,-37), //相对于基点的偏移位置
        icon:"http://www.xiaoyudi.org:3000/map/mapicon.png"
    });
    markers.push(marker);
    marker.setMap(mapObj);  //在地图上添加点

    var infoWindow = new AMap.InfoWindow({
        content:"<h3><font color=\"#00a6ac\">&nbsp;&nbsp;" + hospital.name + "</font></h3>" + TipContents(hospital.address, hospital.times),
        size:new AMap.Size(300, 0),
        autoMove:true,
        offset:new AMap.Pixel(-0,-30)
    });
    windowsArr.push(infoWindow);
    var aa = function (e) {infoWindow.open(mapObj, marker.getPosition());};
    AMap.event.addListener(marker, "click", aa);
    infoWindow.open(mapObj, marker.getPosition());
    //添加结果信息框
    var num = markers.length -  1;
    var resultStr ="";
    resultStr += "<div id='divid" + num + "' onmouseover='openMarkerTipById1(" + num + ",this)' onmouseout='onmouseout_MarkerStyle(" + num + ",this)' " +
        "style=\"font-size: 12px;cursor:pointer;padding:0px 0 4px 2px; border-bottom:1px solid #C1FFC1;\">" +
        "<table><tr><td></td><td style='font-size: 14px;'><h3><font color=\"#00a6ac\">" + hospital.name + "</font></h3>";
    resultStr += TipContents(hospital.address, hospital.times) + "</td></tr></table></div>";

    document.getElementById("result").innerHTML += resultStr;

}
/**
 * //从url 所得Json数据 取得各个医院的位置信息
  * @param hospital
 */
function getHospPosition(hospital){
    var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+hospital.name+"&sensor=true";
    var b = true;
    $.getJSON(                     //使用getJSON方法取得JSON数据
        url,
        function(data){             //解析Json 获得省的坐标范围
            $(data.results).each(function (i, ite) {
                if (isChinaProvince(ite,hospital.province)) {
                    b = false;
                    var a = ite.geometry.location;
                    var lat = a.lat;
                    var lng = a.lng;
                    hospital.address = ite.formatted_address;
                    hospital.lat = lat;
                    hospital.lng = lng;
                    addMarkerInPro(hospital);
                    return null;
                }
            })
        }
    )
}
/**
 * //从url的Json数据  取得有各个省的范围
 * @param position
 */
function getPosition(position){
    var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+position+"&sensor=true";
    $.getJSON(                     //使用getJSON方法取得JSON数据
        url,
        function(data){             //解析Json 获得省的坐标范围
            $(data.results).each(function (i, ite) {
                var company = ite.formatted_address;
                if (company == "中国" + position + "省" ||company == "台湾" || company=="香港" || company == "中国" + position
                    || company=="澳门" || company=="中国宁夏回族自治区" || company=="中国内蒙古自治区" || company=="中国广西壮族自治区"
                    || company=="中国新疆维吾尔自治区" || company=="中国西藏自治区" || company=="中国吉林省吉林") {                        //判断是否为中国的地址
                    var a = ite.geometry.viewport;
                    var neLat = a.northeast.lat;
                    var neLng = a.northeast.lng;
                    var swLat = a.southwest.lat;
                    var swLng = a.southwest.lng;
                    var sw = new AMap.LngLat(swLng, swLat);
                    var ne = new AMap.LngLat(neLng, neLat);
                    toPositon(sw, ne);    //定位视野
                }
            })
            return data;
        }
    )
}
/**
 * 判断获得的json数据中为当前省份的部分
 */
function isChinaProvince(data,provinceName){
    var long_name;
    var short_name;
    var types;
    var arrays = data.address_components;
    var i =0;
    for(;i<arrays.length;i++){
        long_name = arrays[i].long_name;
        short_name = arrays[i].short_name;
        types = arrays[i].types;
        if(types[0] == "administrative_area_level_1" && long_name == provinceName){  //省份信息
            return true;
        }
    }
    return false;
}
/**
 *  //视野定位
 * @param sw  south west
 * @param ne  north east
 */
function toPositon(sw,ne){
    var viewBounds = new AMap.Bounds(sw,ne);
    mapObj.setBounds(viewBounds);
}
