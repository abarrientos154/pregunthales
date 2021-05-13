<template>
  <div>
    <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.title}}</div>
    <div class="text-h6 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.course.name}}</div>
    <q-card class="row justify-center bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Resultados</div>
      </div>
    </q-card>
    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column dimension no-wrap" v-if="questions.length > 0">
          <q-card class="dimensionC q-px-xl q-pt-md q-pb-lg q-ma-lg" v-for="(qt, index) in questions" :key="index">
            <q-card class="row bg-blue-2 q-pa-sm q-mb-md">
              <div class="col-9 text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
            </q-card>
            <div class="row q-pl-lg" v-for="(item, index) in qt.answers" :key="index">
              <q-checkbox disable class="col-1" v-model="item.isActive"/>
              <q-item class="col-10 text-subtitle1 q-mb-sm" clickable>
                <div v-if="item.isActive" :class="item.isRigth === true ? 'bg-green q-pa-sm' : 'bg-red q-pa-sm'">
                  {{item.titleAnswer}}
                </div>
                <div v-else>
                  {{item.titleAnswer}}
                </div></q-item>
            </div>
          </q-card>
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
      await this.$api.get('answerById/' + this.$route.params.id).then(res => {
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
