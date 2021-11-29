from django.contrib import admin

from .models import Game, GameType, KillerPlayer, Player, Shot, Cell


class KillerPlayerInline(admin.TabularInline):
    model = KillerPlayer
    extra = 0


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("__str__", "id", "user", "name")


@admin.register(GameType)
class GameTypeAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "id",
        "name",
    )


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("__str__", "id", "user", "start_date", "game_type", "k_max_life")
    inlines = (KillerPlayerInline,)


@admin.register(KillerPlayer)
class KillerPlayerAdmin(admin.ModelAdmin):
    list_display = ("__str__", "id", "player", "game", "number")


@admin.register(Shot)
class ShotAdmin(admin.ModelAdmin):
    list_display = ("__str__", "id")


@admin.register(Cell)
class CellAdmin(admin.ModelAdmin):
    list_display = ("__str__", "id", "number", "zone")
