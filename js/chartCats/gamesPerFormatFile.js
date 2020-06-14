
function gamesPerFormat() {
    var GPFPromise = new Promise(
      function (resolve, reject) {

        var gamesPerFormatSol = [];

        var bulletSol = [];
        var bulletSolValue = 0;
        
        var blitzSol = [];
        var blitzSolValue = 0;
        
        var rapidSol = [];
        var rapidSolValue = 0;
        
        var classicalSol = [];
        var classicalSolValue = 0;
        
        // Arithmetic portion to create solution
        for (bucket in bucketValues) {
            for (game in myData[bucket]) {
                if (myData[bucket][game].Event == 'Rated Bullet game') {
                    bulletSolValue += 1
                }
                if (myData[bucket][game].Event == 'Rated Blitz game') {
                    blitzSolValue += 1
                }
                if (myData[bucket][game].Event == 'Rated Rapid game') {
                    rapidSolValue += 1
                }
                if (myData[bucket][game].Event == 'Rated Classical game') {
                    classicalSolValue += 1
                }
            }
            bulletSol.push(bulletSolValue)
            blitzSol.push(blitzSolValue)
            rapidSol.push(rapidSolValue)
            classicalSol.push(classicalSolValue)
            bulletSolValue = 0;
            blitzSolValue = 0;
            rapidSolValue = 0;
            classicalSolValue = 0;

            gamesPerFormatSol[bucket] = myData[bucket].length;




        }

        

        //Actual chart creation
        gamesPerFormatChart = Highcharts.chart('gamesPerFormatWell', {
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



      if (gamesPerFormatChart) {
        resolve(gamesPerFormatSol)
      } else {
        reject('Chart could not be built. Check data.')
      }
    }
  )
    return GPFPromise
}
    
exports.gamesPerFormat = gamesPerFormat; 

