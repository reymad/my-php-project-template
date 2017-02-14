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
