<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div v-if="login" class="absolute-top-right text-white q-pa-sm text-right">
      <div class="text-h6">Puntaje general</div>
      <div class="text-h5 text-bold">{{puntaje}}</div>
      <div class="q-pt-sm">Puntaje de hoy</div>
      <div>{{puntajeHoy}}</div>
    </div>
    <div class="row justify-center">
      <img src="app movil 15.png" style="height: 280px;; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Desafio individual</div>
      <div class="text-grey-8 text-caption q-pl-md">Escoge la materia que quieres entrenar</div>
      <div class="column items-center q-mt-md">
        <q-card v-for="(item,index) in asig" :key="index" v-ripple clickable class="q-pa-none q-mb-md" style="width: 95%; border-radius: 15px">
          <div class="row">
            <div class="col-6 q-pa-sm">
              <div class="text-h6 text-grey-9 ellipsis">{{item.name}}</div>
              <div class="text-caption text-grey-9 ellipsis-3-lines">{{'Descripcion'}}</div>
              <div class="absolute-bottom q-pa-md">
                <q-btn no-caps color="accent" label="Ingresar"
                @click="login ? this.$router.push('/asignatura/niveles/' + item._id) : noLogin = true" />
              </div>
            </div>
            <div class="col-6 q-pa-none">
              <q-img :src="item.img" style="height: 170px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px" />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="noLogin">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6 text-center">Atención</div>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          Te invitamos a registrarte para seguir disfrutanto de nuestra aplicación
        </q-card-section>

        <q-card-actions align="center" class="column">
          <q-btn no-caps label="¡Registrarme ahora!" color="accent" to="/registro" />
          <q-btn no-caps flat label="Ya tengo una cuenta" color="primary" to="/login" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login: false,
      noLogin: false,
      puntaje: 0,
      puntajeHoy: 0,
      asig: []
    }
  },
  mounted () {
    const value = localStorage.getItem('SESSION_INFO')
    if (value) {
      this.login = true
      this.getPuntaje()
    }
    this.getAsignaturas()
  },
  methods: {
    async getAsignaturas () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('course').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.asig = res
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
