'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| ExamenSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Examen = use('App/Models/Examen')
const examenData = [
  {
    _id: new ObjectId('6079d4fd28ec030054537efe'),
    name: 'Exámenes PER',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537eff'),
    name: 'Exámenes PER Madrid',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f00'),
    name: 'Exámenes PER C. Valenciana',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f01'),
    name: 'Exámenes PER Murcia',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f02'),
    name: 'Exámenes PER Andalucía',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f03'),
    name: 'Exámenes PER Euskadi',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f04'),
    name: 'Exámenes PER Asturias',
  },
  {
    _id: new ObjectId('6079d4fe28ec030054537f05'),
    name: 'Exámenes PER Baleares',
  }
]
class ExamenSeeder {
  /* async run () {
    for (let i in examenData) {
      let examen = await Examen.findBy('_id', examenData[i]._id)
      if (!examen) {
        await Examen.create(examenData[i])
      }
    }
    console.log('Finished Examen')
  } */
}

module.exports = ExamenSeeder
