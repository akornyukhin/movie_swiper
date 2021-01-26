import json
import random

class Players(object):
  def __init__(self):
    self.all_players = set()
    self.reset()

  def add(self, sid, name):
    self.all_players.add(name if name else sid)
    self.players[sid] = name if name else sid

  def remove(self, sid):
    if sid in self.players:
      del self.players[sid]

  def reset(self):
    self.players = {}

  def as_dict(self):  
    return {
      "players": self.players,
    }