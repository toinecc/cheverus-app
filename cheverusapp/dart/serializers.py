from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Game, GameType, KillerPlayer, Player, Shot


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        token = Token.objects.create(user=user)
        return user


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "user", "name"]


class GameTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameType
        fields = ["id", "name"]


class GameSerializer(serializers.ModelSerializer):
    # killer_players = KillerPlayer(many=True)
    class Meta:
        model = Game
        fields = ["id", "user", "start_date", "game_type", "k_max_life"]


class KillerPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = KillerPlayer
        fields = ["id", "game", "player", "'number"]


class ShotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shot
        fields = "__all__"
