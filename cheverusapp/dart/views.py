from datetime import datetime

from django.contrib.auth.models import User
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Game, GameType, KillerPlayer, Player, Shot, Cell
from .serializers import (
    GameSerializer,
    KillerPlayerSerializer,
    PlayerSerializer,
    UserSerializer,
    ShotSerializer,
)
from .utils import get_killer_players_df, get_shots_df
import pandas as pd


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    # Overwrite default Django routes for auth users
    def create(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"])
    def list_players(self, request):
        user = request.user
        players = Player.objects.filter(user=user.id).order_by("id")
        players_serialized = PlayerSerializer(players, many=True)
        return JsonResponse(players_serialized.data, safe=False)

    @action(detail=False, methods=["POST"])
    def create_player(self, request):
        if "name" in request.data:
            user = request.user
            if len(Player.objects.filter(user=user.id)) < 15:
                name = request.data["name"]
                player = Player(user=user, name=name)
                try:
                    player.save()
                    return Response({"message": "Player created"}, status.HTTP_200_OK)
                except Exception as e:
                    return Response(
                        {
                            "message": "Player not created: you already have a player named like this."
                        },
                        status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"message": "You cannot create more than 15 players by account"},
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You need to provide a player name"},
                status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["PUT"])
    def update_player(self, request):
        if "name" in request.data:
            user = request.user
            name = request.data["name"]
            try:
                player = Player.objects.get(user=user.id, name=name)
                if "new_name" in request.data:
                    player.name = request.data["new_name"]
                    player.save()
                    return Response({"message": "Player updated"}, status.HTTP_200_OK)
                else:
                    return Response(
                        {"message": "Player not updated: you need to provide new name"},
                        status.HTTP_400_BAD_REQUEST,
                    )
            except Exception as e:
                return Response(
                    {"message": "No player found with this name"},
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You need to provide a player name"},
                status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["DELETE"])
    def delete_player(self, request):
        if "name" in request.query_params:
            name = request.query_params["name"]
            user = request.user
            try:
                player = Player.objects.get(user=user.id, name=name)
                player.delete()
                return Response({"message": "Player deleted"}, status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"message": "No player found with this name"},
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You need to provide a player name"},
                status.HTTP_400_BAD_REQUEST,
            )


class GameTypeViewSet(viewsets.ModelViewSet):
    queryset = GameType.objects.all()
    serializer_class = GameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    # Overwrite default Django routes for auth users
    def create(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response({"message": "Method not found"}, status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"])
    def create_game(self, request):
        if ("maxLifeNumber" in request.data) and ("gameType" in request.data):
            try:
                user = request.user
                players = request.data["maxLifeNumber"]
                if request.data["gameType"] == "Killer":
                    game_type = GameType.objects.get(name="Killer")
                game = Game.objects.create(
                    user=user,
                    start_date=datetime.now(),
                    game_type=game_type,
                    k_max_life=request.data.get("maxLifeNumber"),
                )
                game.save()
                return Response(
                    {"message": "Killer game initialized", "killer_game_id": game.id},
                    status.HTTP_200_OK,
                )
            except Exception as e:
                print("Error! Something went wrong during killer game creation: ", e)
                return Response(
                    {"message": "Killer game not initialized. Something went wrong."},
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You need to provide life number"},
                status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["GET"])
    def get_killer_status(self, request, pk):

        game = get_object_or_404(Game, pk=pk)
        killer_game_type = get_object_or_404(GameType, pk=1)

        if game.game_type == killer_game_type:

            # Get recorded info
            shots_df = get_shots_df(pk)
            print(shots_df)
            killer_players_df = get_killer_players_df(pk)
            print(killer_players_df)

            # Transform & enrich player df
            killer_players_dict = killer_players_df.to_dict(orient="index")
            for player_id, player_info in killer_players_dict.items():
                killer_players_dict[player_id]["isDead"] = False
                killer_players_dict[player_id]["canKill"] = False
                killer_players_dict[player_id]["lifes"] = 0
                killer_players_dict[player_id]["lastChance"] = False
                killer_players_dict[player_id]["id"] = player_id
                del killer_players_dict[player_id]["game_id"]

            # Game params
            max_life = game.k_max_life

            # Initalization
            life_required = False

            # Compute score
            print("===================\n")
            for idx, shot in shots_df.iterrows():
                n_turn = shot["turn_number"]
                n_dart = shot["dart_number"]
                shooter_id = shot["player_id"]
                shooter_info = killer_players_dict[shooter_id]
                # Defense shot
                if shooter_info["number"] == shot["number"]:
                    print("DEFENSE")
                    # Increase shooter lifes
                    if shot["zone"] in ["1", "1"]:
                        killer_players_dict[shooter_id]["lifes"] += 1
                    elif shot["zone"] == "2":
                        killer_players_dict[shooter_id]["lifes"] += 2
                    elif shot["zone"] == "3":
                        killer_players_dict[shooter_id]["lifes"] += 3
                    # Normalize life if needed
                    if killer_players_dict[shooter_id]["lifes"] > max_life:
                        killer_players_dict[shooter_id]["lifes"] = max_life
                    # active global must touched
                    if (
                        life_required == False
                        and killer_players_dict[shooter_id]["lifes"] == max_life
                    ):
                        life_required = True
                    # activate personal canKill
                    if killer_players_dict[shooter_id]["lifes"] == max_life:
                        killer_players_dict[shooter_id]["canKill"] = True

                # Attack shot
                else:
                    if shooter_info["canKill"] and shooter_info['lifes']>0:
                        if shot["number"] in killer_players_df["number"].values:
                            player_touched = (
                                killer_players_df.loc[
                                    killer_players_df["number"] == shot["number"]
                                ]
                                .reset_index()
                                .to_dict(orient="index")[0]
                            )
                            if shot["zone"] == "1":
                                killer_players_dict[player_touched["player_id"]]["lifes"] -= 1
                            elif shot["zone"] == "2":
                                killer_players_dict[player_touched["player_id"]]["lifes"] -= 2
                            elif shot["zone"] == "3":
                                killer_players_dict[player_touched["player_id"]]["lifes"] -= 3
                            # Normalize life if needed
                            if killer_players_dict[player_touched["player_id"]]["lifes"] < 0:
                                killer_players_dict[player_touched["player_id"]]["lifes"] = 0

                # Is dead ?
                if life_required and shooter_info['lifes']==0 and shot["dart_number"]==2:
                    killer_players_dict[shooter_id]["isDead"] = True

            #
            return Response(
                {"lifeRequired": life_required, "playersInfo": killer_players_dict},
                status.HTTP_200_OK,
            )

        else:

            return Response(
                {"message": "This game isn't a Killer"},
                status.HTTP_400_BAD_REQUEST,
            )


class KillerPlayerViewSet(viewsets.ModelViewSet):
    queryset = KillerPlayer.objects.all()
    serializer_class = KillerPlayerSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["POST"])
    def create_players(self, request):
        if ("players" in request.data) and ("gameId" in request.data):
            try:
                user = request.user
                players_info = request.data.get("players")
                game = Game.objects.get(id=request.data.get("gameId"))
                killer_game_type = GameType.objects.get(name="Killer")
                if game.game_type == killer_game_type:
                    for player_info in players_info:
                        player = Player.objects.get(id=player_info.get("id"))
                        number = int(player_info.get("number"))
                        killer_player = KillerPlayer.objects.create(
                            player=player, game=game, number=number
                        )
                        killer_player.save()
                return Response(
                    {"message": "Killer players initialized"}, status.HTTP_200_OK
                )
            except Exception as e:
                print("Error! Something went wrong during killer player creation: ", e)
                return Response(
                    {
                        "message": "Killer players not initialized. Something went wrong."
                    },
                    status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "You need to provide players and gameId"},
                status.HTTP_400_BAD_REQUEST,
            )


class ShotViewSet(viewsets.ModelViewSet):
    queryset = Shot.objects.all()
    serializer_class = ShotSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["POST"])
    def register_shots(self, request):

        try:

            user = request.user
            game_id = request.data.get("gameId")
            game = Game.objects.get(id=game_id)
            turn_info = request.data.get("turnInfo", {})
            turn_number = turn_info.get("number")
            player_id = turn_info.get("player", {}).get("id")
            player = Player.objects.get(id=player_id)

            for dart_number, shot_info in turn_info.get("shots", {}).items():
                dart_number = int(dart_number)
                touched_zone = str(shot_info.get("touchedZone"))
                if touched_zone in ["25", "50", "edge", "out"]:
                    touched_number = None
                else:
                    touched_number = shot_info.get("touchedNumber")
                cell_touched = Cell.objects.get(
                    zone=touched_zone, number=touched_number
                )
                shot = Shot.objects.create(
                    player=player,
                    game=game,
                    turn_number=turn_number,
                    dart_number=dart_number,
                    number_aimed=shot_info.get("aimedNumber"),
                    cell=cell_touched,
                )
                shot.save()

            return Response({"message": "Shots registered."}, status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"message": f"Shot registering failed. Error: {e}"},
                status.HTTP_400_BAD_REQUEST,
            )
