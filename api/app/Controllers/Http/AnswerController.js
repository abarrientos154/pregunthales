'use strict'
const Answer = use("App/Models/Answer")

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
  async index ({ request, response, view }) {
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
            console.log('correctAnswer, j :>> ', correctAnswer, j);
            if (parseInt(correctAnswer) === parseInt(j)) {
              test.questions[i].answers[j].isRigth = true
              console.log('sirve :>> ');
            } else {
              console.log('sirve2 :>> ');
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
  async update ({ params, request, response }) {
    try {
      let answer = request.body
      const update = await Answer.where('_id', params.id).update(answer)
      response.send(update)
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
