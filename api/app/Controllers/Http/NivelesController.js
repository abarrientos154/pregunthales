'use strict'
const Nivele = use("App/Models/Nivele")
const Question = use("App/Models/Question")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
var ObjectId = require('mongodb').ObjectId;

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tests
 */
class NivelesController {
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
      var data = request.all()
      data.family_id = new ObjectId(data.family_id)
      var id = (await Nivele.query().where({}).fetch()).toJSON()
      if (id.length < 1) {
        data.id = 1
      } else {
        let lastT = id.length - 1
        id = parseInt(id[lastT].id) + 1
        data.id = id
      }
      let save = await Nivele.create(data)

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
    var data = request.all()
    data.family_id = new ObjectId(data.family_id)
    let update = await Nivele.query().where('_id', params.id).update(data)
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
    let test = await Nivele.find(params.id)
    await test.delete()
    response.send(test)
  }

  async testByCourse ({ request, response, params }) {
    let data = (await Nivele.query().where({ family_id: params.id }).fetch()).toJSON()
    response.send(data)
  }
  async testById ({ request, response, params }) {
    try {
      let test = (await Nivele.with('course').with('questions').find(params.id)).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }
  async testByCourseId ({ request, response, params }) {
    try {
      const id = new ObjectId(params.id)
      const test = (await Nivele.query().where({ family_id: id }).fetch()).toJSON()
      response.send(test)
    } catch (error) {
      console.error(error.name + '1: ' + error.message)
    }
  }
}

module.exports = NivelesController
