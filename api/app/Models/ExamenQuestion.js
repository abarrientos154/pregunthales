'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExamenQuestion extends Model {
  static get objectIDs () { return [ 'exam_id', '_id' ] }
}

module.exports = ExamenQuestion
