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
    _id: new ObjectId('60748c7ca06b4e9171dfeb02'),
    name: 'Español',
    description: 'Descripción de la materia',
    img: 'app movil 21.png',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafc'),
    name: 'Matemática',
    description: 'Descripción de la materia',
    img: 'app movil 22.png',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafd'),
    name: 'Todos los temas',
    description: 'Descripción de la materia',
    img: 'app movil 23.png',
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
