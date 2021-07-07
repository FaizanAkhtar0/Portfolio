$(document).ready(function() {
    $("#skill-progress-bars").hide();
    var $el = $("#education-section")
    var bottom = $el.position().top + $el.outerHeight(true);
    var one_third_height = bottom - (Math.ceil(bottom / 3) * 0.6);
    $(window).scroll(function() {
        if($(window).scrollTop() > one_third_height) {
            $("#skill-progress-bars").show(1500);
        }
    });
});