const Binance = require('binance-api-node').default;

// Authenticated client
const client = Binance({
  apiKey: 'PRNftqGtVHQQVEslaquiH9rxcUZKsVVp5s32VQi5NvCWROCJEXwtEb5WpMwTSXCR',
  apiSecret: 'AXkkoGMdQrDrMTLhPlDHMSWeOSlyzEXUQK2BdWPyWEsmJUqVoNsyC9TOp6ONUGPp'
})

const max = ( input ) => {

    if ( toString.call(input) !== "[object Array]" ) { return false; }
      
    return Math.max.apply(null, input);

}

const min = ( input ) => {

    if (toString.call(input) !== "[object Array]") {
        return false;
    }
    
    return Math.min.apply(null, input);
}

const getCambios = async ( maximo, minimo, symbol ) => {

    try {

        let currentPrice = await client.prices()

        console.log( "PRECIO ACTUAL: ", currentPrice[symbol] )

        if ( currentPrice[symbol] > maximo ) {
            return "2DO CAMBIO"
        }

        if ( currentPrice[symbol] < minimo ) {
            return "1ER CAMBIO"
        }

        return "DENTRO DEL MAXIMO Y MINIMO"

    } catch( error ) {

    }

}

const candles = async ( symbol, startTime, endTime, interval ) => {

    try {

        let data = await client.candles({ symbol, startTime, endTime, interval }) 

        let maximo;
        let minimo;

        let puntos = 0;

        let maximos = []
        let mminimos = []
        
        data.forEach( d => { 
            maximos.push( parseFloat( d.high ) )
        })

        data.forEach( d => { 
            mminimos.push( parseFloat( d.high ) )
        })

        maximo = max( maximos )

        minimo = min( mminimos )

        puntos = maximo - minimo

        console.log( "MAXIMO: ", maximo )
        console.log( "MIN: ", minimo )
        console.log( "PUNTOS: ", puntos )

        getCambios( maximo, minimo, symbol ).then( data => {
            console.log( data )
        }).catch( error => {
            console.log( error )
        })


    } catch (error) {

        console.log( error )   
    
    }

}


module.exports = {
    getData: function ( symbol, startTime, endTime, interval ) {
        candles( symbol, startTime, endTime, interval )
    }
}