'use strict'
const Examen = use("App/Models/Examen")
const QuesNivel = use("App/Models/Question")
const QuesExamen = use("App/Models/ExamenQuestion")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
// const fs = require('fs')
// var randomize = require('randomatic');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with productos
 */
class ExamenController {
  /**
   * Show a list of all Examenes.
   * GET examenes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let datos = await Examen.all()
    response.send(datos)
  }

  async examById ({ request, response, view, params }) {
    let datos = (await Examen.find(params.id)).toJSON()
    response.send(datos)
  }

  async examenQuestions ({ request, response, view, params }) {
    let datos = request.all()
    var questionN = (await QuesNivel.query().where({test_id: datos.nivel_id}).fetch()).toJSON()
    var nuevas = questionN.sort(() => Math.random() - 0.5)
    var agregar = nuevas.slice(0, datos.cantidad)
    for (let i = 0; i < agregar.length; i++) {
      agregar[i].exam_id = data.exam_id
      delete agregar[i]._id
      let guardar = await QuesExamen.create(agregar[i])
    }
    response.send(agregar)
  }

  async store ({ request, response, auth }) {
    var data = request.only(['dat'])
    data = JSON.parse(data.dat)
    let guardar = await Examen.create(data)

    const profilePic = request.file('files', {
      types: ['image']
    })
    if (Helpers.appRoot('storage/uploads/examenes')) {
      await profilePic.move(Helpers.appRoot('storage/uploads/examenes'), {
        name: guardar._id.toString(),
        overwrite: true
      })
    } else {
      mkdirp.sync(`${__dirname}/storage/Excel`)
    }

    response.send(guardar)
  }

  async update ({ params, request, response }) {
    var data = request.only(['dat'])
    data = JSON.parse(data.dat)
    if (data.file) {
      const profilePic = request.file('files', {
        types: ['image']
      })
      if (Helpers.appRoot('storage/uploads/examenes')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/examenes'), {
          name: data._id.toString(),
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }
    }
    delete data.file
    let modificar = await Examen.query().where('_id', params.id).update(data)
    response.send(modificar)
  }

  async destroy ({ params, request, response }) {
    let examen = await Examen.find(params.id)
    await examen.delete()
    response.send(examen)
  }

  async getExamWithQuest ({ request, response, params }) {
    console.log('id', params.id)
    let examenes = (await Examen.query().where('_id', params.id).with('questions').first()).toJSON()
    console.log('examen', examenes)
    response.send(examenes)
  }
}

module.exports = ExamenController
