'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| TitleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Title = use("App/Models/Title")
const titleData = [
  {
    _id: new ObjectId('608964970eb52e7c74d66d17'),
    name: 'Principiante',
    nomenclature: 'P'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d19'),
    name: 'Iniciado',
    nomenclature: 'I'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1b'),
    name: 'Avanzado',
    nomenclature: 'PER'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1d'),
    name: 'Experto',
    nomenclature: 'E'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1f'),
    name: 'Maestro',
    nomenclature: 'PY'
  }
  /* {
    _id: new ObjectId('608964970eb52e7c74d66d17'),
    name: 'Licencia de navegación',
    nomenclature: 'LN'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d19'),
    name: 'Patrón de Navegación Básico, del tema 1 al 6',
    nomenclature: 'PNB'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1b'),
    name: 'Patrón de Embarcaciones de Recreo del tema 1 al 11',
    nomenclature: 'PER'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1d'),
    name: 'Reducido, del tema 7 al 11',
    nomenclature: 'PER'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d1f'),
    name: 'Patrón de Yate',
    nomenclature: 'PY'
  },
  {
    _id: new ObjectId('608964990eb52e7c74d66d21'),
    name: 'Capitán de Yate',
    nomenclature: 'CY'
  } */
]

class TitleSeeder {
  async run () {
    for (let i in titleData) {
      let title = await Title.findBy('_id', titleData[i]._id)
      if (!title) {
        await Title.create(titleData[i])
      }
    }
    console.log('Finished Title')
  }
}

module.exports = TitleSeeder
