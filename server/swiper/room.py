import random
import string
import players

class Room(object):
    def __init__(self): 
        self.room_id = self.generate_room_id()
        self.players = players.Players()
        # self.movie_dict =
        self.picked_movies = {}

    @classmethod
    def generate_room_id(cls):
        """Generate a random room ID"""
        id_length = 6
        return ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(id_length))

    def add_player(self, sid, name):
        """Add playername to player array"""
        self.players.add(sid, name)

    def remove_player(self, sid):
        """Remove playername to player array"""
        self.players.remove(sid)

    # def right_swipe(self, sid, movie_title):

