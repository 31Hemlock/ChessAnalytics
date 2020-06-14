function blunderTimePeriod() {
    var blunderPromise = new Promise(
      function (resolve, reject) {
          var centiValue = 0;
          var keepPreviousValue = [];
          var centipawnChange = 0;
          var blunderCount = 0;
          var blunderTimePeriodSol = [];
          var gameCount = 0;
          var nextValue = 0;
          var k;
        
        // Arithmetic portion to create solution
        for (bucket in bucketValues) {
            // These variables count the number of games and blunders per time period (bucket).
            blunderCount = 0;
            gameCount = 0;
            for (game in myData[bucket]) {
                if (sesUser.toUpperCase() == myData[bucket][game].White.toUpperCase()){
                    currentColor = 'White';
                } else if (sesUser.toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
                    currentColor = 'Black';
                }
                keepPreviousValue = [];
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
                    //console.log(centiValue)

                    if (centipawn == 0) {
                        keepPreviousValue.push(0)
                        keepPreviousValue.push(centiValue)
                    } else {
                        keepPreviousValue.push(centiValue)
                    }


                    centipawnChange = keepPreviousValue[nextValue] - keepPreviousValue[centipawn]
                    centipawnChange = Math.abs(centipawnChange)
                    //console.log(centipawnChange)
                    label = '';
                    //console.log(centipawnChange)
                    if (centipawnChange >= 300) {
                        if (currentColor == 'White' && centipawn % 2 == 1) {
                            blunderCount += 1;
                            label = 'Blunder';
                        } else if (currentColor == 'Black' && centipawn % 2 == 0) {
                            blunderCount += 1;
                            label = 'Blunder';
                        }
                    }

                    // These are here if I ever want to count the number of other kinds of mistakes I've made.
                    //} else if (centipawnChange >= 100 && centipawnChange < 300) {
                   //     label = 'Mistake';
                    //} else if (centipawnChange >= 50 && centipawnChange < 100) {
                    //    label = 'Inaccuracy';
                    //} else {
                    //    label = 'None';
                    //}
                    //console.log(centipawn)
                    //console.log(myData[bucket][game].PGN[centipawn])
                    //console.log(centiValue)
                    //winChance = 50 + 50 * (2 / (1 + Math.exp(-0.004 * myData[bucket][game].Eval[centipawn])) - 1)
                    //winChance = 50 + 50 * (2 / (1 + Math.exp(-0.004 * centiValue)) - 1) // White's chance of winning
                    //determineLabel = 100 * (2 / (1 + Math.exp(-0.005 * centiValue)) - 1)
                    //console.log(winChance)
                    //console.log(determineLabel)
                }

                gameCount = gameCount += 1
            }
            blunderTimePeriodSol[bucket] = parseFloat((blunderCount / gameCount).toFixed(2));
            //console.log(blunderTimePeriodSol)
        }


    // Actual chart creation
    blunderTimePeriodChart = Highcharts.chart('blunderTimePeriodWell', {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Average Amount of Blunders over Time'
    },
    xAxis: {
        categories: prettyBucketValues
    },
    yAxis: {
        title: {
            text: 'Average Blunders per Game'
        },
        min: 0
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },

    series: [{
        type: 'area',
        name: 'Amount of Blunders',
        data: blunderTimePeriodSol
    }]
});


      if (blunderTimePeriodChart) {
        resolve(blunderTimePeriodSol)
      } else {
        reject('Chart could not be built. Check data.')
      }
    }
  )
    return blunderPromise
}
    
exports.blunderTimePeriod = blunderTimePeriod;

