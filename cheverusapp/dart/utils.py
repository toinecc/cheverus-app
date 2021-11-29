import pandas as pd
from .models import Game, GameType, KillerPlayer, Player, Shot, Cell


def get_killer_players_df(game_id):

    players = Player.objects.all()
    players_df = pd.DataFrame(players.values())
    del players_df["user_id"]

    killer_players = KillerPlayer.objects.filter(game__id=game_id)
    killer_players_df = pd.DataFrame(killer_players.values())
    del killer_players_df["id"]
    killer_players_df = pd.merge(
        killer_players_df, players_df, left_on="player_id", right_on="id", how="left"
    )
    del killer_players_df["id"]
    killer_players_df.index = killer_players_df["player_id"]
    del killer_players_df["player_id"]

    return killer_players_df


def get_shots_df(game_id):

    # Get useful models
    cells = Cell.objects.all()
    cells_df = pd.DataFrame(cells.values())

    # Get clean shots df
    shots = Shot.objects.filter(game__id=game_id)
    shots_df = pd.DataFrame(shots.values())
    del shots_df["id"]
    del shots_df["game_id"]
    shots_df = pd.merge(
        shots_df, cells_df, left_on="cell_id", right_on="id", how="left"
    )
    del shots_df["id"]
    shots_df = shots_df.sort_values(["turn_number", "dart_number"])

    return shots_df
