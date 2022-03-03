<template>
  <div>
    <q-carousel
      v-model="slide"
      animated
      class="window-height"
    >
      <q-carousel-slide :name="1" class="q-pa-none" img-src="photo_2021-11-01_12-46-35.jpg">
        <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="!desafio ? $router.go(-1) : $router.push('/desafios')" />

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
                <q-btn v-if="slide2 != 1 && !atras" class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="atras = true, $refs.carousel.previous()" />
                <q-linear-progress stripe size="25px" :value="progres" color="accent">
                  <div class="absolute-full flex flex-center text-black text-subtitle1">{{minutos + ':' + segundos}}</div>
                </q-linear-progress>
                <!-- <div class="absolute-top-right q-pa-md">
                  <div class="text-h6 text-black text-right">Tiempo disponible</div>
                  <div class="text-right text-h5 text-bold">{{minutos + ':' + segundos}}</div>
                  </div> -->
                <div class="row justify-center">
                    <img :src="baseuPregunta + pregunta._id" style="height: 300px; width: 100%">
                </div>
                <div class="shadow-up-1 column items-center justify-center full-width bg-white" style="position:relative; top:-15px; border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <div class="text-subtitle1 text-grey-9 text-center q-pa-md">{{pregunta.question}}</div>
                    <div class="column justify-around q-px-xs" style="width:100%">
                      <q-card clickable v-ripple class="q-pa-none bordes q-my-sm row items-center" v-for="(option, index2) in pregunta.answers" :key="index2" style="width: 100%;"
                      @click="!pregunta.isActive ? answerSelected(option, pregunta, index + 1 === questions.length ? true : false) : ''">
                        <q-item class="q-pa-none row" style="width:100%">
                          <q-item-section side class="q-py-sm q-px-md q-ma-none text-h6 bg-accent text-white"
                          >{{index2 === 0 ? 'A' : index2 === 1 ? 'B' : index2 === 2 ? 'C' : 'D'}}</q-item-section>
                          <q-item-section :class="!pregunta.isActive ? option.isActive ? 'bg-grey-5 text-white' : 'bg-white text-black' : (option.isActive && pregunta.selected) ? 'bg-positive text-white' : option.isActive && !pregunta.selected ? 'bg-negative text-white' : 'bg-white text-black'" class="q-px-sm q-ma-none"
                          >{{option.titleAnswer}}</q-item-section>
                        </q-item>
                      </q-card>
                    </div>
                    <div class="column items-center q-py-md" style="width:100%;">
                        <q-btn v-if="atras" class="self-end" round flat color="grey-9" icon="arrow_forward" @click="atras = false, $refs.carousel.next()" />
                        <q-btn v-if="!pregunta.isActive" flat no-caps color="grey-9" label="Omitir" style="width:90%" size="lg" @click="omitir(pregunta, index + 1 === questions.length ? true : false)" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>
      </q-carousel-slide>

      <q-carousel-slide :name="3" class="q-pa-none column justify-between" style="height:auto" img-src="app movil 12.png">
        <div class="text-center text-white text-h6 q-pt-md">Examen finalizado con éxito</div>
        <div class="text-center text-white text-h6 q-px-sm">{{mensaje}}</div>
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
      atras: false,
      timeCounter: null,
      timeCounter1: null,
      timeCounter2: null,
      baseuNivel: '',
      baseuPregunta: '',
      idDesafio: '',
      idExamen: '',
      mensaje: 'Hola',
      timeTest: 0,
      progres: 1,
      aux: 0,
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
          console.log(res)
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
      this.aux = 1 / (this.timeTest * 60)
      this.segundos = 59
      this.timeCounter = setInterval(timer, 1000)
      const vm = this

      function timer () {
        vm.progres -= vm.aux
        if (vm.segundos > 0) {
          if (vm.minutos > 0) {
            vm.segundos = vm.segundos - 1
          } else {
            vm.segundos = vm.segundos - 1
          }
        } else {
          if (vm.minutos > 0) {
            vm.minutos = vm.minutos - 1
            vm.segundos = 59
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
    answerSelected (answer, question, bool) {
      for (let i = 0; i < question.answers.length; i++) {
        question.answers[i].isActive = false
      }
      answer.isActive = true
      this.$q.loading.show()
      this.timeCounter1 = setInterval(verify, 2000)
      const vm = this
      function verify () {
        question.isActive = true
        if (question.result === answer.value) {
          const a = new Audio(require('../../../public/correcto.mp3'))
          a.play()
          question.selected = true
        } else {
          const b = new Audio(require('../../../public/error.mp3'))
          b.play()
          question.selected = false
        }
        clearInterval(vm.timeCounter1)
        vm.$q.loading.hide()
        vm.timeCounter2 = setInterval(ver, 3000)
        return true
      }
      function ver () {
        if (bool) {
          vm.save()
          clearInterval(vm.timeCounter2)
        } else {
          vm.$refs.carousel.next()
          clearInterval(vm.timeCounter2)
        }
        return true
      }
      this.atras = false
    },
    omitir (question, bool) {
      for (let i = 0; i < question.answers.length; i++) {
        question.answers[i].isActive = false
      }
      question.isActive = false
      question.selected = false
      if (bool) {
        this.save()
      } else {
        this.$refs.carousel.next()
      }
    },
    async save () {
      this.$q.loading.show({
        message: 'Terminando prueba...'
      })
      const a = new Audio(require('../../../public/nivel.mp3'))
      a.play()
      clearInterval(this.timeCounter)
      const cincuenta = (50 * this.test.point) / 100
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
      console.log(cincuenta)
      if (answer.total_point === this.test.point) {
        this.mensaje = '¡Felicidades! Estos son tus resultados. ¡Lo conseguiste y de manera impecable! Sigue jugando más niveles para superarte y llegar a nuestro top de jugadores estrella'
      } else if (answer.total_point > cincuenta && answer.total_point < this.test.point) {
        this.mensaje = '¡Buen trabajo! Estos son tus resultados, casi estás al máximo ¿Quieres intentarlo nuevamente y mejorar aún más tu puntuación? ¡Vamos por todo!'
      } else if (answer.total_point <= cincuenta) {
        this.mensaje = '¡Buen intento! Estos son tus resultados, sigue practicando para mejorar tus conocimientos y habilidades. ¡Puedes conseguirlo!'
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
.bordes {
  border: 2px solid $accent;
}
</style>
