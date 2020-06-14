var numberOfGamesSol = [];
function numberOfGames() {
    var gamesPromise = new Promise(
      function (resolve, reject) {
        numberOfGamesSol = [];

        
        // Arithmetic portion to create solution
        for (bucket in bucketValues) {
          numberOfGamesSol[bucket] = myData[bucket].length;
        }
        
        //Actual chart creation
        numberOfGamesChart = Highcharts.chart('numberOfGamesWell', {
          chart: {
              type: 'column'
              //width: 700,
              //height: 500
          },
          title: {
              text: 'Number of Games'
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
              name: 'Games played',
              data: numberOfGamesSol,
              color: '#2b908f'

          }]
      });
      if (numberOfGamesChart) {
        resolve(numberOfGamesSol)
      } else {
        reject('Chart could not be built. Check data.')
      }


    }
  )
    return gamesPromise
}
    
exports.numberOfGames = numberOfGames;

