from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import logging

app = Flask(__name__)
socketio = SocketIO(app,
#  debug=True,
 logger=True,
 engineio_logger=True,
 cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def connection():
    print('================User connected================')
    return None

@socketio.on('disconnect')
def connection():
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