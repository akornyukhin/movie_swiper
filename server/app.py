from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room
import pickle
import redis
import os
import logging
from swiper import room

app = Flask(__name__)
socketio = SocketIO(app,
#  debug=True,
 cors_allowed_origins="*")


REDIS_TTL_S = 60*10 if os.environ.get('FLASK_DEV', False) else 60*60*12
db = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('create')
def on_create(name):
    # create new room
    rm = room.Room()

    # add current user to players list
    rm.add_player(request.sid, name)

    # check if ID exists
    while(get_room(rm.room_id) is not None):
        rm.regenerate_id()

    # write room to redis
    join_room(rm.room_id)
    save_room(rm)
    emit('join_room', {'room': rm.room_id}, room=rm.room_id)

    return [rm.room_id, rm.players.as_dict(), True]

@socketio.on('connect to room')
def connect_to_room(room_id, name):

    # get room
    rm = get_room(room_id)

    # add players 
    rm.add_player(request.sid, name)
    join_room(rm.room_id)

    # save room
    save_room(rm)

    emit('join_room', {'room': rm.players.as_dict()}, room=rm.room_id, broadcast=True)

    return [rm.players.as_dict(), False]

@socketio.on('right swipe')
def right_swipe(data):
    # get room
    rm = get_room(data['room_id'])

    # add movie to players list
    rm.right_swipe(request.sid, data['movie_title'])
    rm.check_match()
    save_room(rm)

    return [rm.picked_movies, rm.common_movies]


def get_room(room, prefix=True):
    rm = db.get(room)
    if rm:
        return pickle.loads(rm)
    else:
        emit('error', {'error': 'Unable to join, room does not exist.'})
        return None

def save_room(room):
    db.setex(room.room_id, REDIS_TTL_S, pickle.dumps(room))


# @socketio.on('connect')
# def connection():
#     print('================User connected================')
#     return None

# @socketio.on('disconnect')
# def disconnect():
#     print('================User disconnected================')
#     return None

# @socketio.on('single message')
# def single_message(message):
#     print('================Single message================')
#     emit('single message response', {'data': message})
#     return 'Single message returned'

# @socketio.on('broadcast message')
# def broadcast_message(message):
#     print('================Broadcast message================')
#     emit('broadcase message response', {'data': message}, broadcast=True)
#     return 'Broadcast message returned'

if __name__ == '__main__':
    socketio.run(app, debug=True)