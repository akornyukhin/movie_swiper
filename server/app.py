from flask import Flask, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import pickle
import random
import redis
import os
import logging
from swiper import room

from apscheduler.schedulers.background import BackgroundScheduler
import time


app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
socketio = SocketIO(app,
 debug=True,
 cors_allowed_origins="*",
 manage_session=True,
 logger=True,
 engineio_logger=True)

REDIS_ADDR = os.environ.get('REDIS_ADDR')
REDIS_PORT = os.environ.get('REDIS_PORT')
reloader_on = os.environ.get('RELOADER_ON')

print(REDIS_ADDR)
print(REDIS_PORT)
REDIS_TTL_S = 60*10 if os.environ.get('FLASK_DEV', False) else 60*60*12
db = redis.StrictRedis(host=REDIS_ADDR, port=REDIS_PORT, db=0)
movie_db = redis.StrictRedis(host=REDIS_ADDR, port=REDIS_PORT , db=1, decode_responses=True)

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

@socketio.on('connect_to_room')
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

@socketio.on('right_swipe')
def right_swipe(data):
    # get room
    rm = get_room(data['room_id'])

    # add movie to players list
    rm.right_swipe(request.sid, data['movie_title'])
    # rm.check_match()
    save_room(rm)

    return [rm.picked_movies, rm.common_movies]

@socketio.on('start_game')
def start_game(room_id):
    
    # get movies meta from redis db-1
    room_swipe_list = get_swipe_list()

    emit('game_started', {'movies': room_swipe_list}, room=room_id, broadcast=True)
    return 'Started'

def get_room(room, prefix=True):
    rm = db.get(room)
    if rm:
        return pickle.loads(rm)
    else:
        emit('error', {'error': 'Unable to join, room does not exist.'})
        return None

def save_room(room):
    db.setex(room.room_id, REDIS_TTL_S, pickle.dumps(room))

def get_swipe_list():
    swipe_list = []
    keys_list = movie_db.keys('*')
    key_list_sample = random.sample(keys_list, 30)
    for key in key_list_sample:
        movie_json = movie_db.hgetall(key)
        if movie_json:
            swipe_list.append(movie_json)
        else:
            pass
    if swipe_list:
        return swipe_list
    else:
        return None


# def check_match_emit(common_movies, room_id):
#         # print('sending message')
#         # print(room_id.decode('utf-8'))
#         socketio.emit('check_match', {'matched_movies': common_movies}, room=room_id.decode('utf-8'), broadcast=True)


@app.route('/check_movies')
def scheduled_checker():
    all_rooms = db.keys('*')
    for room_id in all_rooms:
        # print(room_id)
        rm = get_room(room_id)
        rm.check_match()
        # This line doesn't work for some reason
        socketio.emit('check_match', {'matched_movies': rm.common_movies}, room=rm.room_id, broadcast=True)
    return 'checked'

# scheduler = BackgroundScheduler()
# scheduler.add_job(func=scheduled_checker,trigger='interval',seconds=10,id=str(int(time.time())))
# scheduler.start()



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
    socketio.run(app, host='0.0.0.0', debug=True, use_reloader=reloader_on)
