import connection


@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""SELECT 
                          boards.id, 
                          boards.title,
                          array_agg(statuses.id ORDER BY statuses.id ASC) AS status_id, 
                          array_agg(statuses.title ORDER BY statuses.id ASC) AS status_title
                      FROM boards
                      JOIN statuses ON boards.id = statuses.board_id
                      GROUP BY boards.id
                      ORDER BY boards.id;""")

    boards = cursor.fetchall()
    return boards


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""SELECT * FROM cards WHERE board_id=%(board_id)s
                      ORDER BY id;""", {"board_id": board_id})

    cards = cursor.fetchall()
    return cards


@connection.connection_handler
def get_card_status(cursor):
    cursor.execute("""SELECT * FROM statuses;""")
    statuses = cursor.fetchall()
    return statuses


@connection.connection_handler
def create_board(cursor):
    cursor.execute("""INSERT INTO boards (title) VALUES (%(title)s) RETURNING *;""",
                   {"title": "New Board"})
    board = cursor.fetchone()
    return board


@connection.connection_handler
def add_default_statuses(cursor, new_board_id):
    cursor.execute("""
                   INSERT INTO statuses (title, board_id) VALUES ('new', %(new_id)s);
                   INSERT INTO statuses (title, board_id) VALUES ('in progress', %(new_id)s);
                   INSERT INTO statuses (title, board_id) VALUES ('testing', %(new_id)s);
                   INSERT INTO statuses (title, board_id) VALUES ('done', %(new_id)s);
                   """, {"new_id": new_board_id})

    cursor.execute("""SELECT boards.id, boards.title,
                      array_agg(statuses.id) AS status_id, array_agg(statuses.title) AS status_title
                      FROM boards
                      JOIN statuses ON boards.id = statuses.board_id
                      WHERE boards.id = %(new_id)s
                      GROUP BY boards.id
                      ORDER BY boards.id;""", {"new_id": new_board_id})
    updated_statuses = cursor.fetchall()
    return updated_statuses


@connection.connection_handler
def update_board(cursor, board_id, title):
    cursor.execute("""UPDATE boards SET title = %(title)s
                      WHERE id = %(board_id)s;""", {"title": title, "board_id": board_id})


@connection.connection_handler
def update_column(cursor, column_id, title):
    cursor.execute("""UPDATE statuses SET title = %(title)s
                      WHERE id = %(column_id)s;""", {"title": title, "column_id": column_id})


@connection.connection_handler
def update_card(cursor, card_id, title):
    cursor.execute("""UPDATE cards SET title = %(title)s
                      WHERE id = %(card_id)s;""", {"title": title, "card_id": card_id})


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

@connection.connection_handler
def delete_card(cursor, card_id):
    cursor.execute("""DELETE FROM cards WHERE id=%(id)s;""", {'id': card_id})

