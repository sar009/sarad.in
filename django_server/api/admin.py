from django.contrib import admin
from api.models import Background


class BackgroundAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'url', 'found_at', 'active')


admin.site.register(Background, BackgroundAdmin)