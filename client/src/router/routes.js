
const routes = [
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Admin
      { path: '/administrador', component: () => import('pages/admin/Inicio.vue') },
      { path: '/usuarios', component: () => import('pages/admin/Usuarios.vue') },
      { path: '/niveles/:id', component: () => import('pages/admin/Niveles.vue') },
      { path: '/preguntas/:id', component: () => import('pages/admin/EditNivel.vue') },
      { path: '/examenes', component: () => import('pages/admin/Examenes.vue') },
      { path: '/tests_exam/:id', component: () => import('pages/admin/TestsExam.vue') },
      { path: '/exam/:id', component: () => import('pages/admin/Exam.vue') },
      { path: '/date_exams', component: () => import('pages/admin/DateExams.vue') },
      // User
      { path: '/inicio', component: () => import('pages/user/Inicio.vue') },
      { path: '/tienda', component: () => import('pages/user/Tienda.vue') },
      { path: '/carro_de_compra/:compra', component: () => import('pages/user/CarroCompra.vue') },
      { path: '/desafios', component: () => import('pages/user/Desafios.vue') },
      { path: '/desafio', component: () => import('pages/user/Desafio.vue') },
      { path: '/desafio/:id', component: () => import('pages/user/Desafiado.vue') },
      { path: '/asignaturas', component: () => import('pages/user/Asignaturas.vue') },
      { path: '/asignatura/niveles/:id', component: () => import('pages/user/Niveles.vue') },
      { path: '/exams', component: () => import('pages/user/Exams.vue') },
      { path: '/tests_exams/:id', component: () => import('pages/user/TestsExams.vue') },
      { path: '/test-exam/:id', component: () => import('pages/user/TestExam.vue') }
    ]
  },

  { path: '/nivel/:id', component: () => import('pages/user/NivelTest.vue') },
  { path: '/nivel/:id/:idDesafio', component: () => import('pages/user/NivelTest.vue') },

  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/registro', component: () => import('pages/Registro.vue') },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
