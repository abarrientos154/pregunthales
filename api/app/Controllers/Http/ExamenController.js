'use strict'
const Examen = use("App/Models/Examen")
const Question = use("App/Models/Question")
const QuesExamen = use("App/Models/ExamenQuestion")
const Asignatura = use("App/Models/Asignatura")
const Nivele = use("App/Models/Nivele")
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
    let guardar = await QuesExamen.create(datos)

    response.send(guardar)
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

  async updateQuestions ({ params, request, response }) {
    var data = request.all()
    let modificar = await QuesExamen.query().where('_id', params.id).update(data)
    response.send(modificar)
  }

  async destroy ({ params, request, response }) {
    let examen = await Examen.find(params.id)
    let preguntas = (await QuesExamen.query().where({exam_id: params.id}).fetch()).toJSON()
    for (let i = 0; i < preguntas.length; i++) {
      let eliminar = await QuesExamen.find(preguntas[i]._id)
      await eliminar.delete()
    }
    await examen.delete()
    response.send(examen)
  }

  async destroyQuestions ({ params, request, response }) {
    let examen = await QuesExamen.find(params.id)
    await examen.delete()
    response.send(examen)
  }

  async getExamWithQuest ({ request, response, params }) {
    let examenes = (await Examen.query().where('_id', params.id).with('questions').first()).toJSON()
    let cantidad = 0
    for (let i = 0; i < examenes.questions.length; i++) {
      cantidad = cantidad + examenes.questions[i].cantidad
      let course = (await Asignatura.query().where('_id', examenes.questions[i].course_id).with('tests').first()).toJSON()
      let nivel = (await Nivele.query().where('id', examenes.questions[i].nivel_id).first()).toJSON()
      let preguntasNivel = (await Question.query().where({test_id: nivel.id}).fetch()).toJSON()
      nivel.total_question = preguntasNivel.length
      for (let j = 0; j < course.tests.length; j++) {
        let preguntasCourse = (await Question.query().where({test_id: course.tests[j].id}).fetch()).toJSON()
        course.tests[j].total_question = preguntasCourse.length
      }
      examenes.questions[i].course = course
      examenes.questions[i].nivel = nivel
    }
    examenes.faltantes = examenes.cantidad - cantidad
  
    let examenUpdate = (await Examen.find(params.id))
    if (examenes.faltantes > 0) {
      examenUpdate.enable = false
      examenUpdate.save()
    } else {
      examenUpdate.enable = true
      examenUpdate.save()
    }

    response.send(examenes)
  }
}

module.exports = ExamenController
