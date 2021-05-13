'use strict'
const Test = use("App/Models/Test")
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tests
 */
class TestController {
  /**
   * Show a list of all tests.
   * GET tests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new test.
   * GET tests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new test.
   * POST tests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      var data = request.body
      data.family_id = new ObjectId(data.family_id)
      let id = (await Test.query().where({}).fetch()).toJSON()
      let lastT = id.length -1
      id = parseInt(id[lastT].id) + 1
      data.id = id
      let save = await Test.create(data)
      response.send(save)
    } catch (error) {
      console.error('metodo store:' + error.name + ':' + error.message);
    }
  }

  /**
   * Display a single test.
   * GET tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing test.
   * GET tests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update test details.
   * PUT or PATCH tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    var data = request.body
    data.family_id = new ObjectId(data.family_id)
    let update = await Test.query().where('_id', params.id).update(data)
    response.send(update)
  }

  /**
   * Delete a test with id.
   * DELETE tests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    let test = await Test.find(params.id)
    await test.delete()
    response.send(test)
  }

  async testByCourse ({ request, response, params }) {
    let data = (await Test.query().where({ family_id: params.id }).fetch()).toJSON()
    console.log(data, 'data')
    response.send(data)
  }
  async testById ({ request, response, params }) {
    try {
      let test = (await Test.with('course').with('questions').find(params.id)).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name +'1: ' + error.message)
    }
  }
  async testExamById ({ request, response, params }) {
    try {
      let test = (await Test.with('exam').with('questions').find(params.id)).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }
}

module.exports = TestController
