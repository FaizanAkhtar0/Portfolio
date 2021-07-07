from django.contrib import admin

from Core.models import GalleryItem, SkillsItem, ExperienceItem, UserRating
# Register your models here.


admin.site.register(GalleryItem)
admin.site.register(SkillsItem)
admin.site.register(ExperienceItem)
admin.site.register(UserRating)
