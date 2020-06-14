import asyncio
import chess
import chess.engine
import chess.pgn
from chess.engine import PovScore
import settings
import os


def evaluate(username, fileName, path, level):
    oneGame = []
    moveEval = []

    # This file evaluates all the games in a PGN file and converts their evaluation 
    # to the format: 1. +29 +133

    # Opens the PGN file, and then opens it again as a readable file to count the total number of games it contains.

    # Creates or opens a file to contain the output.
    #f= open("E:\\Data\\Chess\\positionEval.txt","w+")

    # List containing the output:

    async def main():

        pgn  = os.path.join(path, fileName)

        pgnCountingGames = os.path.join(path, fileName)

        with open (pgn, 'r') as pgn:
            with open (pgnCountingGames, 'r') as pgnCountingGames:
                # Connects stockfish
                transport, engine = await chess.engine.popen_uci(os.path.join(path, 'Scid-4.7.0', 'bin', 'engines', 'stockfish.exe'))

                # Creates a count for debugging

                # Counts the number of games in the set so we can use a loop
                countingGames = pgnCountingGames.read()
                gameNumber = countingGames.count("[Event")
                print('The total number of games is ' + str(gameNumber))
                # For loop to print all analysis
                for i in range (gameNumber):
                    print('Game number: ' + str(i))
                    count = 0
                    #f.write("\n\n" + "New game! Game #" + str(i) + "\n")
                    game = chess.pgn.read_game(pgn)
                    board = game.board()
                    # oneGame.clear()
                    for move in game.mainline_moves():
                        board.push(move)
                        analysis = await engine.analyse(board, chess.engine.Limit(time=level)) # Time to analyze each move. Higher = more accuracy and longer compile time, default is 1.00
                        side = chess.engine.PovScore(board.turn, chess.WHITE)
                        x = analysis["score"]
                        x = str(x)
                        
                        if str(side) == "False":
                            if '-' in x:
                                x = x.replace('-','+')
                            elif '+' in x:
                                x = x.replace('+','-')
                            else:
                                x = x

                        if str(side) == "True":
                            pi = 3.14
                            #f.write(x + "\n" )
                        else:
                            count = count + 1
                            print(count)

                            #f.write(str(count) + ". " + x + " ")
                        moveEval.append(x)
                    #oneGame.clear()

                await engine.quit()

    asyncio.set_event_loop_policy(chess.engine.EventLoopPolicy())
    asyncio.run(main())
    return moveEval
