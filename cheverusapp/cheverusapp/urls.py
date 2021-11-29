from django.conf.urls import url
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

from . import views as globalviews

urlpatterns = [
    path("bibibop/", admin.site.urls),
    path("api/dart/", include("dart.urls")),
    path("api/auth/", obtain_auth_token),
    url(r"^$", lambda r: HttpResponseRedirect("app/")),
    url(r"^app/(?:.*)/?$", globalviews.FrontendAppView.as_view()),
]
