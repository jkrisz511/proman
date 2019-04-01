import connection


@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""SELECT * FROM boards;""")

    boards = cursor.fetchall()
    return boards


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""SELECT * FROM cards WHERE board_id=%(board_id)s;""", {"board_id": board_id})

    cards = cursor.fetchall()
    return cards


@connection.connection_handler
def get_card_status(cursor):
    cursor.execute("""SELECT * FROM statuses;""")
    statuses = cursor.fetchall()
    return statuses
