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
      <img src="app movil 5.png" style="height: 280px;; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Examenes</div>
      <div class="text-grey-8 text-caption q-pl-md">Escoge el examen que deseas realizar</div>
      <div v-if="examenes.length" class="column items-center q-mt-md">
        <q-card v-for="(item,index) in examenes" :key="index" v-ripple clickable class="q-pa-none q-mb-md" style="width: 95%; border-radius: 15px"
        @click="$router.push('/iniciar_examen/' + item._id)">
          <q-img :src="baseuExamen + item._id" style="height: 100px; width: 100%; border-top-right-radius: 15px; border-top-left-radius: 15px" />
          <div class="q-pa-sm" style="height: 110px">
            <div class="text-grey-9 text-h6">{{item.title}}</div>
            <div class="row">
                <div class="col-6">
                    <div class="text-grey-9 text-caption">Preguntas: {{item.cantidad}}</div>
                </div>
                <div class="col-6">
                    <div class="text-caption text-grey-9"><b>Mejor calificación: </b>{{item.total_point + ' de ' + item.point}}</div>
                    <div class="text-caption text-grey-9"><b>Fecha: </b>{{item.fecha_test}}</div>
                </div>
            </div>
          </div>
        </q-card>
      </div>
      <q-card v-else class="shadow-2 q-ma-md q-pa-md">
        <div class="text-center text-subtitle1">Sin examenes registrados...</div>
      </q-card>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      baseuExamen: '',
      puntaje: 0,
      puntajeHoy: 0,
      examenes: []
    }
  },
  mounted () {
    this.baseuExamen = env.apiUrl + 'examen_img/'
    this.getExams()
    this.getPuntaje()
  },
  methods: {
    async getExams () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('examen').then(async res => {
        if (res) {
          this.examenes = res
          this.$q.loading.hide()
        }
      })
    },
    getPuntaje () {
      this.$api.get('user_info').then(res => {
        if (res) {
          this.puntaje = res.points
          this.$api.get('get_puntaje_dia/examen').then(async v => {
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
