'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DateExam extends Model {
  community () {
    return this.hasOne('App/Models/Community', 'ccaa', '_id')
  }
  placeO () {
    return this.hasOne('App/Models/Place', 'place', '_id')
  }
}

module.exports = DateExam
