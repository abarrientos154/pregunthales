'use strict'
const Question = use("App/Models/Question")
const Asignatura = use("App/Models/Asignatura")
const Test = use("App/Models/Test")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with questions
 */
class QuestionController {
  /**
   * Show a list of all questions.
   * GET questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let data = (await Question.query().where({}).fetch()).toJSON()
    response.send(data)
  }
  

  async getQuestionsbyTest ({ response, params }) {
    let id = parseInt(params.id)
      try {
        let data = (await Question.query().where({ test_id: id }).fetch()).toJSON()
        response.send(data)
        throw new Error()
      } catch (e) {
        console.error(e.name + ': ' + e.message)
      }
  }


  async getQuestionsbyExam ({ request, response, view, params }) {
    let data = (await Question.query().where({ examen_id: params.id }).fetch()).toJSON()
    response.send(data)
  }

  async getFullQuestions ({ response }) {
    try {
      let data = (await Asignatura.query().where({}).with('tests.questions').fetch()).toJSON()
      response.send(data)
    } catch (error) {
      console.error(error.name + 'fullQuestions: ' + error.message);
    }
  }

  /**
   * Render a form to be used for creating a new question.
   * GET questions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new question.
   * POST questions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      let { quest, answers } = request.body
      answers = Object.values(answers)
      let arr = []
      for (let i in answers) {
        let ans = { titleAnswer: answers[i] }
        arr.push(ans)
      }
      quest.answers = arr
      quest.isActive = false
      console.log('quest :>> ', quest);
      let save = await Question.create(quest)
      response.send(save)
    } catch (error) {
      console.error(error.name + 'store: ' + error.message);
    }
  }
  async multiplesQuestions ({ request, response }) {
    try {
      let { multiple, id } = request.all()
      //console.log(typeof (multipleQ[0]._id));
      console.log(typeof (id));
      id = id.toString()
      console.log('id :>> ', id);
      console.log('multiple :>> ', multiple);
      let test = await Test.findBy(id)
      console.log('test :>> ', test);
      let body = {
        hasExamId: true
      }
      test.merge(body)
      await test.save()
      for (let i in multiple) {
        multiple[i].exam_id = id
        console.log(typeof (multiple[i]._id));
        const update = await Question.where('_id', multiple[i]._id).update(multiple[i])
      }
      console.log('multiple :>> ', multiple);
      response.send(true)
    } catch (error) {
      console.error(error.name + ' multiplesQuestions: ' + error.message);
    }
  }

  /**
   * Display a single question.
   * GET questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    let quest = (await Question.find(params.id)).toJSON()
    response.send(quest)
  }

  /**
   * Render a form to update an existing question.
   * GET questions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update question details.
   * PUT or PATCH questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      let { quest, answers } = request.body
      answers = Object.values(answers)
      for (let i in answers) {
        quest.answers[i].titleAnswer = answers[i] 
      }
      console.log('quest :>> ', quest);
      const update = await Question.where('_id', params.id).update(quest)
      response.send(update)
    } catch (error) {
      console.error(error.name + '1:' + error.message);
    }
  }

  /**
   * Delete a question with id.
   * DELETE questions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const questToDestroy = await Question.where('_id', params.id).delete()
    response.send(questToDestroy)
  }
}

module.exports = QuestionController
