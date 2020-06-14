function blunderTimeDay() {
    var blunderDayPromise = new Promise(
      function (resolve, reject) {
          var centiValue = 0;
          var keepPreviousValue = [];
          var centipawnChange = 0;
          var blunderTimeDaySol = [];
          var blunderTimeDay = [0, 0, 0, 0, 0, 0, 0, 0];
          var gameTimeDay = [0, 0, 0, 0, 0, 0, 0, 0];
          var nextValue = 0;
          var saveGameTime = '';
          var currentColor = '';
          var unrelatedBuckets = ['11PM-1AM', '2AM-4AM', '5AM-7AM', '8AM-10AM', '11AM-1PM', '2PM-4PM', '5PM-7PM', '8PM-10PM']
        
        // Arithmetic portion to create solution
          for (bucket in bucketValues) {
            for (game in myData[bucket]) {
              if (sesUser.toUpperCase() == myData[bucket][game].White.toUpperCase()){
                  currentColor = 'White';
              } else if (sesUser.toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
                  currentColor = 'Black';
              }
        
                keepPreviousValue = [];
                saveGameTime = myData[bucket][game].Date
                saveGameTime = saveGameTime.getHours();
                switch (saveGameTime) {
                      case 23:
                      case 0:
                      case 1:
                          saveGameTime = 0
                          break;
                      case 2:
                      case 3:
                      case 4:
                          saveGameTime = 1
                          break;
                      case 5:
                      case 6:
                      case 7:   
                          saveGameTime = 2
                          break;
                      case 8:
                      case 9:
                      case 10:
                          saveGameTime = 3
                          break;
                      case 11:
                      case 12:
                      case 13: 
                          saveGameTime = 4
                          break;
                      case 14:
                      case 15:
                      case 16:
                          saveGameTime = 5
                          break;
                      case 17:
                      case 18:
                      case 19: 
                          saveGameTime = 6
                          break;
                      case 20:
                      case 21:
                      case 22:
                          saveGameTime = 7
                          break;
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
                  centipawnChange = Math.abs(centipawnChange) // The absolute value of the change needs to be greater than 300.
                  label = '';
  
                  if (centipawnChange >= 300) { // If the absolute value of centipawnChange is > 300, a blunder has occurred.

  
                      if (currentColor == 'White' && move % 2 == 1) { // If I'm white and the current move is odd, it's my move.
                          blunderTimeDay[saveGameTime]++; // Adds one blunder to the corresponding time of day.
                      } else if (currentColor == 'Black' && move % 2 == 0) { // If I'm black and the current move is even, it's my move.
                          blunderTimeDay[saveGameTime]++; // Adds one blunder to the corresponding time of day.

                      }
                  }    
  
            }
          gameTimeDay[saveGameTime]++;
  
          for (item in gameTimeDay) {
              if (blunderTimeDay[item] == 0 && gameTimeDay[item] == 0) {
                  blunderTimeDaySol[item] = 0
              } else {
              blunderTimeDaySol[item] = parseFloat((blunderTimeDay[item] / gameTimeDay[item]).toFixed(2));
              }
              
          }
        }
      }
  
  
    // Actual chart creation
    blunderTimeDayChart = Highcharts.chart('blunderTimeDayWell', {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Blunders and Time of Day'
    },
    xAxis: {
        categories: unrelatedBuckets
    },
    yAxis: [{
        title: {
            text: 'Average Blunders per Game',
            style: {
              color: '#f45b5b'
          }
  
        },
        labels: {
          format: '{value} blunders',
          style: {
              color: '#f45b5b'
          }
      },
      min: 0, 
      softMin: 2
    }, { // Secondary yAxis
      title: {
          text: 'Number of Games',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
  
      },
      labels: {
          format: '{value} games',
          style: {
              color: Highcharts.getOptions().colors[0]
          }
      },
      min: 0,
      opposite: true
  }],
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
                    [0, '#b02a3a'],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.1).get('rgba')]
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
          },
          line: {
              opacity: 0.5
          },
          scatter: {
              marker: {
                  symbol: 'url(./images/linemetransparent.png)',
                  width: 80,
                  height: 80,
                  opacity: 1
  
              },
  
          }
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '<span style="color:{Highcharts.getOptions().colors[0]}">{series.name}</span>: <b>{point.y}</b><br/>', //              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
  
      },
  
    series: [{
        type: 'area',
        name: 'Average amount of blunders per game',
        data: blunderTimeDaySol,
        style: {
            color: '#f7a35c'
        }
    }, {
      type: 'scatter',
      name: 'Number of games',
      data: gameTimeDay,
      yAxis: 1
  
  
    }]
  });
  

  
      if (blunderTimeDayChart) {
        resolve(blunderTimeDaySol)
      } else {
        reject('Chart could not be built. Check data.')
      }
    }
  )
    return blunderDayPromise
  }
    
  exports.blunderTimeDay = blunderTimeDay;
  
  