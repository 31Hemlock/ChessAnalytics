function highestDailyGames() {
    var highestDailyGamesPromise = new Promise(
        function (resolve, reject) {
            var keepTrack = [];
            var keepCount = [];
            var solution = 0;



            for (bucket in bucketValues) {
                for (item in myData[bucket]) {
                    date = myData[bucket][item].Date.toString().slice(0, 15)

                    if (keepTrack.includes(date)) {
                        if (keepCount[keepTrack.indexOf(date)]) {
                            keepCount[keepTrack.indexOf(date)] = keepCount[keepTrack.indexOf(date)] + 1
                        } else {
                            keepCount[keepTrack.indexOf(date)] = 1
                        }
                    } else {
                        keepTrack.push(date)

                    }

                }
            }
            var indexOfMaxValue = keepCount.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            solution = keepTrack[indexOfMaxValue]
            console.log(solution)

                
            if (solution) {
                resolve(solution)
            } else {
                reject('Chart could not be built. Check data.')
            }
        }

    )
    return highestDailyGamesPromise
  }
    
  exports.highestDailyGames = highestDailyGames; 
