function easiestLoss() {
    var easiestLossPromise = new Promise(
      function (resolve, reject) {

        var myElo = 0;
        var enemyElo = 0;
        var eloDifference = 0;
        var highestEloDifference = 0;
        var savedGame = 0;
        var chesstest = new Chess();
        var rebuildPGN = [];
        var mathNumber = 1;
        var thisFEN = '';
        var didIWin = 1;

        for (bucket in bucketValues) {
          for (game in myData[bucket]) {
            mathNumber = 1;
            white = myData[bucket][game].White
            black = myData[bucket][game].Black
            site = myData[bucket][game].Site

            if (sesUser.toUpperCase() == white.toUpperCase()){
              userColor = 'White';
              if (myData[bucket][game].Score == '0-1') {
                didIWin = 0;
              }
              else {
                didIWin = 1;
              }

              myElo = myData[bucket][game].WhiteElo
              enemyElo = myData[bucket][game].BlackElo
            } else if (sesUser.toUpperCase() == black.toUpperCase()) {
              userColor = 'Black';
              if (myData[bucket][game].Score == '1-0') {
                didIWin = 0;
              }
              else {
                didIWin = 1;
              }              
              enemyElo = myData[bucket][game].WhiteElo
              myElo = myData[bucket][game].BlackElo

            }

            eloDifference = myElo - enemyElo
            //console.log('elodiff: ' + eloDifference + ' White: ' + myData[bucket][game].White + ' Black: ' + myData[bucket][game].Black + ' Site: ' + myData[bucket][game].Site)
            

            if (eloDifference > highestEloDifference && didIWin == 0) {
                highestEloDifference = eloDifference
                savedGame = myData[bucket][game].Site
                rebuildPGN[0] = ''

                // Rebuild the PGN format from the individual moves, then convert to FEN.
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
        document.getElementById('easiestLossWhite').innerHTML = '' + rebuildPGN[1] + ' - ' + rebuildPGN[4] + "<br>";
        document.getElementById('easiestLossBlack').innerHTML = rebuildPGN[2] + ' - ' + rebuildPGN[5]
        document.getElementById('easiestLossType').innerHTML =  rebuildPGN[6] + " - " + rebuildPGN[7]

        cg = Chessground(easiestLossDiv, { animation: { duration: 200 }, highlight: { lastMove: true, check: true }, fen: thisFEN, resizable: true, movable: { free: true } })
        rebuildPGN[3] = rebuildPGN[3].replace('"', '')

        var old_element = document.getElementsByClassName("easiestLossButton")[0];
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);

        var listener = function() {
          window.open(rebuildPGN[3], "The game", "width=950, height=700")
        }
        document.getElementsByClassName('easiestLossButton')[0].addEventListener("click", listener)

        if (cg) { resolve(cg); console.log(cg) } else {reject('Chart could not be built. Check data.')}
      }
    )
    return easiestLossPromise
}
    
exports.easiestLoss = easiestLoss; 
