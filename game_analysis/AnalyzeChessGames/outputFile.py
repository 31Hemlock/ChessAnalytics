import re
import numpy as np
#import pgnEval
import settings
import os
import sys

def output(moveEval, username, fileName, path):
    # Create arrays and counters
    names = []
    values = []
    PGN = []
    count = 0
    PGNCount = 0
    i = 0
    dateInsert = 0
    dateNumber = 0
    evalCount = 0
    nameCounter = []
    formattedDates = []
    PGNArray = []
    gameScores = []
    PGNMoveList = []
    PGNArrayToSort = []
    fullPGN = []
    finalNames = []

    # Open files for reading and writing
    y = os.path.join(path, fileName)
    input = open(y)

    z = username + '.json'

    if z in os.listdir(path):
        os.rename(os.path.join(sys.path[0], 'data', z), os.path.join(sys.path[0], 'data', username + 'Old.json')) 
  
    output = open(os.path.join(sys.path[0], 'data', username + '.json'), "w+")
    
    readInput = input.read()

    # Create the correct date format (ISODate) and store all dates in formatDates
    formatDates = re.findall('\[UTCDate ".*\n\[UTCTime ".*', readInput)
    for x in formatDates:
        x = x.replace('[UTCDate ', '{"$date":')
        x = x.replace('.','-')
        x = x.replace('"]\n[UTCTime "', 'T')
        x = x.replace('"]', '.000Z"}')
        formattedDates.append(x)

    # Add all column names to the list 'names'.
    allNames = re.findall(('\[.+ "'), readInput)
    for i in allNames:

        i = re.sub(r'\W+', '', i)
        i = '"' + i + '":'

        if i in names:
            exit
        else:
            names.append(i)


    # Add all non-PGN values to the array 'values'.
    allValues = re.findall('"[^<]*?"', readInput)

    for x in allValues:
        if "https://lichess.org/" in x:
            saveGameValue = x[21:29]
            x = '"\\\"https://lichess.org/' + saveGameValue + '\\\""'
        
        dateIndex = names.index('"Date":')
        UTCDateIndex = names.index('"UTCDate":')
        UTCTimeIndex = names.index('"UTCTime":')
        if ((dateInsert % len(names)) == UTCDateIndex) or ((dateInsert % len(names)) == UTCTimeIndex):
            pi = 3.14
        elif ((dateInsert % len(names)) == dateIndex):
            x = formattedDates[dateNumber]
            dateNumber = dateNumber + 1
            x = x + ','
            values.append(x)
        else:
            x = x + ','
            values.append(x)

        dateInsert = dateInsert + 1
    # Remove UTCDate and UTCTime from Names

    for name in names:
        if (name == '"UTCDate":') or (name == '"UTCTime":'):
            exit
        else:
            finalNames.append(name)


    # Add all PGN values to the array 'PGNMoveList' (And maintain full values in fullPGN)
    allPGN = re.findall('\n1. [^<]*?\n\n', readInput)
    for z in allPGN:
        
        z = z.strip('\n\n')
        fullPGN.append(z)
        
        removeMoveNumber = re.compile('\d+\.')
        removePGNTag = re.compile('PGN:')
        removeScore = re.compile('\d-\d')

        PGNArrayToSort = z.split()
        for item in PGNArrayToSort:
            if removeMoveNumber.search(item) or removePGNTag.search(item):
                exit
            elif removeScore.search(item):
                gameScores.append(item)
            else:
                PGNMoveList.append(item)
        PGNArray.append(PGNMoveList)
        PGNMoveList = []

    # Populate the JSON file.
    if len(values) > 0:
        output.write('{')
    for value in values:
        output.write(finalNames[count % (len(finalNames))] + value)
        # The above portion wrote all of the values except for the score, PGN, and evaluation.
        # Every time we reach value#14, we want to add all the other stuff that comes at the end.
        # If the count % the length of finalNames (15) is equal to 14, print the rest of the values.
        if (count % len(finalNames) == len(finalNames) - 1):
            output.write('"Score":"')
            output.write(str(gameScores[PGNCount]))
            output.write('"')

            output.write(',"PGN":')

            output.write(str(PGNArray[PGNCount]))

            output.write(',"Evaluation":[')

            # gameLengthForEval = length of moves for current game (len of the array containing all PGNs at a certain number)
            gameLengthForEval = len(PGNArray[PGNCount])
            for PGN in range(gameLengthForEval):
                output.write(str("'"+ moveEval[evalCount])+ "'")
                if PGN != (gameLengthForEval - 1):
                    output.write(', ')
                evalCount = evalCount + 1

            output.write(']}\n')

            if (count < (len(values) - 1)):
                output.write('{')
            PGNCount = PGNCount + 1
        count = count + 1
    # Close files
    input.close()
    output.close()

    # Combine old and new compiled files and delete intermediary files
    if username + 'Old.json' in os.listdir(path):
        with open(os.path.join(sys.path[0], 'data', username + 'Old.json'), 'r+') as oldFile:
            with open(os.path.join(sys.path[0], 'data', username + '.json'), "a+") as newFile:
                for line in oldFile:
                    newFile.write(line)

        os.remove(os.path.join(sys.path[0], 'data',  username + 'Old.json'))
    os.remove(os.path.join(sys.path[0], 'data',  username + 'Raw.pgn'))
    os.remove(os.path.join(sys.path[0], 'data', username + 'RemoveUnrated.json'))
