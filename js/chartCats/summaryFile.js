function summary() {
    var summaryPromise = new Promise(
      function (resolve, reject) {
        var summarySol = '';
        var totalGames = 0;
        fancyGames = '';
        var timePeriod = '';
        var alot = '';
        var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        var timePeriod = ''
        var plural = ''
        var gamesPerPeriod = 0;
        var gamesPerPeriodSol = '';
        for (item in myData) {
          // find total amount of games
          totalGames += myData[item].length
          
        }
        if (buttonID == 'Daily') {timePeriod = 'day'; timeLength = '7'; plural = 's'} else if (buttonID == 'Monthly') {timePeriod = 'month'; timeLength = '12'; plural = 's'} else if (buttonID == 'Yearly') {timePeriod = 'year'; timeLength = bucketValues.length; if (timeLength == 1) {plural = ''} else {plural = 's'}}

        document.getElementById('summaryTitle').innerHTML = 'Summary'

        fancyGames = totalGames.toLocaleString()

        summarySol = "You've played " + fancyGames + " games over the past "
        if (plural == 's') {summarySol += timeLength + ' ' + timePeriod + plural + '.'} else {summarySol += timePeriod + '.'}

        if (totalGames == 0) {
          summarySol += ' Try selecting a timeframe with more data.'
          document.getElementById('summaryDiv').innerHTML = summarySol        
          resolve(summarySol)
        } else if (totalGames > 1000) {
          //summarySol += " That's a lot!"
        }
        console.log(parseInt(fancyGames))
        console.log(parseInt(timeLength))
        gamesPerPeriod = totalGames / parseInt(timeLength)
        gamesPerPeriod = parseInt(gamesPerPeriod)
        gamesPerPeriodSol = "That's a total of approximately " + gamesPerPeriod + " games per " + timePeriod + '.'
        if (totalGames > 0) {
          summarySol += gamesPerPeriodSol
        }
        document.getElementById('summaryDiv').innerHTML = summarySol        


      if (document.getElementById('summaryDiv').innerHTML == summarySol) {
        resolve(summarySol)
      } else {
        reject('Chart could not be built. Check data.')
      }
    }
  )
    return summaryPromise
  }
    
  exports.summary = summary;
  