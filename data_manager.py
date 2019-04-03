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


@connection.connection_handler
def create_board(cursor):
    cursor.execute("""INSERT INTO boards (title) VALUES (%(title)s) RETURNING *;""", {"title": "New Board"})
    board = cursor.fetchone()
    return board


@connection.connection_handler
def update_board(cursor, board_id, title):
    cursor.execute("""UPDATE boards SET title = %(title)s
                      WHERE id = %(board_id)s;""", {"title": title, "board_id": board_id})

@connection.connection_handler
def get_password_by_username(cursor, username):

    cursor.execute("""SELECT password FROM users
                      WHERE username = %(username)s;""", {'username': username})
    password = cursor.fetchone()
    if password is not None:
        return password['password']
    else:
        return None

@connection.connection_handler
def check_username(cursor, username):

    cursor.execute("""SELECT username FROM users
                      WHERE username = %(username)s;""", {'username': username})
    user = cursor.fetchone()
    if user is not None:
        return user['username']
    else:
        return None

@connection.connection_handler
def registration(cursor, username, hashed_password):
    user_details = {
        'username': username,
        'password': hashed_password
    }
    cursor.execute("""INSERT INTO users(username, password)
                      VALUES(%(username)s, %(password)s);""", user_details)


@connection.connection_handler
def create_card(cursor, board_id):
    cursor.execute("""INSERT INTO cards(board_id, title, statuses_id, card_order)
                      VALUES (%(board_id)s, %(title)s, %(status_id)s, %(card_order)s) RETURNING *""",
                      {'board_id': board_id, 'title': 'New Card', 'status_id': 1, 'card_order': 0}
                   )
    return cursor.fetchone()
