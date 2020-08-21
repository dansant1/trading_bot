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

let candles = async ( symbol, startTime, endTime, interval ) => {

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

var d = new Date();
d.setDate(d.getDate() - 1);

var v = new Date();
v.setDate(v.getDate() - 2);

var interval = "1m"

candles( 'BTCUSDT', v.getTime(), d.getTime(), interval )

async function getCambios ( maximo, minimo, symbol ) {

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

/*let getMaximo = async () => {

    try {
        
        let velas = candles( 'BTCUSD' );
        
        setTimeout( function () {
        
            let maximos = []
    
            let maximo;

            console.log( "VELAS: ", velas )
    
            velas.forEach( vela => {
                maximos.push( parseFloat( vela.high ) )
            })
    
            maximo = max( maximos )
    
            console.log( "MAXIMO: ", maximo )
    
            return maximo;
    
        }, 10000)

    } catch ( error ) {
        console.log( error )
    }

} */

console.log("server running")

//getMaximo()

