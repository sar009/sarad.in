from django.conf.urls import url
import views

urlpatterns = [
    url(r'^get-random-background', views.get_random_background),
    url(r'^add-background-by-request', views.add_background_by_request),
]