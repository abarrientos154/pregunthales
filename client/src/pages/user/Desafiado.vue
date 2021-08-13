<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="absolute-top-right text-white q-pa-sm text-right">
      <div>Puntaje de hoy</div>
      <div class="text-h6">{{puntaje}}</div>
    </div>
    <div class="row justify-center">
      <img src="app movil 9.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 text-center">Desafio por puntos</div>
      <div class="text-grey-8 text-caption text-center">Tu amigo te está desafiando</div>

      <div class="q-pa-md">
        <div class="column items-center q-pb-md">
            <div>
                <q-img :src="baseuPerfil + desafio.creador_id" style="width:120px; height:120px; border-radius: 100%" />
            </div>
            <div class="text-h6 text-grey-8 q-pt-sm">{{desafio.creadorInfo ? desafio.creadorInfo.name : ''}}</div>
            <div class="text-grey-8">Puntuació: {{desafio.creadorInfo ? desafio.creadorInfo.points : ''}}</div>
        </div>

        <div class="text-grey-9">¿Quieres aceptar el desafio?</div>
        <q-select outlined dense v-model="respuesta" :options="['Si', 'No']"
          :error="$v.respuesta.$error" @blur="$v.respuesta.$touch()">
        </q-select>

        <div class="row justify-center q-py-md">
            <q-btn no-caps color="black" label="Responder" size="1.3em" style="width:100%" @click="responder()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import env from '../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      respuesta: '',
      baseuPerfil: '',
      baseuNivel: '',
      puntaje: 0,
      desafio: {}
    }
  },
  validations: {
    respuesta: { required }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.getDesafio()
    this.getUser()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.getPuntaje(res.membresia)
        }
      })
    },
    async getDesafio () {
      await this.$api.get('desafioById/' + this.$route.params.id).then(res => {
        if (res) {
          this.desafio = res
        }
      })
    },
    getPuntaje (bool) {
      this.$api.get('get_puntaje_dia/desafio').then(async res => {
        this.puntaje = res
        if (res >= 500 && !bool) {
          this.$q.dialog({
            title: 'Atención',
            message: 'Haz alcanzado tu capacidad de puntos en desafios por día, debes esperar a mañana para aceptar desafios',
            cancel: false,
            persistent: true
          }).onOk(() => {
            this.$router.push('/desafios')
          })
        }
      })
    },
    responder () {
      this.$v.$touch()
      if (!this.$v.respuesta.$error) {
        this.$q.loading.show({
          message: 'Enviando respuesta...'
        })
        if (this.respuesta === 'Si') {
          this.$api.put('desafio/' + this.$route.params.id, { status1: 1, status2: 1 }).then(res => {
            if (res) {
              this.$router.push('/nivel/' + this.desafio.nivel_id + '/' + this.desafio._id)
              this.$q.loading.hide()
            }
          })
        } else {
          this.$api.put('desafio/' + this.$route.params.id, { status1: 3, status2: 3 }).then(res => {
            if (res) {
              this.$router.push('/desafios')
              this.$q.loading.hide()
            }
          })
        }
      }
    }
  }
}
</script>
