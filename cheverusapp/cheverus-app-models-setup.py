from dart.models import Cell, GameType, Player


def create_game_type(name):
    try:
        game_type = GameType.objects.create(name=name)
        game_type.save()
    except Exception as e:
        print(e)


def create_cell(number, zone):
    try:
        cell = Cell.objects.create(number=number, zone=zone)
        cell.save()
    except Exception as e:
        print(e)


# Game types
create_game_type("Killer")

# Cells usual
usual_zones = ["1", "2", "3"]
for zone in usual_zones:
    for number in range(1, 21):
        create_cell(number, zone)

# Cells atypical
create_cell(None, "25")
create_cell(None, "50")
create_cell(None, "out")
