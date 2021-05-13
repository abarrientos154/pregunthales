<template>
  <div>
    <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.title}}</div>
    <div class="text-h6 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.course.name}}</div>
    <q-card class="row justify-center bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Preguntas</div>
      </div>
    </q-card>
    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column dimension no-wrap" v-if="questions.length > 0">
          <div v-if="starT === false" class="row justify-center q-mt-md">
              <q-btn icon="play_arrow" color="primary" @click="start()" label="Iniciar Test"/>
            </div>
          <div v-if="starT === true">
            <q-card class="dimensionC q-px-xl q-pt-md q-pb-lg q-ma-lg" v-for="(qt, index) in questions" :key="index">
              <q-card class="row bg-blue-2 q-pa-sm q-mb-md">
                <div class="col-9 text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
              </q-card>
              <div class="row q-pl-lg" v-for="(item, index) in qt.answers" :key="index">
                <q-checkbox class="col-1" v-model="item.isActive"  @input="answerSelected(item, index, qt)"/>
                <q-item class="col-10 text-subtitle1 q-mb-sm" clickable> {{item.titleAnswer}}</q-item>
              </div>
            </q-card>
            <div class="row justify-center q-mb-md">
              <q-btn icon="add_circle" color="primary" @click="save()" label="Enviar Respuestas"/>
            </div>
          </div>
        </div>
        <q-card v-else class="shadow-2 q-ma-md q-pa-md">
          <div class="text-center text-subtitle1">Actualmente sin Preguntas...</div>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      test: {},
      questions: null,
      starT: false,
      user: null,
      answerId: null
    }
  },
  mounted () {
    this.getTestById()
    this.getUser()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
          console.log('this.user >> ', this.user)
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
          console.log('this.test >> ', this.test)
          this.questions = this.test.questions
          this.indexQ = this.questions.length + 1
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
    },
    answerSelected (answer, ind, question) {
      for (const i in question.answers) {
        if (i !== ind) {
          question.answers[i].isActive = false
        }
      }
      answer.isActive = true
    },
    async start () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas iniciar el test? Tienes 1:30:00 para resolverlo',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const answer = {
          title: this.test.title,
          total_questions: this.test.total_questions,
          family_id: this.test.family_id,
          id: this.test.id,
          questions: this.test.questions,
          user_id: this.user._id
        }
        await this.$api.post('answer', answer).then(res => {
          if (res) {
            this.starT = true
            this.answerId = res._id
            console.log('this.answerId :>> ', this.answerId)
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async save () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas enviar tus respuestas? Una vez enviado no se podra modificar',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const answer = {
          title: this.test.title,
          total_questions: this.test.total_questions,
          family_id: this.test.family_id,
          id: this.test.id,
          questions: this.test.questions,
          user_id: this.user._id
        }
        await this.$api.put('answer/' + this.answerId, answer).then(res => {
          if (res) {
            this.$router.push('/results/' + this.answerId)
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
