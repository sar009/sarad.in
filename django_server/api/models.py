from django.db import models
from django_pgjson.fields import JsonBField


class Background(models.Model):
    name = models.CharField(blank=True, null=True, default="", max_length=300)
    url = models.TextField(blank=True, null=True, default="")
    found_at = models.TextField(blank=True, null=True, default="")
    meta = JsonBField(blank=True, null=True, default={})
    active = models.BooleanField(blank=True, default=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)