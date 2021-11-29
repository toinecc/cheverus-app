from datetime import datetime

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="players")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = (("user", "name"),)
        index_together = (("user", "name"),)

    def __str__(self):
        return f"{self.name}"


class GameType(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = (("name"),)
        index_together = (("name"),)

    def __str__(self):
        return f"{self.name}"


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="games")
    start_date = models.DateTimeField(auto_now=True)
    game_type = models.ForeignKey(
        GameType, on_delete=models.CASCADE, related_name="games"
    )
    k_max_life = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(20)]
    )

    def __str__(self):
        return f"Game #{self.id:0>4}"


class KillerPlayer(models.Model):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="killer_players"
    )
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, default=None, related_name="killer_players"
    )
    number = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(20)]
    )

    class Meta:
        unique_together = (("player", "game"),)
        index_together = (("player", "game"),)

    def __str__(self):
        return f"{self.player} killer player {self.id:0>4}"


class Cell(models.Model):
    class Meta:
        unique_together = (("number", "zone"),)

    ZONE_CHOICES = [
        ("1", "x1"),
        ("2", "x2"),
        ("3", "x3"),
        ("25", "25"),
        ("50", "50"),
        ("out", "out"),
    ]
    number = models.IntegerField(blank=True, null=True)
    zone = models.CharField(max_length=5, choices=ZONE_CHOICES)

    def __str__(self):
        return f"Zone: {self.zone}  / Number: {self.number} "


class Shot(models.Model):
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, default=None, related_name="shots"
    )
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="shots")
    turn_number = models.IntegerField(default=None)
    dart_number = models.IntegerField(default=None)
    number_aimed = models.IntegerField(default=None, blank=True, null=True)
    cell = models.ForeignKey(Cell, on_delete=models.CASCADE, related_name="shots")
