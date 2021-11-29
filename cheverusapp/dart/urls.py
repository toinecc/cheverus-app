from django.urls import include, path
from rest_framework import routers

from .views import (
    GameTypeViewSet,
    GameViewSet,
    KillerPlayerViewSet,
    PlayerViewSet,
    UserViewSet,
    ShotViewSet,
)

router = routers.DefaultRouter()
router.register("users", UserViewSet)
router.register("players", PlayerViewSet)
router.register("game_types", GameTypeViewSet)
router.register("games", GameViewSet)
router.register("killer_players", KillerPlayerViewSet)
router.register("shots", ShotViewSet)

urlpatterns = [path("", include(router.urls))]
