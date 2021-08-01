<template>
  <div>
    <q-carousel
      v-model="slide"
      animated
      class="window-height"
    >
      <q-carousel-slide :name="1" class="q-pa-none">
        <q-btn class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$router.go(-1)" />
        <div class="absolute-center" style="width:100%">
          <div class="q-pb-sm row justify-center">
            <img :src="baseuNivel + test._id" style="height: 280px; width: 280px">
          </div>
          <div class="text-center text-h6 text-grey-8">Comenzar <b>{{test.title}}</b></div>
        </div>
        <div class="absolute-bottom row justify-center q-py-md">
          <q-btn no-caps color="black" label="Comenzar" size="lg" style="width: 90%" @click="start()" />
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
                <q-btn class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$refs.carousel.previous()" />
                <div class="absolute-top-right q-pa-md">
                  <div class="text-h6 text-grey-9 text-right">Tiempo disponible</div>
                  <div class="text-h6 text-grey-9 text-right">{{test.time}}</div>
                </div>
                <div class="row justify-center">
                    <img :src="baseuPregunta + pregunta._id" style="height: 400px; width: 100%">
                </div>
                <div class="shadow-up-1 column items-center justify-center" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <div class="text-subtitle1 text-grey-9 text-center q-pa-md">{{pregunta.question}}</div>
                    <div class="row justify-around" style="width:100%">
                        <div class="col-6 q-px-xs q-pb-md" v-for="(item, index2) in pregunta.answers" :key="index2">
                            <q-btn no-caps :outline="item.isActive ? false : true" color="primary" :text-color="item.isActive ? 'white' : 'grey-9'" :label="item.titleAnswer" style="width:100%"
                            @click="answerSelected(item, pregunta)" />
                        </div>
                    </div>
                    <div class="column items-center q-py-md" style="width:100%;">
                        <q-btn no-caps color="black" :label="index + 1 === questions.length ? 'Terminar' : 'Responder'" style="width:90%" size="lg" :disable="index + 1 === questions.length ? false : pregunta.isActive ? false : true" @click="index + 1 === questions.length ? save() : $refs.carousel.next()" />
                        <q-btn v-if="index + 1 !== questions.length" flat no-caps color="grey-9" label="Omitir" style="width:90%" size="lg" @click="omitir(pregunta)" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>
      </q-carousel-slide>

      <q-carousel-slide :name="3" class="q-pa-none column justify-between" style="height:auto">
        <div class="text-center text-grey-8 text-h6 q-pt-md">Examen finalizado con éxito</div>
        <div style="width:100%">
          <div class="q-pb-sm row justify-center">
            <img :src="baseuNivel + $route.params.id" style="height: 280px; width: 280px">
          </div>
          <div class="text-center text-h6 text-grey-8">Tu puntuación fue: {{test.total_point}}</div>
          <div class="text-center text-h6 text-grey-8">Preguntas omitidas: {{test.omitidas}}</div>
          <div class="text-center text-h6 text-grey-8">Puntuación anterior: {{test.anterior ? test.anterior : 'No hay'}}</div>
          <div class="text-center text-h6 text-grey-8">Tiempo de término: </div>
        </div>
        <div class="column items-center q-py-md">
          <q-btn no-caps color="black" label="Ir al inicio" size="lg" style="width: 90%" @click="$router.go(-1)" />
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
      baseuNivel: '',
      baseuPregunta: '',
      slide: 1,
      slide2: 1,
      test: {},
      questions: []
    }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.baseuPregunta = env.apiUrl + 'pregunta_img/'
    this.getTestById()
    this.getUser()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    async getTestById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('testById/' + this.$route.params.id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.test = res
          this.questions = this.test.questions
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
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
            total_questions: this.test.questions.length,
            family_id: this.test.family_id,
            id: this.test.id,
            user_id: this.user._id,
            questions: this.test.questions.map(v => {
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
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas enviar tus respuestas? Una vez enviadas no se podrán modificar',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.$q.loading.show({
          message: 'Evaluando Datos...'
        })
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
        num3 = (num * this.test.point) / this.test.questions.length
        const answer = {
          questions: this.questions,
          total_point: num3,
          correctas: num,
          omitidas: num2
        }
        await this.$api.put('answer/' + this.answerId, answer).then(res => {
          if (res) {
            this.test = res
            this.$q.loading.hide()
            this.slide = 3
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
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
