'use strict'
const Examen = use("App/Models/Examen")
const ExamenUser = use("App/Models/ExamenUser")
const Question = use("App/Models/Question")
const QuesExamen = use("App/Models/ExamenQuestion")
const Asignatura = use("App/Models/Asignatura")
const Puntajes = use("App/Models/Puntaje")
const Nivele = use("App/Models/Nivele")
const User = use("App/Models/User")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const moment = use('moment')
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
  async index ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let datos = await Examen.all()
    if (user.roles[0] === 2) {
      datos = (await Examen.query().where({enable: true}).fetch()).toJSON()

      for (let i = 0; i < datos.length; i++) {
        var examenes = (await ExamenUser.query().where({exam_id: datos[i]._id, user_id: user._id}).fetch()).toJSON()
        if (examenes.length) {
          var mayor = 0
          var fecha = ''
          for (let j = 0; j < examenes.length; j++) {
            if (examenes[j].total_point >= mayor) {
              mayor = examenes[j].total_point
              fecha = moment(examenes[j].created_at).format('DD/MM/YYYY')
            }
          }
          datos[i].fecha_test = fecha
          datos[i].total_point = mayor
        } else {
          datos[i].fecha_test = moment(datos[i].created_at).format('DD/MM/YYYY')
          datos[i].total_point = 0
        }
      }
    }
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

  async storeExamen ({ request, response, auth }) {
    try {
      let answer = request.body
      let save = await ExamenUser.create(answer)
      response.send(save)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
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

  async updateExamen ({ params, request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let answer = request.body
      const update = await ExamenUser.where('_id', params.id).update(answer)
      let result = (await ExamenUser.query().where('_id', params.id).first()).toJSON()

      var puntosHoy = (await Puntajes.query().where({type: 'examen', user_id: user._id}).fetch()).toJSON()
      var filtrados = puntosHoy.filter(v => moment(v.created_at).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD'))
      var puntos = 0
      for (let i = 0; i < filtrados.length; i++) {
        puntos = puntos + filtrados[i].total_point
      }
      if (puntos >= 500 && !user.membresia) {
        // no agrega puntos
      } else {
        let dataPuntaje = {
          total_point: answer.total_point,
          user_id: user._id,
          type: 'examen'
        }
        let puntaje = await Puntajes.create(dataPuntaje)
        const updateUser = await User.where('_id', user._id).update({points: user.points + result.total_point})
      }

      var otras = (await ExamenUser.query().where({exam_id: result.exam_id, user_id: user._id}).fetch()).toJSON()
      if (otras.length > 1) {
        var largo = otras.length - 2
        result.anterior = otras[largo].total_point
      } else {
        result.anterior = null
      }
      response.send(result)
    } catch (error) {
      console.error(error.name + 'update:' + error.message);
    }
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

  async getExamWithQuestById ({ request, response, params }) {
    try {
      let examen = (await Examen.query().where('_id', params.id).first()).toJSON()
      let dataQuestions = (await QuesExamen.query().where({exam_id: params.id}).fetch()).toJSON()
      let questions = []
      for (let i = 0; i < dataQuestions.length; i++) {
        let nivelQuest = (await Question.query().where({test_id: dataQuestions[i].nivel_id}).fetch()).toJSON()
        var randon = nivelQuest.sort(() => Math.random() - 0.5)
        var agregar = randon.slice(0, dataQuestions[i].cantidad)
        questions = questions.concat(agregar)
      }
      examen.questions = questions
      response.send(examen)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }
}

module.exports = ExamenController
