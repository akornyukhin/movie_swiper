import random
import string
from swiper import players

class Room(object):
    def __init__(self): 
        self.room_id = self.generate_room_id()
        self.players = players.Players()
        # self.movie_dict =
        self.picked_movies = {}
        self.common_movies = {}

    @classmethod
    def generate_room_id(cls):
        """Generate a random room ID"""
        id_length = 6
        return ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(id_length))

    def regenerate_id(self):
        self.room_id = self.generate_room_id()

    def add_player(self, sid, name):
        """Add playername to player array"""
        self.players.add(sid, name)

    def remove_player(self, sid):
        """Remove playername to player array"""
        self.players.remove(sid)

    def right_swipe(self, sid, movie_title):
        if sid not in self.players.as_dict()['players'].keys():
            print(sid)
            print("No such player")
        else:
            if sid not in self.picked_movies.keys():
                self.picked_movies[sid] = [movie_title]
            else:
                self.picked_movies[sid].append(movie_title)
    
    def check_match(self):
        if len(self.picked_movies.values()) > 1:
            all_movies = list(self.picked_movies.values())
            # print(set(all_movies[0]).intersection(*all_movies[1:]))
            if len(all_movies) != 0:
                self.common_movies = list(set(all_movies[0]).intersection(*all_movies[1:]))
