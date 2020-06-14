import re
import os
import sys

def createRatedFile(username, fileName, path):

    # Add a space to the end of the file to normalize its pattern for regex
    with open(os.path.join(path, fileName), "a") as f:
        f.write('\n')

    outputName = os.path.join(path, username) +'RemoveUnrated.json'

    with open(os.path.join(path, fileName), "r") as mainEdit:
        readLines = mainEdit.read()

    pattern = '\[Event "Rated[^<]*?WhiteRatingDiff[^<]*?\n\n\n'
    selectAll = re.findall(pattern, readLines)

    with open(outputName, 'w') as output:
        for item in selectAll:
            output.write(item)
    mainEdit.close()
    return outputName
