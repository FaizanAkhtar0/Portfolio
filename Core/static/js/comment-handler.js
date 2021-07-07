function success_popup(){
    const popup = document.createElement('div');
    popup.classList.add('alert', 'alert-success', 'alert-with-icon');

    const button_close = document.createElement('button');
    button_close.setAttribute('type', 'button');
    button_close.setAttribute('aria-hidden', 'true');
    button_close.setAttribute('class', 'close');
    button_close.setAttribute('data-dismiss', 'alert');
    button_close.setAttribute('aria-label', 'close');
    button_close.setAttribute('type', 'button');

    const button_icon = document.createElement('i');
    button_icon.classList.add('tim-icons', 'icon-simple-remove');
    button_close.appendChild(button_icon);


    popup.appendChild(button_close);

    const span_icon = document.createElement('span');
    span_icon.setAttribute('data-notify', 'icon');
    span_icon.classList.add('tim-icons', 'icon-bell-55');

    popup.appendChild(span_icon);

    const span_message = document.createElement('span');
    const bold_text = document.createElement('b');
    bold_text.innerHTML = 'Well done! - ';

    span_message.appendChild(bold_text);
    span_message.innerHTML += 'Your review has been posted.';

    popup.appendChild(span_message);

    popup.style = "position: fixed; top: 200px; right: 30px;";
    popup.id = 'popup-success-review';

    document.body.appendChild(popup);

    setTimeout(function(){
        document.getElementById('popup-success-review').querySelector('.close').click();
    }, 15 * 1000);
}


function failure_popup(){
    const popup = document.createElement('div');
    popup.classList.add('alert', 'alert-warning', 'alert-with-icon');

    const button_close = document.createElement('button');
    button_close.setAttribute('type', 'button');
    button_close.setAttribute('aria-hidden', 'true');
    button_close.setAttribute('class', 'close');
    button_close.setAttribute('data-dismiss', 'alert');
    button_close.setAttribute('aria-label', 'close');
    button_close.setAttribute('type', 'button');

    const button_icon = document.createElement('i');
    button_icon.classList.add('tim-icons', 'icon-simple-remove');
    button_close.appendChild(button_icon);


    popup.appendChild(button_close);

    const span_icon = document.createElement('span');
    span_icon.setAttribute('data-notify', 'icon');
    span_icon.classList.add('tim-icons', 'icon-bulb-63');

    popup.appendChild(span_icon);

    const span_message = document.createElement('span');
    const bold_text = document.createElement('b');
    bold_text.innerHTML = 'Failure - ';

    span_message.appendChild(bold_text);
    span_message.innerHTML += "Looks like there's a problem in posting the review!";

    popup.appendChild(span_message);

    popup.style = "position: fixed; top: 200px; right: 30px;";
    popup.id = 'popup-success-review';

    document.body.appendChild(popup);

    setTimeout(function(){
        document.getElementById('popup-success-review').querySelector('.close').click();
    }, 15 * 1000);
}


function change_rating(element){
    rating = element.id.split('-')[1];
    document.getElementById('rating-value').value = rating;

    for (i = 1; i <= 5; i++){
        id = 'star-' + i;
        document.getElementById(id).classList.remove("checked");
    }

    for (i = 1; i <= rating; i++){
        id = 'star-' + i;
        document.getElementById(id).classList.add("checked");
    }
}


function post_comment(){
    name = document.getElementById('comment-user-name').value;
    email = document.getElementById('comment-email').value;
    rating = document.getElementById('rating-value').value;
    comment = document.getElementById('comment-description-text').value;

    csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    current_url = window.location.href;

    comment_data = {
        'user_name': name,
        'user_email': email,
        'rating': rating,
        'experience': comment,
        'reply': "",
        'csrf_token': csrf_token
    }

    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        url: current_url + 'add_comment/',
        crossDomain: true,
        data: comment_data,
        success: function(responseData, textStatus, jqXHR) {
            success_popup();
        },
        error: function (responseData, textStatus, errorThrown) {
            failure_popup();
        }
    });
}

document.getElementById('chatSend').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handle_chat();
    }
});

function handle_chat(){
    var message = document.getElementById('chatSend').value;

    document.getElementById('chatSend').value = '';

    var chat = document.getElementById('chat_converse');
    var chat_head = document.createElement('span');
    chat_head.classList.add('chat_msg_item', 'chat_msg_item_user');

    chat_head.innerHTML += message;
    chat.appendChild(chat_head);

    csrf_token = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    current_url = window.location.href;

    chat.scrollTop = chat.scrollHeight;

    message_data = {
        'message': message
    }

    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        url: current_url + 'message/',
        crossDomain: true,
        data: message_data,
        success: function(responseData, textStatus, jqXHR) {
            var chat = document.getElementById('chat_converse');

            var chat_head = document.createElement('span');
            chat_head.classList.add('chat_msg_item', 'chat_msg_item_admin');

            var chat_head_div = document.createElement('div');
            chat_head_div.classList.add('chat_avatar');

            var chat_head_div_img = document.createElement('img');
            chat_head_div_img.setAttribute('src', 'static/img/james.jpg')

            chat_head_div.appendChild(chat_head_div_img);
            chat_head.appendChild(chat_head_div);

            let dom = new DOMParser().parseFromString(responseData['message'], 'text/html');

            chat_head.innerHTML += dom.body.innerHTML;

            chat.appendChild(chat_head);
            chat.scrollTop = chat.scrollHeight;
        },
        error: function (responseData, textStatus, errorThrown) {
            var chat = document.getElementById('chat_converse');

            var chat_head = document.createElement('span');
            chat_head.classList.add('chat_msg_item', 'chat_msg_item_user');

            var chat_head_div = document.createElement('div');
            chat_head_div.classList.add('chat_avatar');

            chat_head.appendChild(chat_head_div);

            chat_head.innerHTML += responseData['error'];

            chat.appendChild(chat_head);
            chat.scrollTop = chat.scrollHeight;
        }
    });
}