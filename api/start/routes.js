'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

const addPrefixToGroup = group => {
  // Grupo para rutas con prefijo /api/
  group.prefix("api");
  return group;
};


addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas sin protección de autenticación aquí
    Route.post("login", "UserController.login");
    Route.post("register", "UserController.register")
    
  })
  );
  
  addPrefixToGroup(
    Route.group(() => {
      // Insertar rutas con protección de autenticación aquí
      Route.get("user_info", "UserController.userInfo")
      Route.put('updateUser/:id', 'UserController.update')
      
      Route.get("asignatura", "AsignaturaController.index")
      Route.get('asignatura_by_id/:id', 'AsignaturaController.getAsignaturaById')
      Route.get('getCourseWithTest/:id', 'AsignaturaController.getCourseWithTest')
      Route.put('updateAsignatura/:id', 'AsignaturaController.update')
      
      Route.get('tema', 'TemaController.index')
      Route.get('test_by_course/:id', 'TestController.testByCourse')
      Route.get('testById/:id', 'TestController.testById')
      Route.get('testExamById/:id', 'TestController.testExamById')
      Route.post('test', 'TestController.store')
      Route.put('test/:id', 'TestController.update')
      Route.delete('test/:id', 'TestController.destroy')
      
      Route.get('examen', 'ExamenController.index')
      Route.get('ExamById/:id', 'ExamenController.examById')
      Route.post('examen', 'ExamenController.store')
      Route.get('getExamWithTest/:id', 'ExamenController.getExamWithTest')
      Route.put('examen/:id', 'ExamenController.update')
      Route.delete('examen/:id', 'ExamenController.destroy')
      
      Route.get('titles', 'TitleController.index')

      Route.get('communities', 'CommunityController.index')

      Route.get('placesByCommunityId/:id', 'PlaceController.show')

      Route.post('uploadExcel', 'UploadController.excel')
      Route.post('bigData', 'UploadController.bigData')
    
      Route.post('newQuest', 'QuestionController.store')
      Route.put('multiplesQuestions', 'QuestionController.multiplesQuestions')
      Route.get('getQuestions', 'QuestionController.index')
      Route.get('getQuestionsbyTest/:id', 'QuestionController.getQuestionsbyTest')
      Route.get('getQuestionsbyExam/:id', 'QuestionController.getQuestionsbyExam')
      Route.get('getFullQuestions/', 'QuestionController.getFullQuestions')
      Route.put('updateQuest/:id', 'QuestionController.update')
      Route.get('questById/:id', 'QuestionController.show')
      Route.delete('destroyQuest/:id', 'QuestionController.destroy')

      Route.post('newDateExam', 'DateExamController.store')
      Route.put('updateDateExam/:id', 'DateExamController.update')
      Route.get('dateExam', 'DateExamController.index')
      Route.get('dateExamUser', 'DateExamController.dateExamUser')
      Route.delete('destroyDateExam/:id', 'DateExamController.destroy')
      Route.get('dateExamById/:id', 'DateExamController.show')
      
      Route.post('answer', 'AnswerController.store')
      Route.put('answer/:id', 'AnswerController.update')
      Route.get('answerById/:id', 'AnswerController.show')

    }).middleware("auth")
  );
