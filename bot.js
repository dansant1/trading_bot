const Binance = require('binance-api-node').default;

const axios = require('axios');

const url = "http://localhost:3000/"

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

const getCambios = async ( maximo, minimo, symbol, _id, minimo_primero_cambio ) => {

    try {

        let currentPrice = await client.prices()

        let minimo_primero_cambio = 0;

        console.log( "PRECIO ACTUAL: ", currentPrice[symbol] )

        let message = "";

        if ( currentPrice[symbol] > maximo ) {
        
            message = "2DO CAMBIO"
        
        } else if ( currentPrice[symbol] < minimo ) {
        
            message = "1ER CAMBIO"

            minimo_primero_cambio = currentPrice[symbol]
        
        } else {

            message = "DENTRO DEL MAXIMO Y MINIMO"
        
        }

        let puntos = maximo - minimo;

        if ( minimo_primero_cambio !== 0 ) {

            if ( currentPrice[symbol] < minimo_primero_cambio ) {
                message = message + " Y EL PRECIO ROMPIO EL MINIMO DEL 1ER CAMBIO"
            }

        }

        let data = {
            _id,
            symbol,
            maximo,
            minimo,
            puntos,
            message,
            minimo_primero_cambio
        };

          // AQUI Hacemos una llamda HTTP a Meteor para gestionar los inventarios del vendedores y del comprador
          axios({
            method: 'post',
            url: `${url}methods/update_config`,
            data,
          })
          .then(response => {
              console.log( response.status );
          })        
          .catch(error => {
              console.log(error);
          });


    } catch( error ) {

    }

}

const candles = async ( symbol, startTime, endTime, interval, _id, minimo_primero_cambio ) => {

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

        getCambios( maximo, minimo, symbol, _id, minimo_primero_cambio ).then( data => {
            console.log( data )
        }).catch( error => {
            console.log( error )
        })


    } catch (error) {

        console.log( error )   
    
    }

}


module.exports = {
    getData: function ( symbol, startTime, endTime, interval, _id, minimo_primero_cambio ) {
        candles( symbol, startTime, endTime, interval, _id, minimo_primero_cambio )
    }
}