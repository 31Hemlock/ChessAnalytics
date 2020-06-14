
function lowCentipawnLoss() {
    var LCLPromise = new Promise(
      function (resolve, reject) {

        var lowCentipawnLossSol = [];
        var whiteMoves = [];
        var blackMoves = [];
        var myMoves = [];
        var totalMoves = 0;
        possibleAnswer = 0;
        
        // Arithmetic portion to create solution
        // First, find the color of the user. Then, if white, add all even-numbered values (0, 2, 4, 6). opposite for black.

        if (sesUser.toUpperCase() == myData[bucket][game].White.toUpperCase()){
            userColor.push('White');
            currentColor = 'White';
        } else if (sesUser.toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
            userColor.push('Black');
            currentColor = 'Black';
        }

        for (bucket in bucketValues) {
            for (game in myData[bucket]) {
                whiteMoves = [];
                blackMoves = [];
                totalMoves = 0;

                for (moveNumber in myData[bucket][game].PGN) {
                    if (currentColor == 'White') {
                        if (moveNumber % 2 == 0) {
                            myMoves.push(myData[bucket][game].Evaluation[moveNumber]);
                            totalMoves += 1
                        }
                    } else if (currentColor == 'Black') {
                        if (moveNumber % 2 == 1) {
                            myMoves.push(myData[bucket][game].Evaluation[moveNumber]);
                            totalMoves += 1
                        }
                    }   
                }
                possibleAnswer = myMoves.reduce() / totalMoves
                if (possibleAnswer > lowCentipawnLossSol) {
                    lowCentipawnLossSol = possibleAnswer
                }
            }





        }

        

        //Actual chart creation
        lowCentipawnLossChart = Highcharts.chart('lowCentipawnLossWell', {
          chart: {
              type: 'column'
              //width: 700,
              //height: 500
          },
          title: {
              text: 'Games per Format'
          },
          xAxis: {
              categories: prettyBucketValues,
              labels: {
                  style: {
                      //fontSize:'15px'
                  }
              }
          },
          yAxis: {
              min: 0,
              title: {
                  //text: 'Percentage of games'
              },
              labels: {
                  //format: '{value}%',
                  style: {
                      //fontSize: '12px'
                  }
              },
              stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: ( // theme
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  },

              }
              
          },

          tooltip: {
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>', //              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',


          },
          plotOptions: {
              column: {
                  dataLabels: {
                      enabled: false,
                      y: 10, // 10 pixels down from the top
                      style: {
                          fontSize: '30px',
                      }
                  }
              },
              
          },
          series: [{
              name: 'Bullet',
              data: bulletSol,

            },{
                name: 'Blitz',
                data: blitzSol,

            }, {
                name: 'Rapid',
                data: rapidSol,

            }//, {
            //    name: 'Classical',
            //    data: classicalSol,
                //color: '#2b908f'

            ]
        });


      if (lowCentipawnLossChart) {
        resolve(lowCentipawnLossSol)
      } else {
        reject('Chart could not be built. Check data.')
      }
    }
  )
    return LCLPromise
}
    
exports.lowCentipawnLoss = lowCentipawnLoss; 

