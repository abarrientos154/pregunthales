'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Test extends Model {
  static get fillable () {
    return ['name', 'family_id']
  }
  static fieldValidationRules () {
    const rules = {
      name: "required|string"
    }
    return rules
  }
  course () {
    return this.hasOne('App/Models/Asignatura', 'family_id', '_id')
  }
  exam () {
    return this.hasOne('App/Models/Examen', 'family_id', '_id')
  }
  questions () {
    return this.hasMany('App/Models/Question', 'id', 'test_id')
  }
  questionsE () {
    return this.hasMany('App/Models/Question', 'id', 'exam_id')
  }
}

module.exports = Test
