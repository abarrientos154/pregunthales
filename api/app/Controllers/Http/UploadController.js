'use strict'
const ExcelJS = require('exceljs');
const Question = use("App/Models/Question")
const Test = use("App/Models/Test")
const MoveFileService = use("App/Services/MoveFileService")
var ObjectId = require('mongodb').ObjectId;


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with uploads
 */
class UploadController {
  /**
   * Show a list of all uploads.
   * GET uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new upload.
   * GET uploads/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new upload.
   * POST uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single upload.
   * GET uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing upload.
   * GET uploads/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update upload details.
   * PUT or PATCH uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a upload with id.
   * DELETE uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
  async excel ({request, response}) {
    let files = request.file('fileExcel')
    var data = request.only(['data'])
    data = JSON.parse(data.data)
    var filePath = await MoveFileService.moveFile(files)
    var workbook = new ExcelJS.Workbook()
    workbook = await workbook.xlsx.readFile(filePath)
    console.log('workbook :>> ', workbook);
    let explanation = workbook.getWorksheet('Hoja1')
    let colComment = explanation.getColumn('B')
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let question = {}
        let answers = []
        let arr = []
        let title = explanation.getCell('B' + rowNumber).value
        question.question = title
        arr.push(explanation.getCell('C' + rowNumber).value)
        arr.push(explanation.getCell('D' + rowNumber).value)
        arr.push(explanation.getCell('E' + rowNumber).value)
        arr.push(explanation.getCell('F' + rowNumber).value)
        for (let i in arr) {
          let ans = { titleAnswer: arr[i] }
          answers.push(ans)
        }
        question.answers = answers
        question.isActive = false
        if (data.test_id != null) {
          question.test_id = data.test_id
        }
        let save = await Question.create(question)
      }
    })

    response.send(true)
  }
  async bigData ({ request, response }) {
    //console.log('entra en bigdata');
    try {
      if (request.file('testFile')) {
        //console.log('sirve test');
        let testFile = request.file('testFile')
        var filePath = await MoveFileService.moveFile(testFile)
        var workbook = new ExcelJS.Workbook()
        workbook = await workbook.xlsx.readFile(filePath)
        //console.log('workbook :>> ', workbook);
        var explanation = workbook.getWorksheet('Hoja1')
        var colComment = explanation.getColumn('A')
        colComment.eachCell(async (cell, rowNumber) => {
          if (rowNumber >= 2) {
            let test = {}
            let title = explanation.getCell('A' + rowNumber).value
            test.title = title
            let total_questions = explanation.getCell('B' + rowNumber).value
            test.total_questions = total_questions
            let family_id = explanation.getCell('C' + rowNumber).value
            let objId = new ObjectId(family_id);
            test.family_id = objId
            let id = explanation.getCell('D' + rowNumber).value
            test.id = id
            let save = await Test.create(test)
          }
        })
      }
    } catch (error) {
      console.error(error.name + 'tests : ' + error.message)
    }

    try {   
      if (request.file('questionsFile') && request.file('answersFile')) {
        // preguntas
        console.log('object :>> ');
        let questionsFile = request.file('questionsFile')
        filePath = await MoveFileService.moveFile(questionsFile)
        var workbook1 = new ExcelJS.Workbook()
        workbook1 = await workbook1.xlsx.readFile(filePath)
        console.log('workbook :>> ', workbook1);
        var explanation1 = workbook1.getWorksheet('Hoja1')
        var colComment = explanation1.getColumn('A')
        let collectionQuestions = []
        colComment.eachCell(async (cell, rowNumber) => {
          if (rowNumber >= 2) {
            let quest = {}
            let idq = explanation1.getCell('A' + rowNumber).value
            quest.id = idq
            let test_id1 = explanation1.getCell('B' + rowNumber).value
            quest.test_id = test_id1
            let question_number1 = explanation1.getCell('C' + rowNumber).value
            quest.question_number = question_number1
            let question = explanation1.getCell('D' + rowNumber).value
            quest.question = question
            let correct_answer = explanation1.getCell('E' + rowNumber).value
            quest.isActive = false
            quest.correct_answer = correct_answer
            
            collectionQuestions.push(quest)
          }
        })
        // respuestas
        let answersFile = request.file('answersFile')
        var filePath = await MoveFileService.moveFile(answersFile)
        var workbook = new ExcelJS.Workbook()
        workbook = await workbook.xlsx.readFile(filePath)
        var explanation = workbook.getWorksheet('Hoja1')
        var colComment = explanation.getColumn('A')
        let collectionAnswers = []
        colComment.eachCell(async (cell, rowNumber) => {
          if (rowNumber >= 2) {
            let answer = {}
            let id = explanation.getCell('A' + rowNumber).value
            answer.id = id
            let test_id = explanation.getCell('B' + rowNumber).value
            answer.test_id = test_id
            let question_number = explanation.getCell('C' + rowNumber).value
            answer.question_number = question_number
            let answer_number = explanation.getCell('D' + rowNumber).value
            answer.answer_number = answer_number
            let titleAnswer = explanation.getCell('E' + rowNumber).value
            answer.isActive = false
            answer.titleAnswer = titleAnswer
            collectionAnswers.push(answer)
          }
        })

        for (let i in collectionQuestions) {
          let answers = []
          let iQuestion = {...collectionQuestions[i]}
          collectionAnswers.forEach((iAnswer, index) => {
             if (parseInt(iAnswer.test_id) === parseInt(iQuestion.test_id) && parseInt(iAnswer.question_number) === parseInt(iQuestion.question_number)) {
              answers.push(iAnswer)
            }
          });
          iQuestion.answers = answers
          let save = await Question.create(iQuestion)
        }
      }
    } catch (error) {
      console.error(error.name + '2: ' + error.message)
    }
    response.send(true)
  }
}

module.exports = UploadController
