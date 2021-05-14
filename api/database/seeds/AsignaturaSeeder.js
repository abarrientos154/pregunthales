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
  /* {
    _id: new ObjectId('60748c7ba06b4e9171dfeafa'),
    name: 'Nomenclatura náutica',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafb'),
    name: 'Amarre y fondeo',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafc'),
    name: 'Seguridad en la mar',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafd'),
    name: 'Legislación',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafe'),
    name: 'Balizamiento',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeaff'),
    name: 'Reglamento',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb00'),
    name: 'Maniobras en la mar',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb01'),
    name: 'Emergencias en la mar',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb02'),
    name: 'Meteorología',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb03'),
    name: 'Navegación',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb04'),
    name: 'Carta náutica',
    status: false
  } */
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb02'),
    name: 'Español',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb03'),
    name: 'Física',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeb04'),
    name: 'Geografía',
    status: false
  },
  {
    _id: new ObjectId('60748c7ba06b4e9171dfeafa'),
    name: 'Informática',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafb'),
    name: 'Inglés',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafc'),
    name: 'Matemática',
    status: false
  },
  {
    _id: new ObjectId('60748c7ca06b4e9171dfeafd'),
    name: 'Química',
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
