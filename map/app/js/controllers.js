'use strict';

/* Controllers */


function MapListCtrl($scope, $http) {
    //取得省份的 shortname
    $http.get('map/province.json').success(function(data) {
        var arry = new Array(6);
        arry[0]=data.slice(0,6);
        arry[1]=data.slice(6,12);
        arry[2]=data.slice(12,18);
        arry[3]=data.slice(18,24);
        arry[4]=data.slice(24,30);
        arry[5]=data.slice(30,34);
        $scope.pros = arry;                 //获取省份JSON数据
    });
    //取得医院的数据
    $http.get('map/hospital_time.json').success(function(data) {
        $scope.hospitals = data;            //获取医院JSON数据
    });
    /**
     * 点击搜索响应函数
     */
    $scope.makerTo = function () {
        getProLocation($scope.location);
    }


    /**
     * 查询position的省份信息
     * @param position
     */
    function getProLocation(position){
        var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+position+"&sensor=true";
        $.getJSON(                     //使用getJSON方法取得JSON数据
            url,
            function(data){             //解析Json 获得省的坐标范围
                $(data.results).each(function (i, ite) {
                    var long_name;
                    var short_name;
                    var types;
                    var arrays = ite.address_components;
                    var neLat = ite.geometry.viewport.northeast.lat;
                    var neLng = ite.geometry.viewport.northeast.lng;
                    var swLat = ite.geometry.viewport.southwest.lat;
                    var swLng = ite.geometry.viewport.southwest.lng;
                    var provinceName;
                    var i =0;
                    for(;i<arrays.length;i++){
                        long_name = arrays[i].long_name;
                        short_name = arrays[i].short_name;
                        types = arrays[i].types;
                        if(types[0] == "administrative_area_level_1" ){
                            provinceName = short_name;
                        }
                        if(types[0] == "country" && short_name == "CN"){  //如果是中国的省
                            $scope.yourProvince = provinceName;
                            //视野定位到省的范围
                            var sw = new AMap.LngLat(swLng, swLat);
                            var ne = new AMap.LngLat(neLng, neLat);
                            toPositon(sw, ne);    //定位视野
                            addMarker_search(provinceName,$scope.hospitals);//在省内创建标记
                        }
                    }
                })
            }
        )
    }

    //添加一个省内的标记
    function addMarker_search(proName,hospitals){
        mapObj.clearInfoWindow();  //清除信息窗口
        mapObj.clearOverlays();    //清除覆盖物
        //回复信息框数组和标记点数组
        markers = new Array();
        windowsArr = new Array();
        document.getElementById("result").innerHTML = "";
        var i= 0;
        for(;i<hospitals.length;i++){
            var relt = proName.match(hospitals[i].province);
            if(relt!=null){         //查找本省内的医院
                //创建一个医院的对象
                var myHospital = new Hospital();
                myHospital.province = proName;
                myHospital.name = hospitals[i].hospital;
                myHospital.times = hospitals[i].times;
                getHospPosition(myHospital);            //取得医院地理位置 并且添加标记
                Print(myHospital);
            }
        }
        mapObj.setFitView();
    }



    //点击省响应
    $scope.btnOnProvince = function(text){  //text为当前点击省份信息
        getPosition(text);   //视野定位到省的范围
        addMarker(text,$scope.hospitals);//在省内创建标记
    }
}
