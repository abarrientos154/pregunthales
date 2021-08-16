'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Examen extends Model {
  static get objectIDs () { return [ 'exam_id', '_id' ] }

  static get fillable() {
    return ['name']
  }
  static fieldValidationRules() {
    const rules = {
      name: "required|string",
    }
    return rules
  }
  questions () {
    return this.hasMany('App/Models/ExamenQuestion', '_id', 'exam_id')
  }
}

module.exports = Examen
