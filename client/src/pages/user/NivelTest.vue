<template>
  <div>
    <q-carousel
      v-model="slide"
      animated
      class="window-height"
    >
      <q-carousel-slide :name="1" class="q-pa-none" img-src="app movil 12.png">
        <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="!desafio ? $router.go(-1) : $router.push('/desafios')" />
        <div class="absolute-center" style="width:100%">
          <div class="q-pb-sm row justify-center">
            <img :src="!examen ? test.img ? baseuNivel + test._id : 'noimg.png' : baseuNivel + test._id" style="height: 280px; width: 280px; border-radius: 20px">
          </div>
        </div>
        <div class="absolute-bottom row justify-center q-py-md">
          <q-btn no-caps color="purple" label="Comenzar" size="lg" style="width: 90%" @click="desafio ? startDesafio() : examen ? startExamen() : start()" />
        </div>
      </q-carousel-slide>

      <q-carousel-slide :name="2" class="q-pa-none">
        <q-carousel
            v-model="slide2"
            animated
            style="height:100%"
            ref="carousel"
            >
            <q-carousel-slide :name="index + 1" class="q-pa-none" v-for="(pregunta, index) in questions" :key="index">
                <q-btn v-if="slide2 != 1" class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$refs.carousel.previous()" />
                <div class="absolute-top-right q-pa-md">
                  <div class="text-h6 text-black text-right">Tiempo disponible</div>
                  <q-field outlined dense bg-color="white" stack-label>
                    <template v-slot:control>
                      <div class="row justify-end no-wrap" tabindex="0" style="width:100%">
                        <div class="text-bold">{{minutos + ':' + segundos}}</div>
                      </div>
                    </template>
                  </q-field>
                </div>
                <div class="row justify-center">
                    <img :src="baseuPregunta + pregunta._id" style="height: 300px; width: 100%">
                </div>
                <div class="shadow-up-1 column items-center justify-center full-width bg-white" style="position:relative; top:-15px; border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <div class="text-subtitle1 text-grey-9 text-center q-pa-md">{{pregunta.question}}</div>
                    <div class="column justify-around" style="width:100%">
                        <div @click="answerSelected(item, pregunta)" class="q-px-xs q-pb-md" v-for="(item, index2) in pregunta.answers" :key="index2">
                            <q-field standout="bg-primary text-white" stack-label>
                              <template v-slot:control>
                                <div class="row no-wrap" tabindex="0">
                                  <div class="text-bold q-pr-sm">{{index2 === 0 ? 'A)' : index2 === 1 ? 'B)' : index2 === 2 ? 'C)' : 'D)'}}</div>
                                  <div>{{item.titleAnswer}}</div>
                                </div>
                              </template>
                            </q-field>
                        </div>
                    </div>
                    <div class="column items-center q-py-md" style="width:100%;">
                        <q-btn no-caps color="accent" :label="index + 1 === questions.length ? 'Terminar' : 'Responder'" style="width:90%" size="lg" :disable="index + 1 === questions.length ? false : pregunta.isActive ? false : true" @click="index + 1 === questions.length ? save() : $refs.carousel.next()" />
                        <q-btn v-if="index + 1 !== questions.length" flat no-caps color="grey-9" label="Omitir" style="width:90%" size="lg" @click="omitir(pregunta)" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>
      </q-carousel-slide>

      <q-carousel-slide :name="3" class="q-pa-none column justify-between" style="height:auto" img-src="app movil 12.png">
        <div class="text-center text-white text-h6 q-pt-md">Examen finalizado con éxito</div>
        <div class="column items-center q-py-md">
          <div class="text-center text-h6 text-white q-pb-md">Tu puntuación fue: {{test.total_point}} puntos</div>
          <div v-if="!desafio" class="text-center text-h6 text-white q-pb-md">Puntuación anterior: {{test.anterior !== null ? test.anterior + ' puntos' : 'No hay'}}</div>
          <q-btn no-caps color="purple" label="Ir al inicio" size="lg" style="width: 90%" @click="!desafio ? $router.go(-1) : $router.push('/desafios')" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>
<script>
import env from '../../env'
export default {
  data () {
    return {
      user: null,
      answerId: null,
      desafio: false,
      examen: false,
      timeCounter: null,
      baseuNivel: '',
      baseuPregunta: '',
      idDesafio: '',
      idExamen: '',
      timeTest: 0,
      slide: 1,
      slide2: 1,
      minutos: 0,
      segundos: 0,
      test: {},
      questions: []
    }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.baseuPregunta = env.apiUrl + 'pregunta_img/'
    if (this.$route.params.idExamen) {
      this.baseuNivel = env.apiUrl + 'examen_img/'
      this.getExamById()
    } else {
      this.getTestById()
    }
    this.getUser()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
          if (this.$route.params.idDesafio) {
            this.desafio = true
            this.idDesafio = this.$route.params.idDesafio
          } else if (this.$route.params.idExamen) {
            this.examen = true
            this.idExamen = this.$route.params.idExamen
            this.getPuntaje()
          } else {
            this.getPuntaje()
          }
        }
      })
    },
    getPuntaje () {
      this.$api.get('get_puntaje_dia/' + this.examen ? 'examen' : 'solo').then(async res => {
        if (res >= 500 && !this.user.membresia) {
          this.$q.dialog({
            title: 'Atención',
            message: 'Haz alcanzado tu capacidad de puntos entrenando' + this.examen ? ' con examenes ' : ' solo ' + 'por día, podrás seguir entrenando pero no aumentarás tu ranking',
            cancel: false,
            persistent: false
          }).onOk(() => {
            // ok
          })
        }
      })
    },
    async getTestById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('testById/' + this.$route.params.id).then(res => {
        if (res) {
          this.test = res
          this.timeTest = res.time
          const questEjem = this.test.questions.sort(() => Math.random() - 0.5)
          this.questions = questEjem.slice(0, 10)
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
    },
    async getExamById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getExamWithQuestById/' + this.$route.params.idExamen).then(res => {
        if (res) {
          this.test = res
          this.timeTest = res.time
          this.questions = this.test.questions.sort(() => Math.random() - 0.5)
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
    },
    valueTiempo () {
      this.minutos = this.timeTest - 1
      this.segundos = 60
      this.timeCounter = setInterval(timer, 1000)
      const vm = this

      function timer () {
        if (vm.segundos > 0) {
          if (vm.minutos > 0) {
            vm.segundos = vm.segundos - 1
          } else {
            vm.segundos = vm.segundos - 1
          }
        } else {
          if (vm.minutos > 0) {
            vm.minutos = vm.minutos - 1
            vm.segundos = 60
          } else {
            clearInterval(vm.timeCounter)
            vm.save()
          }
        }
        return vm.minutos
      }
    },
    async start () {
      if (this.questions.length) {
        this.$q.dialog({
          title: 'Confirma',
          message: '¿Seguro deseas iniciar el test? Tienes ' + this.test.time + ' minutos para resolverlo',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const answer = {
            title: this.test.title,
            total_questions: this.questions.length,
            family_id: this.test.family_id,
            id: this.test.id,
            user_id: this.user._id,
            questions: this.questions.map(v => {
              return {
                ...v,
                selected: false
              }
            })
          }
          await this.$api.post('answer', answer).then(res => {
            if (res) {
              this.answerId = res._id
              this.slide = 2
              this.valueTiempo()
            }
          })
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        })
      } else {
        this.$q.dialog({
          title: 'Atención',
          message: 'Aún no hay preguntas para este nivel',
          cancel: false,
          persistent: true
        }).onOk(() => {
          this.$router.go(-1)
        })
      }
    },
    async startDesafio () {
      if (this.questions.length) {
        this.$q.dialog({
          title: 'Confirma',
          message: '¿Seguro deseas iniciar el test? Tienes ' + this.test.time + ' minutos para resolverlo',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          this.slide = 2
          this.valueTiempo()
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        })
      } else {
        this.$q.dialog({
          title: 'Atención',
          message: 'Aún no hay preguntas para este nivel',
          cancel: false,
          persistent: true
        }).onOk(() => {
          this.$router.go(-1)
        })
      }
    },
    async startExamen () {
      if (this.questions.length) {
        this.$q.dialog({
          title: 'Confirma',
          message: '¿Seguro deseas iniciar el test? Tienes ' + this.test.time + ' minutos para resolverlo',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const answer = {
            title: this.test.title,
            total_questions: this.questions.length,
            exam_id: this.test._id,
            user_id: this.user._id,
            questions: this.questions.map(v => {
              return {
                ...v,
                selected: false
              }
            })
          }
          await this.$api.post('examen_user', answer).then(res => {
            if (res) {
              this.answerId = res._id
              this.slide = 2
              this.valueTiempo()
            }
          })
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        })
      } else {
        this.$q.dialog({
          title: 'Atención',
          message: 'Aún no hay preguntas para este examen',
          cancel: false,
          persistent: true
        }).onOk(() => {
          this.$router.go(-1)
        })
      }
    },
    answerSelected (answer, question) {
      for (let i = 0; i < question.answers.length; i++) {
        question.answers[i].isActive = false
      }
      question.isActive = true
      answer.isActive = true
      if (question.result === answer.value) {
        question.selected = true
      } else {
        question.selected = false
      }
    },
    omitir (question) {
      for (let i = 0; i < question.answers.length; i++) {
        question.answers[i].isActive = false
      }
      question.isActive = false
      question.selected = false
      this.$refs.carousel.next()
    },
    async save () {
      this.$q.loading.show({
        message: 'Terminando prueba...'
      })
      clearInterval(this.timeCounter)
      let num = 0
      let num2 = 0
      let num3 = 0
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].selected) {
          num = num + 1
        }
        if (!this.questions[i].isActive) {
          num2 = num2 + 1
        }
      }
      num3 = (num * this.test.point) / this.questions.length
      const answer = {
        total_point: Math.floor(num3),
        correctas: num,
        omitidas: num2
      }
      if (this.desafio) {
        await this.$api.put('desafio_value/' + this.idDesafio, answer).then(res => {
          if (res) {
            this.test = answer
            this.$q.loading.hide()
            this.slide = 3
          }
        })
      } else if (this.examen) {
        answer.questions = this.questions
        await this.$api.put('examen_user/' + this.answerId, answer).then(res => {
          if (res) {
            this.test = res
            this.$q.loading.hide()
            this.slide = 3
          }
        })
      } else {
        answer.questions = this.questions
        await this.$api.put('answer/' + this.answerId, answer).then(res => {
          if (res) {
            this.test = res
            this.$q.loading.hide()
            this.slide = 3
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dimension {
  min-width: 280px;
}
.dimensionC {
  min-width: 270px;
}
</style>
