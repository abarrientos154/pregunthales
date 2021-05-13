'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| CommunitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Community = use("App/Models/Community")
const communityData = [
  {
    _id: new ObjectId('60912d97556b217e7c8a0d62'),
    // id: 1,
    name: 'Andalucía'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d64'),
    // id: 2,
    name: 'Aragón'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d66'),
    // id: 3,
    name: 'Canarias'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d68'),
    // id: 4,
    name: 'Cataluña'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6a'),
    // id: 5,
    name: 'Ceuta'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6c'),
    // id: 6,
    name: 'Comunidad de Madrid'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d6e'),
    // id: 7,
    name: 'Comunidad Valenciana'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d70'),
    // id: 8,
    name: 'Euskadi'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d72'),
    // id: 9,
    name: 'Galicia'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d74'),
    // id: 10,
    name: 'Islas Baleares'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d76'),
    // id: 11,
    name: 'Melilla'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d78'),
    // id: 12,
    name: 'Principado de Arturias'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d7a'),
    // id: 13,
    name: 'Region de Murcia'
  },
  {
    _id: new ObjectId('60912d98556b217e7c8a0d7c'),
    // id: 14,
    name: 'Cantabria'
  }
]

class CommunitySeeder {
  /* async run () {
    for (let i in communityData) {
      let community = await Community.findBy('_id', communityData[i]._id)
      if (!community) {
        await Community.create(communityData[i])
      }
    }
    console.log('Finished Community')
  } */
}

module.exports = CommunitySeeder
