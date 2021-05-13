<template>
  <div>
    <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.title}}</div>
    <div class="text-h6 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.exam.name}}</div>
    <q-card class="row justify-center bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Preguntas</div>
      </div>
    </q-card>
    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column dimension no-wrap" v-if="questions.length > 0">
          <q-card class="dimensionC q-px-xl q-pt-md q-pb-lg q-ma-lg" v-for="(qt, index) in questions" :key="index">
            <q-card class="row justify-between bg-blue-2 q-pa-sm q-mb-md">
              <div class="text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
            </q-card>
            <div class="row q-pl-lg" v-for="(item, index) in qt.answers" :key="index">
              <q-checkbox class="col-1" v-model="item.isActive"  @input="answerSelected(item, index, qt)"/>
              <q-item class="col-10 text-subtitle1 q-mb-sm" clickable> {{item.titleAnswer}}</q-item>
            </div>
          </q-card>
          <div class="row justify-center q-mb-md">
            <q-btn icon="add_circle" color="primary" @click="send()" label="Enviar Respuestas"/>
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
      questions: null
    }
  },
  mounted () {
    this.getTestById()
  },
  methods: {
    async getTestById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('testExamById/' + this.$route.params.id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.test = res
          console.log('this.test >> ', this.test)
          this.questions = this.test.questions
          this.indexQ = this.questions.length + 1
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
    send () {
      console.log('envia respuesta')
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
