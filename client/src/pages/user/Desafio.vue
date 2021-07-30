<template>
  <div>
    <q-btn class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$router.go(-1)" />
    <div class="q-py-sm row justify-center">
      <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
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
                    <q-item-section avatar>
                        <q-img :src="baseuNivel + scope.opt._id" style="width:40px; height:40px; border-radius:100%"/>
                    </q-item-section>
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
            <q-btn no-caps color="black" label="Desafiar" size="1.3em" style="width:100%" @click="desafiar()" />
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
      baseuNivel: '',
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
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.getAllUsers()
    this.getAsignaturas()
  },
  methods: {
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
          console.log(res)
        }
      })
    },
    desafiar () {
      this.$v.$touch()
      if (!this.$v.userSelec.$error && !this.$v.courseSelec.$error && !this.$v.nivelSelec.$error) {
        // hola
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
