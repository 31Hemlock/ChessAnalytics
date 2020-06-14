import os
import sys


def deleteFile(username):
    os.remove(os.path.join(sys.path[0], 'data', username + '.json'))