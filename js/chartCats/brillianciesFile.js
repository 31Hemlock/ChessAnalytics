function brilliancies() {
    var brilliancyPromise = new Promise(
      function (resolve, reject) {

        var keepBrilliancies = [1, 2, 3];
        var keepBrillianciesMove = [];
        var f = 1;
        var keepPreviousValue = [];
        var lowestBrilliancy = 0;
        var lowestBrilliancyPosition = 0;
        var keepBrilliancyPGN = [];
        var keepBrilliancyPosition = [];
        var keepBrilliancyGame = [];
        var userColor = '';

        for (bucket in bucketValues) {
          for (game in myData[bucket]) {
            console.log(myData[bucket][game].Site)
            keepPreviousValue = [];
            lowestBrilliancy = 0;
            centipawnChange = 0;
            if (sesUser.toUpperCase() == myData[bucket][game].White.toUpperCase()){
              userColor = 'White';
            } else if (sesUser.toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
              userColor = 'Black';
            }
            
              for (centipawn in myData[bucket][game].Evaluation) {
                
                centipawn = parseInt(centipawn);
                  nextValue = centipawn + 1;

                  centiValue = myData[bucket][game].Evaluation[centipawn]
                  
                  // If the centipawn value is a mating sequence, convert to a very high number.
                  if (/#-\d/.test(centiValue)) {
                      centiValue = -7500
                  } else if (/#\d/.test(centiValue)) {
                      centiValue = 7500
                  }
                  centiValue = parseInt(centiValue)

                  if (centipawn == 0) {
                      keepPreviousValue.push(0)
                      keepPreviousValue.push(centiValue)
                  } else {
                      keepPreviousValue.push(centiValue)
                  }
                  centipawnChange = keepPreviousValue[nextValue] - keepPreviousValue[centipawn]
                  if (centipawnChange > 0 && userColor == 'White' || centipawnChange < 0 && userColor == 'Black')
                  centipawnChange = Math.abs(centipawnChange)
                  label = '';
                  // get lowest value in keepBrilliancies array
                  lowestBrilliancy = Math.min(...keepBrilliancies)
                  lowestBrilliancyPosition = keepBrilliancies.indexOf(lowestBrilliancy)
                  console.log(centipawnChange)
                  if (centipawnChange >= lowestBrilliancy) {
                    keepBrilliancies[lowestBrilliancyPosition] = centipawnChange
                    keepBrilliancyGame[lowestBrilliancyPosition] = myData[bucket][game].Site
                    keepBrilliancyPGN[lowestBrilliancyPosition] = myData[bucket][game].PGN
                    keepBrilliancyPosition[lowestBrilliancyPosition] = myData[bucket][game].PGN[centipawn]
                  }

              }

          }
            
        }
        console.log(keepBrilliancies)
        console.log(keepBrilliancyPGN)
        console.log(keepBrilliancyPosition)
        console.log(keepBrilliancyGame)

        if (keepBrilliancies) { resolve(keepBrilliancies); console.log(keepBrilliancies) } else {reject('Chart could not be built. Check data.')}
      }


      )
    return brilliancyPromise
}
    
exports.brilliancies = brilliancies;