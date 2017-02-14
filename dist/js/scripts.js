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

/**
 * Created by jrey on 25/01/2017.
 */
// http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/

/*
function getCustomer(customerId){
    var d = $.Deferred();
    $.post(
        "/echo/json/",
        {json: JSON.stringify({firstName: "Jose", lastName: "Romaniello", ssn: "123456789"}),
            delay: 4}
    ).done(function(p){
        d.resolve(p);
    }).fail(d.reject);
    return d.promise();
}

function getPersonAddressBySSN(ssn){
    return $.post("/echo/json/", {
        json: JSON.stringify({
            ssn: "123456789",
            address: "Siempre Viva 12345, Springfield" }),
        delay: 2
    }).pipe(function(p){
        return p.address;
    });
}


function load(){
    $.blockUI({message: "Loading..."});
    var loadingCustomer = getCustomer(123)
        .done(function(c){
            $("span#firstName").html(c.firstName);
        });

    var loadingAddress = getPersonAddressBySSN("123456789")
        .done(function(address){
            $("span#address").html(address);
        });

    $.when(loadingCustomer, loadingAddress)
        .done($.unblockUI);
}

load();
*/

/**
 * Created by jrey on 19/09/2016.
 */
$(document).ready(function(){

    console.log('app.js');

    // comment here
    fun();

    tellWidth($('.tellWidth'));

    //
    var to = setInterval(function(){

        $('div.transition')
            .slideToggle('slow')
            .promise()
            .done(function(){
                console.log('done!!');
            });

    }, 2000);


    $.blockUI({message: 'Click anywhere to stop loading...'});


});

$(window).on('resize', function(){

    $.each($('.tellWidth'), function(){
        tellWidth($(this));
    });

});

$(window).on('click', function(){
    $.unblockUI();
});

$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
