'use strict'
var ObjectId = require('mongodb').ObjectId;
/*
|--------------------------------------------------------------------------
| CategoriaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Asignatura = use("App/Models/Asignatura")
const asignaturaData = [
  {
    name: 'CULTURA GENERAL',
    description: '',
    img: 'app movil 24.png',
    status: false
  },
  {
    name: 'LENGUAJE',
    description: '',
    img: 'app movil 21.png',
    status: false
  },
  {
    name: 'MATE I',
    description: '',
    img: 'app movil 19.png',
    status: false
  },
  {
    name: 'MATE II',
    description: '',
    img: 'app movil 22.png',
    status: false
  },
  {
    name: 'RAZ LÓGICO',
    description: '',
    img: 'app movil 20.png',
    status: false
  }
]
class AsignaturaSeeder {
  async run () {
    for (let i in asignaturaData) {
      let asignatura = await Asignatura.findBy('_id', asignaturaData[i]._id)
      if (!asignatura) {
        await Asignatura.create(asignaturaData[i])
      }
    }
    console.log('Finished Asignatura')
  }
}

module.exports = AsignaturaSeeder
