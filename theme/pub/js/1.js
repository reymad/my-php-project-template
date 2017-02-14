/**
 * Created by jrey on 20/01/2017.
 */
var fun = function(){
    console.log('this is fun');
};
/* Nos devuelve el ancho en % de un elemento con respecto a su parent() */
var tellWidth = function(obj){
    var f = obj.width() / obj.parent().width() * 100;
    f += '%';
    obj.html(f);
};
