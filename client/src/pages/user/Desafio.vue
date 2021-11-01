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
      <img src="app movil 2.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 text-center">Desafio por puntos</div>
      <div class="text-grey-8 text-caption text-center">Escoge la modalidad del juego</div>

      <div class="q-pa-md">
          <div class="text-grey-9">¿A quién vamos a desafiar?</div>
          <q-select outlined dense v-model="userSelec" :options="usuarios" map-options option-label="name" use-input @filter="filterFn" label="Nombre de usuario"
            :error="$v.userSelec.$error" @blur="$v.userSelec.$touch()" >
            <template v-slot:option="scope">
                <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                    >
                    <q-item-section avatar>
                        <q-img :src="baseuPerfil + scope.opt._id" style="width:40px; height:40px; border-radius:100%"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label v-html="scope.opt.name" />
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-italic text-grey-8 text-center">
                    No hay contrincantes registrados
                    </q-item-section>
                </q-item>
            </template>
        </q-select>

        <div v-if="userSelec" class="column items-center q-pb-md">
            <div>
                <q-img :src="baseuPerfil + userSelec._id" style="width:120px; height:120px; border-radius: 100%" />
            </div>
            <div class="text-h6 text-grey-8 q-pt-sm">{{userSelec.name}}</div>
            <div class="text-grey-8">Puntuació: {{userSelec.points}}</div>
        </div>

        <div class="text-grey-9">Selecciona la materia</div>
        <q-select outlined dense v-model="courseSelec" :options="courses" map-options option-label="name" label="Nombre de asignatura"
          :error="$v.courseSelec.$error" @blur="$v.courseSelec.$touch()" @input="niveles = courseSelec.tests, nivelSelec = null" >
            <template v-slot:option="scope">
                <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                    >
                    <q-item-section avatar>
                        <q-img :src="scope.opt.img" style="width:40px; height:40px; border-radius:100%"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label v-html="scope.opt.name" />
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-italic text-grey-8 text-center">
                    No hay materias registradas
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
        <div class="text-grey-9">Selecciona el nivel</div>
        <q-select outlined dense v-model="nivelSelec" :options="niveles" map-options option-label="title" label="Nivel"
          :error="$v.nivelSelec.$error" @blur="$v.nivelSelec.$touch()" >
            <template v-slot:option="scope">
                <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                    >
                    <q-item-section>
                        <q-item-label v-html="scope.opt.title" />
                    </q-item-section>
                </q-item>
            </template>
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-italic text-grey-8 text-center">
                    Selecciona una materia
                    </q-item-section>
                </q-item>
            </template>
        </q-select>

        <div class="row justify-center q-py-md">
            <q-btn no-caps color="accent" label="Desafiar" size="1.3em" style="width:100%" @click="desafiar()" />
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
      userSelec: null,
      courseSelec: null,
      nivelSelec: null,
      baseuPerfil: '',
      puntaje: 0,
      puntajeHoy: 0,
      user: {},
      courses: [],
      niveles: [],
      usuarios: [],
      usuariosFilter: []
    }
  },
  validations: {
    userSelec: { required },
    courseSelec: { required },
    nivelSelec: { required }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUser()
    this.getAllUsers()
    this.getAsignaturas()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
          this.puntaje = res.points
          this.getPuntaje()
        }
      })
    },
    async getAllUsers () {
      await this.$api.get('all_user').then(res => {
        if (res) {
          this.usuarios = res
          this.usuariosFilter = res
        }
      })
    },
    async getAsignaturas () {
      await this.$api.get('course').then(res => {
        if (res) {
          this.courses = res
        }
      })
    },
    getPuntaje () {
      this.$api.get('get_puntaje_dia/desafio').then(async res => {
        this.puntajeHoy = res
        if (res >= 500 && !this.user.membresia) {
          this.$q.dialog({
            title: 'Atención',
            message: 'Haz alcanzado tu capacidad de puntos en desafios por día, debes esperar a mañana para seguir desafiando',
            cancel: false,
            persistent: true
          }).onOk(() => {
            this.$router.go(-1)
          })
        }
      })
    },
    async desafiar () {
      this.$v.$touch()
      if (!this.$v.userSelec.$error && !this.$v.courseSelec.$error && !this.$v.nivelSelec.$error) {
        this.$q.loading.show({
          message: 'Enviando desafio...'
        })
        await this.$api.get('testById/' + this.nivelSelec._id).then(async v => {
          if (v) {
            const desafio = {
              title: this.nivelSelec.title,
              total_questions: v.questions.length,
              family_id: this.nivelSelec.family_id,
              id: this.nivelSelec.id,
              nivel_id: this.nivelSelec._id,
              desafiado_id: this.userSelec._id,
              creador_id: this.user._id,
              ganador: 0,
              status1: 0,
              status2: 0,
              questions: v.questions.map(v => {
                return {
                  ...v,
                  selected: false
                }
              })
            }
            await this.$api.post('desafio', desafio).then(res => {
              if (res) {
                this.$q.loading.hide()
                this.$router.go(-1)
              }
            })
          }
        })
      }
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.usuarios = this.usuariosFilter
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.usuarios = this.usuariosFilter.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
