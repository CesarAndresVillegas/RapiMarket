angular.module('starter')
.filter('splitrow', function(){
    return function (input, count){
        var out = [];
            if(typeof input === "object"){
                for (var i=0, j=input.length; i < j; i+=count) {
                    //out.push(input.slice(i, i+count));
                    out.push(input);
                }
            }
        return a;
    }
});