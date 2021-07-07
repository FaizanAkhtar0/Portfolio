import json
import os

import requests
from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_protect

from Core.chatbot.chat_bot import ChatBot
from Core.models import GalleryItem, SkillsItem, ExperienceItem, UserRating
from Core.credentials import query_url, headers, params

from portfolio.settings import  MEDIA_SAVE_PATH

# Create your views here.

chatbot = ChatBot()
chatbot.chatbot_response('Hi')


def prepare_content_per_item(gallery_item):
    return {
        'id': gallery_item.id,
        'project_name': gallery_item.project_name,
        'languages': str(gallery_item.languages).split(','),
        'project_description': gallery_item.project_description,
        'link': gallery_item.link
    }


def three_set_gallery_items(gallery_items):
    counter = 0

    three_set_list = []
    temp = []

    while len(gallery_items) > counter:
        for i in gallery_items[counter: 3 + counter]:
            temp.append(prepare_content_per_item(i))
        else:
            counter += 3
            three_set_list.append(temp)
            temp = []
    else:
        return three_set_list


def preprocess_experiences(items):
    ret_list = []
    for item in items:
        temp_dict = {}
        temp_dict['id'] = item.id
        temp_dict['exp_type'] = item.exp_type
        temp_dict['experience_name'] = item.experience_name
        temp_dict['organization_name'] = item.organization_name
        temp_dict['exp_date'] = item.exp_date
        temp_dict['org_location'] = item.org_location
        temp_dict['learning_description'] = item.learning_description
        temp_dict['image'] = str(item.image).split('/')[::-1][0]
        ret_list.append(temp_dict)
    else:
        return ret_list


def get_git_repos():
    try:
        return requests.get(query_url, headers=headers, params=params).json()
    except:
        return [{'name': 'Github API Connection Error, couldn\'t fetch repository information.'}]


def index(request):
    if request.method == 'GET':
        gallery_items = GalleryItem.objects.all()
        skill_items = SkillsItem.objects.all()
        items = three_set_gallery_items(gallery_items)

        experience_items = ExperienceItem.objects.all()
        work_items = experience_items.filter(exp_type='W')
        work_items = preprocess_experiences(work_items)
        exp_items = experience_items.filter(exp_type='E')
        exp_items = preprocess_experiences(exp_items)
        intern_items = experience_items.filter(exp_type='I')
        intern_items = preprocess_experiences(intern_items)

        public_comments = UserRating.objects.all()

        questions = chatbot.get_questions()

        return render(request, 'index.html', {
            'content': items,
            'skills': skill_items,
            'experiences': {
                'works': work_items,
                'experiences': exp_items,
                'internships': intern_items
            },
            'repos': get_git_repos(),
            'public_comments': public_comments,
            'chats': questions
        })

@csrf_protect
def add_comment(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        user_email = request.POST.get('user_email')
        rating = int(request.POST.get('rating'))
        experience = request.POST.get('experience')
        reply = request.POST.get('reply')
        comment = UserRating(user_name=user_name, user_email=user_email, rating=rating, experience=experience, reply=reply)
        comment.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=500)


@csrf_protect
def message_bot(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        response = chatbot.chatbot_response(message)
        response_data = {'message': response}
        return HttpResponse(json.dumps(response_data), content_type="application/json")


def download(request):
    file_path = MEDIA_SAVE_PATH + '\\resume\\resume.pdf'
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/pdf")
            response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            return response
    raise Http404



