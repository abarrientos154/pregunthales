'use strict'
const DateExam = use("App/Models/DateExam")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with dateexams
 */
class DateExamController {
  /**
   * Show a list of all dateexams.
   * GET dateexams
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    let data = (await DateExam.query().where({}).with('community').with('placeO').fetch()).toJSON();
    for (let i in data) {
      data[i].community_name = data[i].community.name
      data[i].place_name = data[i].placeO.name
      data[i].actions = [
        {
          color: "primary",
          icon: "edit",
          url: "",
          action: "",
          title: "Editar",
        },
        {
          color: "red",
          icon: "delete",
          url: "",
          action: "",
          title: "Eliminar",
        }
      ]  
    }
    response.send(data);
  }
  async dateExamUser ({ response }) {
    let data = (await DateExam.query().where({}).with('community').with('placeO').fetch()).toJSON();
    for (let i in data) {
      data[i].community_name = data[i].community.name
      data[i].place_name = data[i].placeO.name
      data[i].actions = [
        {
          color: "green",
          icon: "shopping_cart",
          url: "",
          action: "",
          title: "Comprar",
        }
      ]
    }
    response.send(data);
  }

  /**
   * Render a form to be used for creating a new dateexam.
   * GET dateexams/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new dateexam.
   * POST dateexams
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      let body = request.body
      console.log('body :>> ', body);
      let store = await DateExam.create(body)
      response.send(store)
    } catch (error) {
      console.error('Store DateExam: ' + error.name + ': ' + error.message);
    }
  }

  /**
   * Display a single dateexam.
   * GET dateexams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      let { id } = params
      let data = (await DateExam.query().find(id)).toJSON()
      response.send(data)
    } catch (error) {
      console.error('show DateExam: ' + error.name + ': ' + error.message);
    }
  }

  /**
   * Render a form to update an existing dateexam.
   * GET dateexams/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update dateexam details.
   * PUT or PATCH dateexams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      let dateExam = request.body
      const update = await DateExam.query().where('_id', params.id).update(dateExam)
      response.send(update)
    } catch (error) {
      console.error('Update DateExam ' + error.name + ': ' + error.message);
    }
  }

  /**
   * Delete a dateexam with id.
   * DELETE dateexams/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const toDestroy = await DateExam.where('_id', params.id).delete()
    response.send(toDestroy)
  }
}

module.exports = DateExamController
