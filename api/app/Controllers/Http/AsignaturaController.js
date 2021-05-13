'use strict'

const Asignatura = use("App/Models/Asignatura")
// const { validate } = use("Validator")
// const Helpers = use('Helpers')
// const mkdirp = use('mkdirp')
// const fs = require('fs')
// var randomize = require('randomatic');
const User = use("App/Models/User")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AsignaturaController {
  async index ({ request, response, view }) {
    let datos = (await Asignatura.query().where({}).fetch()).toJSON()
    response.send(datos)
  }

  async getAsignaturaById ({ request, response, params }) {
    let asignatura = await Asignatura.find(params.id)
    console.log(asignatura)
    response.send(asignatura)
  }
  async getCourseWithTest ({ request, response, params }) {
    try {
      let course = await Asignatura.with('tests').find(params.id)
      console.log('course :>> ', course);
      response.send(course)
    } catch (error) {
      console.error(error.name + 'tests: ' + error.message);
    }
  }

  async update ({ params, request, response }) {
    var dat = request.body
    // const validation = await validate(dat, Asignatura.fieldValidationRules())
    // if (validation.fails()) {
    //   response.unprocessableEntity(validation.messages())
    // } else {
    // }
    let modificar = await Asignatura.query().where('_id', params.id).update(dat)
    response.send(modificar)
  }
}


module.exports = AsignaturaController
