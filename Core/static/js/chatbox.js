showChat();

$('#prime').click(function() {
  toggleFab();
});


//Toggle chat and links
function toggleFab() {
  $('.prime').toggleClass('zmdi-comment-outline');
  $('.prime').toggleClass('zmdi-close');
  $('.prime').toggleClass('is-active');
  $('.prime').toggleClass('is-visible');
  $('#prime').toggleClass('is-float');
  $('.chat').toggleClass('is-visible');
  $('.fab').toggleClass('is-visible');

}

$('#chat_fullscreen_loader').click(function(e) {
    $('.fullscreen').toggleClass('zmdi-window-maximize');
    $('.fullscreen').toggleClass('zmdi-window-restore');
    $('.chat').toggleClass('chat_fullscreen');
    $('.fab').toggleClass('is-hide');
    $('.header_img').toggleClass('change_img');
    $('.img_container').toggleClass('change_img');
    $('.chat_header').toggleClass('chat_header2');
    $('.fab_field').toggleClass('fab_field2');
    $('.chat_converse').toggleClass('chat_converse2');
    //$('#chat_converse').css('display', 'none');
    //$('#chat_body').css('display', 'none');
    //$('#chat_form').css('display', 'none');
    //$('.chat_login').css('display', 'none');
    //$('#chat_fullscreen').css('display', 'block');
});

function showChat() {
    $('#chat_converse').css('display', 'block');
    $('#chat_body').css('display', 'none');
    $('#chat_form').css('display', 'none');
    $('.chat_login').css('display', 'none');
    $('.chat_fullscreen_loader').css('display', 'block');
}

