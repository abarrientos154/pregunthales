'use strict'
const Answer = use("App/Models/Answer")
const Desafios = use("App/Models/Desafio")
const User = use("App/Models/User")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with answers
 */
class AnswerController {
  /**
   * Show a list of all answers.
   * GET answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafio = (await Desafios.query().where({status: 0, desafiado_id: user._id}).first())
    response.send(desafio)
  }

  async indexDesafiado ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafios = (await Desafios.query().where({status: 0, desafiado_id: user._id}).with('creadorInfo').with('desafiadoInfo').fetch()).toJSON()
    response.send(desafios)
  }

  async indexCreador ({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    let desafios = (await Desafios.query().where({status: 0, creador_id: user._id}).with('creadorInfo').with('desafiadoInfo').fetch()).toJSON()
    response.send(desafios)
  }

  /**
   * Render a form to be used for creating a new answer.
   * GET answers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new answer.
   * POST answers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      let answer = request.body
      let save = await Answer.create(answer)
      response.send(save)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  async storeDesafio ({ request, response }) {
    try {
      let desafio = request.body
      let save = await Desafios.create(desafio)
      response.send(save)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }

  /**
   * Display a single answer.
   * GET answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      let test = (await Answer.with('course').find(params.id)).toJSON()
      for (let i in test.questions) {
        const correctAnswer = test.questions[i].correct_answer - 1
        for (let j in test.questions[i].answers) {
          if (test.questions[i].answers[j].isActive === true) {
            if (parseInt(correctAnswer) === parseInt(j)) {
              test.questions[i].answers[j].isRigth = true
            } else {
              test.questions[i].answers[j].isRigth = false
            }
          }
        }
      }
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }

  async showDesafio ({ params, request, response, view }) {
    try {
      let desafio = (await Desafios.query().where({_id: params.id}).first()).toJSON()
      desafio.creadorInfo = (await User.query().where({_id: desafio.creador_id}).first()).toJSON()
      desafio.desafiadoInfo = (await User.query().where({_id: desafio.desafiado_id}).first()).toJSON()
      response.send(desafio)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }

  /**
   * Render a form to update an existing answer.
   * GET answers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update answer details.
   * PUT or PATCH answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let answer = request.body
      const update = await Answer.where('_id', params.id).update(answer)
      let result = (await Answer.query().where('_id', params.id).first()).toJSON()
      const updateUser = await User.where('_id', user._id).update({points: user.points + result.total_point})
      var otras = (await Answer.query().where({id: result.id, user_id: user._id}).fetch()).toJSON()
      if (otras.length > 1) {
        result.anterior = otras[otras.length - 2].total_point
      }
      response.send(result)
    } catch (error) {
      console.error(error.name + 'update:' + error.message);
    }
  }

  /**
   * Delete a answer with id.
   * DELETE answers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AnswerController
