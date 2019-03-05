function getWeek(date) { 
    var week; 
    if(date.getDay() == 0) week = "星期日" 
    if(date.getDay() == 1) week = "星期一" 
    if(date.getDay() == 2) week = "星期二" 
    if(date.getDay() == 3) week = "星期三" 
    if(date.getDay() == 4) week = "星期四" 
    if(date.getDay() == 5) week = "星期五" 
    if(date.getDay() == 6) week = "星期六" 
    return week; 
} 

function timedat(res){   //res 为传入的时间戳   例：1509091800000

    var time = new Date(res);

    var y = time.getFullYear();

   var m = time.getMonth()+1;

   var d = time.getDate();

   return y+'-'+m+'-'+d;    //返回格式  "2017-10-27" 字符串
};

module.exports = getWeek,timedat
