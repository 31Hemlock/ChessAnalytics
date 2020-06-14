function castlingStyle() {
    var castlingPromise = new Promise(
        function(resolve, reject) {
            var score = [];
            var currentColor = '';

            var whiteMoves = [];
            var blackMoves = [];
            var noneCastle = [];
            var kingCastle = [];
            var queenCastle = [];
            var didIWin = [];
            var queenCastleSolution = [];
            var kingCastleSolution = [];
            var noneCastleSolution = [];

            for (bucket in bucketValues) {

                // Iterates through the game documents to process the data into more useful formats.
                for (game in myData[bucket]) {
                    
                    // Clear the move-tracking arrays:
                    whiteMoves = [];
                    blackMoves = [];

                    // Finds the color of the user.
                    score.push(myData[bucket][game].Result);
                    if (store.get('user').toUpperCase() == myData[bucket][game].White.toUpperCase()){
                        //userColor.push('White');
                        currentColor = 'White';
                        if (myData[bucket][game].Result == '1-0') {
                            didIWin = 'win'
                        } else if (myData[bucket][game].Result == '0-1'){
                            didIWin = 'loss'
                        } else {
                            didIWin = 'draw'
                        }
                    }
                    else if (store.get('user').toUpperCase() == myData[bucket][game].Black.toUpperCase()) {
                        currentColor = 'Black';
                        if (myData[bucket][game].Result == '0-1') {
                            didIWin = 'win'
                        } else if (myData[bucket][game].Result == '1-0'){
                            didIWin = 'loss'
                        } else {
                            didIWin = 'draw'
                        }

                    }
                    else {
                        //userColor.push("that's illegal");
                        console.log('currentColor is neither white nor black.')
                    }
                    // Loads the main data array with results

                    // Sorts the moves of the game into two groups - white and black.
                    for (moveNumber in myData[bucket][game].PGN) {
                        if (moveNumber % 2 == 0) {
                            whiteMoves.push(myData[bucket][game].PGN[moveNumber]);
                        } else {
                            blackMoves.push(myData[bucket][game].PGN[moveNumber]);
                        }
                    }

                    // Calculate answers
                    if (whiteMoves.includes('O-O-O') && currentColor == 'White') {
                        queenCastle.push(didIWin)

                    } else if (blackMoves.includes('O-O-O') && currentColor == 'Black') {
                        queenCastle.push(didIWin)

                    } else if (whiteMoves.includes('O-O') && currentColor == 'White') {
                        kingCastle.push(didIWin)

                    } else if (blackMoves.includes('O-O') && currentColor == 'Black') {
                        kingCastle.push(didIWin)

                    } else {
                        noneCastle.push(didIWin)
                    }
                }

                //Calculations
                queenCastleSolution[0] = queenCastle.filter(function(x){ return x === "win"; }).length
                queenCastleSolution[1] = queenCastle.filter(function(x){ return x === "loss"; }).length
                queenCastleSolution[2] = queenCastle.filter(function(x){ return x === "draw"; }).length
                kingCastleSolution[0] = kingCastle.filter(function(x){ return x === "win"; }).length
                kingCastleSolution[1] = kingCastle.filter(function(x){ return x === "loss"; }).length
                kingCastleSolution[2] = kingCastle.filter(function(x){ return x === "draw"; }).length
                noneCastleSolution[0] = noneCastle.filter(function(x){ return x === "win"; }).length
                noneCastleSolution[1] = noneCastle.filter(function(x){ return x === "loss"; }).length
                noneCastleSolution[2] = noneCastle.filter(function(x){ return x === "draw"; }).length

            }          
            
                
                
        castlingChart = Highcharts.chart('castlingWell', {
            chart: {
                type: 'column'
    
    
            },
            title: {
                text: 'Winrate by Castling Choice'
            },
            xAxis: {
                categories: ['Kingside', 'Queenside', 'None'],
                labels: {
                    style: {
                        fontSize:'15px'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Percentage of Games'
                },
                labels: {
                    format: '{value}%',
                    style: {
                        fontSize: '15px'
                    }
                },
                stackLabels: {
                    enabled: false,
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
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
    
            },
            plotOptions: {
                column: {
                    stacking: 'percent',
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
                name: 'Draw',
                data: [kingCastleSolution[2], queenCastleSolution[2], noneCastleSolution[2]],
                color: '#2b908f'
    
            }, {
                name: 'Loss',
                data: [kingCastleSolution[1], queenCastleSolution[1], noneCastleSolution[1]],
                color: '#f45b5b'
    
            }, {
                name: 'Win',
                data: [kingCastleSolution[0], queenCastleSolution[0], noneCastleSolution[0]],
                color: '#90ee7e'
    
            
            }]
    
        });
            if (castlingChart) {
                resolve(castlingPromise)
              } else {
                reject('Chart could not be built. Check data.')
              }
            }
    )
}
exports.castlingStyle = castlingStyle;