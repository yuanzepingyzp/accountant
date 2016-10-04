var app=angular.module('myapp',[]);
//定义柱状图
app.directive('bar', function() {  
    return {  
        scope: {  
            id: "@",  
            legend: "=",  
            item: "=",  
            data: "="  
        },
        restrict: 'E',  
        template: '<div style="height:400px;"></div>',  
        replace: true,  
        link: function($scope,element, attrs, controller) {
            $scope.$watch(function(scope){return scope.data},function(newVal){
                var option = {  
                // 提示框，鼠标悬浮交互时的信息提示  
                tooltip: {  
                    show: true,  
                    trigger: 'item',
                    formatter:'营业额<br>{b0}: {c0}'+'万元'
                }, 
                color:['rgb(150,50,70)','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                // 图例  
                legend: {  
                    data: $scope.legend
                },  
                // 横轴坐标轴  
                xAxis: [{ 
                    name:'月',
                    type: 'category',  
                    data: $scope.item
                }],  
                // 纵轴坐标轴  
                yAxis: [{  
                    name:'万元',
                    type: 'value'  
                }],  
                // 数据内容数组  
                series: function(){  
                    var serie=[];  
                    for(var i=0;i<$scope.legend.length;i++){ 
                            var item = {  
                            name : $scope.legend[i],  
                            type: 'bar',  
                            data: $scope.data[i],
                            barWidth:20
                        };  
                        serie.push(item);  
                    }  
                    return serie;  
                }()  
            }; 
       myChart.setOption(option);
    },true);
            var myChart = echarts.init(document.getElementById($scope.id),'macarons');  
            window.addEventListener("resize",function(){
                    myChart.resize();
          });
        }  
    };  
}); 
//定义饼状图
app.directive('pie', function() {  
    return {  
        scope: {  
            id: "@",  
            pielegend: "=",   
            piedata: "="  
        },
        restrict: 'E',  
        template: '<div style="height:400px;"></div>',  
        replace: true,  
        link: function($scope,element, attrs, controller) {
            $scope.$watch(function(scope){return scope.piedata},function(newVal){
                var option = {  
                // 提示框，鼠标悬浮交互时的信息提示  
                tooltip: {  
                    show: true,  
                    trigger: 'item',
                    formatter:"{a}<br/>{b}: {c}"+'万元'+"({d}%)"
                }, 
                color:['rgb(150,50,70)','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                // 图例  
                legend: {  
                    data: $scope.pielegend
                },  
                // 数据内容数组  
                series: [{
                        name : '销售份额',  
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                    label: {
                    normal: {
                        show: false,
                        position: 'center'
                        },
                    emphasis: {
                        show: true,
                        textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                                    }
                                }
                            },  
                    labelLine: {
                        normal: {
                        show: false
                        }
                            },
                        data: $scope.piedata
                }]                 
            }; 
       myChart.setOption(option);
    },true);
            var myChart = echarts.init(document.getElementById($scope.id),'macarons');  
            window.addEventListener("resize",function(){
                    myChart.resize();
          });
        }  
    };  
});  
//定义长按事件指令
app.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('touchstart', function(evt) {
				$scope.longPress = true;
				$timeout(function() {
					if ($scope.longPress) {
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 600);
			});
            $elm.bind('touchmove',function(evt){
                $scope.longPress=false;
            })
			$elm.bind('touchend', function(evt) {
				$scope.longPress = false;
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	};
})
//定义过滤器
app.filter("debt",function(){
    return function(input){
        var out=[];
        for(var i=0;i<input.length;i++){
            if(input[i].category=='order'&&input[i].income){
                out.push(input[i]);
            }else if(input[i].category=='purchase'&&input.outcome){
                out.push(input[i]);
            }else if(input[i].category=='sell'&&input[i].number*input[i].price-input[i].income){
                out.push(input[i]);
            }else if(input[i].category=='buy'&&input[i].number*input[i].price-input[i].outcome){
                 out.push(input[i]);
            }
        }
        return out;
    }
})
//定义柱状图过滤器
app.filter("getBar",function(){
    return function(input){
       var out=[];
        var totalArray=[0,0,0,0,0,0,0,0,0,0,0,0];
        for(var i=0;i<input.length;i++){
              var j=input[i].time.getMonth();
                    totalArray[j]+=input[i].price*input[i].number/10000;
        }
        out.push(totalArray);
    return out;
    }  
})
//定义饼状图过滤器
app.filter("getPie",function(){
    return function(input){
        var out=[];
        for(var i=0;i<input.length;i++){
            for(var j=0;j<out.length;j++){
                if(out[j].name==input[i].name){
                    out[j].value+=input[i].price*input[i].number/10000;
                }else{
                    continue;
                }
            }
            var newobj={};
                newobj.name=input[i].name;
                newobj.value=input[i].price*input[i].number/10000;
                out.push(newobj);
        }
        return out;
    }
})
//定义客户过滤器
app.filter("customerList",function(){
    return function(input){
        var out=[];
        for(var i=0;i<input.length;i++){
            if(input[i].customer){
                out.push(input[i]);
            }
        }
        return out;
    }
})

//定义去客户重复过滤器
app.filter("uniquec",function(){
    return function(input){
        var out=[];
        var unique=true;
        for(var i=0;i<input.length;i++){
            for(var j=0;j<out.length;j++){
                if(out[j].customer==input[i].customer){
                    unique=false;
                   break;
                }else{
                    unique=true;
                     continue;
                }
            }
            if(unique){
                out.push(input[i]);
            }else{
                continue;
            }
            
        }
        return out;
    }
})
//定义去产品重复过滤器
app.filter("uniquep",function(){
    return function(input){
        var out=[];
        var unique=true;
        for(var i=0;i<input.length;i++){
            for(var j=0;j<out.length;j++){
                if(out[j].name==input[i].name){
                    unique=false;
                   break;
                }else{
                    unique=true;
                     continue;
                }
            }
            if(unique){
                out.push(input[i]);
            }else{
                continue;
            }
            
        }
        return out;
    }
})
//控制器
app.controller('myctrl',function($scope,$filter,$http){
//    获取数据
    if(localStorage.getItem("jsondata")){
        $scope.records=JSON.parse(localStorage.getItem("jsondata")); 
        for(var x=0;x<$scope.records.length;x++){
            $scope.records[x].time=new Date($scope.records[x].time);
        }
    }else{
        $scope.records=[];
    }
    
      $scope.selldate=new Date();
     $scope.year=$scope.selldate.getFullYear();
 //更新柱状图数据
    $scope.updateChart=function(){
         $scope.legend=['营业额'];
         $scope.item=[1,2,3,4,5,6,7,8,9,10,11,12];
        $scope.data=$filter('filter')($scope.records,{time:$scope.year});
        $scope.data=$filter('filter')($scope.data,{category:'sell'});
        $scope.data=$filter('getBar')($scope.data);
    }
     $scope.updateChart(); 
//更新饼状图数据
    $scope.updatePie=function(){
        $scope.piedata=$filter('filter')($scope.records,{time:$scope.year});
        $scope.piedata=$filter('filter')($scope.piedata,{category:'sell'});
        $scope.piedata=$filter('getPie')($scope.piedata);
        $scope.pielegend=[];
        for(var i=0;i<$scope.piedata.length;i++){
            $scope.pielegend.push($scope.piedata[i].name);
        }
    }
    $scope.updatePie();
  //切换按钮
   $scope.state1="active";
   $scope.state2="";
   $scope.state3="";
   $scope.state4="";
   $scope.state5="";
   $scope.state6="";
$scope.changeClass1=function(){
    $scope.state1="active";
   $scope.state2="";
   $scope.state3="";
   $scope.state4="";
   $scope.state5="";
   $scope.state6="";
}
   $scope.changeClass2=function(){
    $scope.state1="";
   $scope.state2="active";
   $scope.state3="";
   $scope.state4="";
       $scope.state5="";
   $scope.state6="";
}
$scope.changeClass3=function(){
    $scope.state1="";
   $scope.state2="";
   $scope.state3="active";
   $scope.state4="";
    $scope.state5="";
   $scope.state6="";
}
$scope.changeClass4=function(){
    $scope.state1="";
   $scope.state2="";
   $scope.state3="";
   $scope.state4="active";
    $scope.state5="";
   $scope.state6="";
}
$scope.changeClass5=function(){
    $scope.state1="";
   $scope.state2="";
   $scope.state3="";
   $scope.state4="";
    $scope.state5="active";
   $scope.state6="";
}
$scope.changeClass6=function(){
    $scope.state1="";
   $scope.state2="";
   $scope.state3="";
   $scope.state4="";
    $scope.state5="";
   $scope.state6="active";
}
//change charts
$scope.selectedclass1="selected";
//add sellRecords
$scope.addSellRecords=function(){
    $scope.records.unshift({
        time:function(){
            var date=new Date();
            return date;
        }(),
        customer:"",
        name:"",
        price:"",
        number:"",
        income:"",
        outcome:"",
        editable:false,
        category:"order",
    })
}
$scope.printpage=function(){
    window.print();
}
   
window.onbeforeunload=function(){
    for(var i=0;i<$scope.records.length;i++){
        var current=$scope.records;
        current[i].editable=true;
    }
    localStorage.setItem("jsondata",JSON.stringify($scope.records));
}
});

