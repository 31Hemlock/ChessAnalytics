from removeUnrated import createRatedFile
from pgnEval import evaluate
from outputFile import output
from mongoLoad import uploadMongo

import os
import sys
import re
import urllib
from urllib import request
import json
import time


from dotenv import load_dotenv

# Load local variables with dotenv
load_dotenv()

# Set basic variables
db_name = 'chess' # name of mongodb database
username = sys.argv[1]
level = 1/100


moveEval = []
gameID = ''
rawFileName = username + 'Raw.pgn'
rawFilePath = os.path.join(sys.path[0], 'data', username + 'Raw.pgn')

# Download games from lichess
url = 'https://lichess.org/games/export/' + username
urllib.request.urlretrieve(url, rawFilePath)

while not os.path.exists(rawFilePath) and not os.stat(rawFilePath).st_size > 0:
    time.sleep(2)

# If username.json exists, prevent games that were analyzed in the past from being analyzed again
# by removing all games up to and including the last analyzed game from the new file.

# First, find most recent analyzed site code in username.json
if os.path.isfile(os.path.join(sys.path[0], 'data', username + '.json')) and os.stat(os.path.join(sys.path[0], 'data', username + '.json')).st_size > 0:
    with open(os.path.join(sys.path[0], 'data', username + '.json'), 'r') as f:
        firstLine = f.readline()
        gameID = re.search('https://lichess.org/.*\\\\', firstLine)
        gameID = gameID.group(0)
        gameID = gameID.replace('https://lichess.org/', '')
        gameID = gameID.replace('\\', '')
        gameID = gameID.replace('\\', '')
        print(gameID) # gameID represents the most recently played game in our analysis file.

    with open(rawFilePath, 'r') as f:
        rawList = list(f)    #puts all lines in a list
        lineCount = 0
        for i, line in enumerate(rawList):
            if gameID in line:
                matchedLine = i

                # Delete to end of list
                del rawList[matchedLine - 1: -1]
                print(rawList)
                # Rewrite file without the previously analyzed games
                with open(rawFilePath, 'w') as c:
                    for n in rawList:
                        print('rewriting!')
                        c.write(n)
                print(rawList)
                break
            else:
                continue




path = os.path.join(sys.path[0], 'data')

outputName = createRatedFile(username, rawFileName, path)


moveEval = evaluate(username, outputName, path, level)

output(moveEval, username, outputName, path)

uploadMongo(username, os.path.join(sys.path[0], 'data', username + '.json'), db_name, username)
