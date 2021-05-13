'use strict'
var ObjectId = require('mongodb').ObjectId;

/*
|--------------------------------------------------------------------------
| PlaceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Place = use("App/Models/Place")
const placeData = [
  {
    id: 1,
    community_id: new ObjectId('60912d97556b217e7c8a0d62'),
    name: 'Málaga'
  },
  {
    id: 2,
    community_id: new ObjectId('60912d97556b217e7c8a0d62'),
    name: 'Cádiz'
  },
  {
    id: 3,
    community_id: new ObjectId('60912d97556b217e7c8a0d62'),
    name: 'Sevilla'
  },
  {
    id: 4,
    community_id: new ObjectId('60912d97556b217e7c8a0d62'),
    name: 'Almería'
  },
  {
    id: 5,
    community_id: new ObjectId('60912d97556b217e7c8a0d62'),
    name: 'Huelva'
  },
  {
    id: 6,
    community_id: new ObjectId('60912d98556b217e7c8a0d64'),
    name: 'Zaragoza'
  },
  {
    id: 7,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'Fuerteventura'
  },
  {
    id: 8,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'La Palma'
  },
  {
    id: 9,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'Gran Canaria'
  },
  {
    id: 10,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'Tenerife'
  },
  {
    id: 11,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'Lanzarote'
  },
  {
    id: 12,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'La Gomera'
  },
  {
    id: 13,
    community_id: new ObjectId('60912d98556b217e7c8a0d66'),
    name: 'El Hierro'
  },
  {
    id: 14,
    community_id: new ObjectId('60912d98556b217e7c8a0d7c'),
    name: 'Santander'
  },
  {
    id: 15,
    community_id: new ObjectId('60912d98556b217e7c8a0d68'),
    name: 'Barcelona'
  },
  {
    id: 16,
    community_id: new ObjectId('60912d98556b217e7c8a0d68'),
    name: 'Empuriabrava'
  },
  {
    id: 17,
    community_id: new ObjectId('60912d98556b217e7c8a0d68'),
    name: 'Girona'
  },
  {
    id: 18,
    community_id: new ObjectId('60912d98556b217e7c8a0d68'),
    name: 'Tarragona'
  },
  {
    id: 19,
    community_id: new ObjectId('60912d98556b217e7c8a0d68'),
    name: "l'Ametlla de Mar"
  },
  {
    id: 20,
    community_id: new ObjectId('60912d98556b217e7c8a0d6a'),
    name: 'Ceuta'
  },
  {
    id: 21,
    community_id: new ObjectId('60912d98556b217e7c8a0d6c'),
    name: 'Madrid'
  },
  {
    id: 22,
    community_id: new ObjectId('60912d98556b217e7c8a0d6e'),
    name: 'Valencia'
  },
  {
    id: 23,
    community_id: new ObjectId('60912d98556b217e7c8a0d6e'),
    name: 'Alicante'
  },
  {
    id: 24,
    community_id: new ObjectId('60912d98556b217e7c8a0d6e'),
    name: 'Castellón'
  },
  {
    id: 25,
    community_id: new ObjectId('60912d98556b217e7c8a0d70'),
    name: 'Alava'
  },
  {
    id: 26,
    community_id: new ObjectId('60912d98556b217e7c8a0d70'),
    name: 'Guipuzcoa'
  },
  {
    id: 27,
    community_id: new ObjectId('60912d98556b217e7c8a0d70'),
    name: 'Vizcaya'
  },
  {
    id: 28,
    community_id: new ObjectId('60912d98556b217e7c8a0d70'),
    name: 'Portugalete'
  },
  {
    id: 29,
    community_id: new ObjectId('60912d98556b217e7c8a0d70'),
    name: 'Pasai San Pedro'
  },
  {
    id: 30,
    community_id: new ObjectId('60912d98556b217e7c8a0d72'),
    name: 'Ferrol'
  },
  {
    id: 31,
    community_id: new ObjectId('60912d98556b217e7c8a0d72'),
    name: 'Ribeira'
  },
  {
    id: 32,
    community_id: new ObjectId('60912d98556b217e7c8a0d72'),
    name: 'Vigo'
  },
  {
    id: 33,
    community_id: new ObjectId('60912d98556b217e7c8a0d74'),
    name: 'Palma'
  },
  {
    id: 34,
    community_id: new ObjectId('60912d98556b217e7c8a0d74'),
    name: 'Ibiza'
  },
  {
    id: 35,
    community_id: new ObjectId('60912d98556b217e7c8a0d74'),
    name: 'Menorca'
  },
  {
    id: 36,
    community_id: new ObjectId('60912d98556b217e7c8a0d76'),
    name: 'Melilla'
  },
  {
    id: 37,
    community_id: new ObjectId('60912d98556b217e7c8a0d78'),
    name: 'Gijón'
  },
  {
    id: 38,
    community_id: new ObjectId('60912d98556b217e7c8a0d7a'),
    name: 'Murcia'
  },
  {
    id: 39,
    community_id: new ObjectId('60912d98556b217e7c8a0d7a'),
    name: 'Cartagena'
  }
]

class PlaceSeeder {
  /* async run () {
    for (let i in placeData) {
      let place = await Place.findBy('_id', placeData[i]._id)
      if (!place) {
        await Place.create(placeData[i])
      }
    }
    console.log('Finished Place')
  } */
}

module.exports = PlaceSeeder
