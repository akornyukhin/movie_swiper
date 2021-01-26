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
 logger=True,
 engineio_logger=True,
 cors_allowed_origins="*")


# REDIS_TTL_S = 60*10 if os.environ.get('FLASK_DEV', False) else  60*60*12
# db = redis.Redis(host='localhost', port=6379, db=0)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('create')
def on_create():
    # create new room
    rm = room.Room()

    app.logger.info('===================={0}====================='.format(request.sid))
    # add current user to players list
    rm.add_player(request.sid, "Alex")

    # # check if ID exists
    # while(get_room(rm.room_id) is not None):
    #     rm.regenerate_id()

    # write room to redis
    join_room(rm.room_id)
    # save_room(rm)
    emit('join_room', {'room': rm.room_id})

    with open('./local_data/{0}.pickle'.format(rm.room_id), 'wb') as path:
        pickle.dump(rm, path, protocol=pickle.HIGHEST_PROTOCOL)
    return [rm.room_id, len(rm.players.as_dict()['players'].keys())]

# def get_room(room, prefix=True):
#     rm = db.get(room)
#     if rm:
#         return pickle.loads(rm)
#     else:
#         emit('error', {'error': 'Unable to join, room does not exist.'})
#         return None

# def save_room(room):
#     db.setex(room.room_id, REDIS_TTL_S, pickle.dumps(room))

@socketio.on('connect to room')
def connect_to_room(data):
    with open('./local_data/{0}.pickle'.format(data), 'rb') as path:
        rm = pickle.load(path)

    rm.add_player(request.sid, "Alex1")
    join_room(rm.room_id)

    with open('./local_data/{0}.pickle'.format(rm.room_id), 'wb') as path:
        pickle.dump(rm, path, protocol=pickle.HIGHEST_PROTOCOL)

    return [rm.players.as_dict(), len(rm.players.as_dict()['players'].keys())]


@socketio.on('connect')
def connection():
    print('================User connected================')
    return None

@socketio.on('disconnect')
def disconnect():
    print('================User disconnected================')
    return None

@socketio.on('single message')
def single_message(message):
    print('================Single message================')
    emit('single message response', {'data': message})
    return 'Single message returned'

@socketio.on('broadcast message')
def broadcast_message(message):
    print('================Broadcast message================')
    emit('broadcase message response', {'data': message}, broadcast=True)
    return 'Broadcast message returned'

if __name__ == '__main__':
    socketio.run(app, debug=True)