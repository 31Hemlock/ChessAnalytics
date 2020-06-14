function craziestGame() {
    var craziestGamePromise = new Promise(
      function (resolve, reject) {

        var myElo = 0;
        var enemyElo = 0;
        var eloDifference = 0;
        var highestCrazinessFactor = 0;
        var savedGame = 0;
        var chesstest = new Chess();
        var pgnNumber = 0;
        var mathNumber = 1;
        var thisFEN = '';
        var crazySiteURL = '';
        var crazinessFactor = 0;
        var lastMove = 0;
        var centiValue = 0;
        var keepPreviousValue = [];
        var rebuildPGN = [];
        var gameNumber = 0;

        for (bucket in bucketValues) {

          for (game in myData[bucket]) {
            gameNumber += 1
            crazinessFactor = 0;

            mathNumber = 1;
            lastMove = 0;
            keepPreviousValue = [];
            white = myData[bucket][game].White
            black = myData[bucket][game].Black
            site = myData[bucket][game].Site

            if (sesUser.toUpperCase() == myData[bucket][game].White.toUpperCase()){
              userColor = 'White';
              myElo = myData[bucket][game].WhiteElo
              enemyElo = myData[bucket][game].BlackElo
            } else if (sesUser.toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
              userColor = 'Black';
              enemyElo = myData[bucket][game].WhiteElo
              myElo = myData[bucket][game].BlackElo
            }

            for (move in myData[bucket][game].Evaluation) {
                move = parseInt(move);
                nextValue = move + 1;
                centiValue = myData[bucket][game].Evaluation[move]
                
                // If the centipawn value is a mating sequence, convert to a very high number.
                if (/#-\d/.test(centiValue)) {
                    centiValue = -7500
                } else if (/#\+\d/.test(centiValue)) {
                    centiValue = 7500
                }
                centiValue = parseInt(centiValue)

                if (move == 0) {
                    keepPreviousValue.push(0)
                    keepPreviousValue.push(centiValue)
                } else {
                    keepPreviousValue.push(centiValue)
                }


                centipawnChange = keepPreviousValue[nextValue] - keepPreviousValue[move]
                centipawnChange = Math.abs(centipawnChange)
                crazinessFactor = crazinessFactor + centipawnChange

            }

            

            if (crazinessFactor > highestCrazinessFactor) {
                highestCrazinessFactor = crazinessFactor
                savedGame = myData[bucket][game].Site

                // Rebuild the PGN format from the individual moves, then convert to FEN.
                rebuildPGN[0] = ''

                for (item in myData[bucket][game].PGN) {
                  if (item % 2 == 0) {
                    rebuildPGN[0] += '' + mathNumber + '.'
                    mathNumber += 1
                  }
                  rebuildPGN[0] += '' + myData[bucket][game].PGN[item] + ' '
                }
                rebuildPGN[1] = white
                rebuildPGN[2] = black
                rebuildPGN[3] = savedGame
                rebuildPGN[4] = myData[bucket][game].WhiteElo
                rebuildPGN[5] = myData[bucket][game].BlackElo
                xy = myData[bucket][game].Event
                xz = myData[bucket][game].Date
                
                rebuildPGN[6] = xy.split(' ')[1]
                rebuildPGN[7] = '' + months[xz.getMonth()] + ' ' + xz.getDate() + ', ' + xz.getFullYear()

            }
            
          }
            
        }
        chesstest.load_pgn(rebuildPGN[0]);
        thisFEN = chesstest.fen();
        document.getElementById('craziestGameWhite').innerHTML =  '' + rebuildPGN[1] + ' - ' + rebuildPGN[4] + "<br>";
        document.getElementById('craziestGameBlack').innerHTML =  rebuildPGN[2] + ' - ' + rebuildPGN[5]
        document.getElementById('craziestGameType').innerHTML =  rebuildPGN[6] + " - " + rebuildPGN[7]

        cg = Chessground(craziestGameDiv, { animation: { duration: 200 }, highlight: { lastMove: true, check: true }, fen: thisFEN, resizable: true, movable: { free: true } })
        rebuildPGN[3] = rebuildPGN[3].replace('"', '')

        var old_element = document.getElementsByClassName("craziestGameButton")[0];
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);

        var listener = function() {
          window.open(rebuildPGN[3], "The game", "width=950, height=700")
        }
        document.getElementsByClassName('craziestGameButton')[0].addEventListener("click", listener)
        
        if (cg) { resolve(cg); console.log(cg) } else {reject('Chart could not be built. Check data.')}
      }
    )
    return craziestGamePromise
}
    
exports.craziestGame = craziestGame; 