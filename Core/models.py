from django.db import models

# Create your models here.

from portfolio.settings import MEDIA_SAVE_PATH


class GalleryItem(models.Model):
    project_name = models.CharField(max_length=200)
    languages = models.CharField(max_length=500)
    project_description = models.TextField()
    link = models.CharField(max_length=500)


class SkillsItem(models.Model):
    skill_name = models.CharField(max_length=200)
    skill_icon = models.TextField()
    skill_master_percentage = models.IntegerField()
    skill_description_link = models.TextField()


class ExperienceItem(models.Model):
    CHOICES = (
        ('W', 'Work'),
        ('E', 'Experience'),
        ('I', 'Internship')
    )
    exp_type = models.CharField(max_length=100, choices=CHOICES)
    experience_name = models.CharField(max_length=200)
    organization_name = models.CharField(max_length=200)
    exp_date = models.CharField(max_length=200)
    org_location = models.CharField(max_length=500)
    learning_description = models.TextField()
    image = models.ImageField(upload_to=MEDIA_SAVE_PATH + '\\orgs\\')


class UserRating(models.Model):
    user_name = models.CharField(max_length=200)
    user_email = models.CharField(max_length=500)
    rating = models.IntegerField()
    experience = models.TextField()
    reply = models.TextField()


