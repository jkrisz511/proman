from flask import Flask, render_template, url_for, request, session, redirect
from util import json_response
import bcrypt
from datetime import timedelta

import data_handler
import data_manager

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)

@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    username = None
    if session.get('username') is not None:
        username = session['username']
    return render_template('index.html', username=username)


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


@app.route("/create-card")
@json_response
def create_card():
    board_id = request.args.get('board_id')

    return data_manager.create_card(board_id)


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
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = data_manager.get_password_by_username(username)
        if hashed_password is not None:
            hashed_password = hashed_password.encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password) is True:
                session['username'] = username
                session.permanent = True
                return redirect(url_for('index'))
            else:
                return render_template('login.html')
        else:
            return render_template('login.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        if session.get('username') is not None:
            return redirect(url_for('register'))
        else:
            return render_template('register.html', error=None)
    elif request.method == 'POST':
        username = request.form['username']
        if data_manager.check_username(username) == username:
            return render_template('register.html', error="taken")
        else:
            password = request.form['password']
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            hashed_password = hashed_password.decode('utf-8')
            data_manager.registration(username, hashed_password)
            return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
