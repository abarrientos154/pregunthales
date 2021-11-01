<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="absolute-top-right text-white q-pa-sm text-right">
      <div class="text-h6">Puntaje general</div>
      <div class="text-h5 text-bold">{{puntaje}}</div>
      <div class="q-pt-sm">Puntaje de hoy</div>
      <div>{{puntajeHoy}}</div>
    </div>
    <div class="row justify-center">
      <img src="app movil 8.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">{{course.name}}</div>
      <div class="text-grey-8 text-caption q-pl-md">{{course.description}}</div>
      <div v-if="tests.length > 0" class="column items-center q-mt-md">
        <q-card v-for="(item,index) in tests" :key="index" v-ripple class="bordes q-pa-none q-mb-md" style="width: 98%; border-radius: 15px"
        @click="item.enable ? $router.push('/nivel/' + item._id) : ''">
          <div class="bg-accent row justify-center items-center" style="height:50px; width:100%">
            <div v-if="!item.enable">
              <q-icon size="lg" color="white" name="lock" />
            </div>
          </div>
          <div class="row q-pa-sm" style="height: 100px">
            <div class="col-6">
              <div class="text-grey-9 text-h6">{{item.title}}</div>
              <div class="text-grey-9 text-caption">Nivel {{item.type ? 'gratuito' : 'pago'}}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-9"><b>Mejor calificación: </b>{{item.total_point + ' de ' + item.point}}</div>
              <div class="text-caption text-grey-9"><b>Fecha: </b>{{item.fecha_test}}</div>
            </div>
          </div>
        </q-card>
      </div>
      <q-card v-else class="shadow-2 q-ma-md q-pa-md">
        <div class="text-center text-subtitle1">Sin nieveles disponibles...</div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      puntaje: 0,
      puntajeHoy: 0,
      form: {},
      course: {},
      tests: []
    }
  },
  mounted () {
    this.getCourse(this.$route.params.id)
    this.getPuntaje()
  },
  methods: {
    async getCourse (id) {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getCourseWithTest/' + id).then(async res => {
        if (res) {
          this.$q.loading.hide()
          this.course = res
          this.tests = this.course.tests
        }
      })
    },
    getPuntaje () {
      this.$api.get('user_info').then(res => {
        if (res) {
          this.puntaje = res.points
          this.$api.get('get_puntaje_dia/solo').then(async v => {
            if (v) {
              this.puntajeHoy = v
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 2px solid $accent;
}
</style>
