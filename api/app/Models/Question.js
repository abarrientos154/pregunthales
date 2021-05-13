'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Question extends Model {
  static get fillable () {
    return ['title', 'optionA', 'optionB', 'optionC', 'optionD']
  }
  static fieldValidationRules () {
    const rules = {
      title: "required|string",
      optionA: "required|string",
      optionB: "required|string",
      optionC: "required|string",
      optionD: "required|string"
    }
    return rules
  }
}

module.exports = Question
