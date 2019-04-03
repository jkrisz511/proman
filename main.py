from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler
import data_manager

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """

    return data_manager.get_boards()


@app.route("/get-cards/<board_id>")
@json_response
def get_cards_for_board(board_id):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_manager.get_cards_for_board(board_id)


@app.route("/create-board")
@json_response
def create_board():

    return data_manager.create_board()


@app.route("/rename-board-title/<board_id>", methods=['POST'])
@json_response
def rename_board(board_id):
    new_title = request.get_json()['title']
    return data_manager.update_board(board_id, new_title)

@app.route("/login", methods=['GET', 'POST'])
def login():
    pass

@app.route("/register", methods=['GET', 'POST'])
def register():
    pass

@app.route('/logout')
def logout():
    pass


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
