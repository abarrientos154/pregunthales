<template>
  <div>
    <div class="text-h5 text-center q-my-md text-primary">{{examen.title}}</div>

    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column items-center q-py-md" v-if="questions.length">
          <q-card class="q-pa-none q-mb-md" v-for="(item, index) in questions" :key="index" style="width: 98%; height: 180px; border-radius: 20px; min-width: 300px; max-width: 500px">
            <div class="row items-start">
              <div class="col-5">
                <q-img :src="item.course_img" style="width: 100%; height: 180px; border-top-left-radius: 20px; border-bottom-left-radius: 20px" >
                  <div class="q-pl-sm text-h6" style="width:100%">{{item.course.name}}</div>
                </q-img>
              </div>
              <div class="col-7 q-px-sm">
                <div class="row items-center q-py-sm">
                  <q-img :src="baseuNivel + item.nivel_img" style="width: 50px; height: 50px; border-radius: 100%" />
                  <div class="q-pl-sm text-h6">{{item.nivel.title}}</div>
                </div>
                <div class="q-pl-xl">
                  <div>Preguntas: <b>{{item.cantidad}}</b></div>
                </div>
                <div class="row absolute-bottom justify-end q-pa-md q-gutter-sm">
                  <q-btn round flat dense icon="edit" color="primary" @click="questEdit(item)" />
                  <q-btn round flat dense icon="delete" color="negative" @click="destroyQuest(item._id)" />
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <q-card v-else class="shadow-2 q-ma-md q-pa-md">
          <div class="text-center text-subtitle1">Actualmente sin Preguntas...</div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="accent" size="20px" :disable="examen.faltantes > 0 ? false : true"
      @click="newQuest()" />
    </q-page-sticky>

    <q-dialog v-model="nueva">
        <q-card class="q-pa-md" style="width:100%">
            <div class="text-primary text-h6">{{edit ? 'Editar' : 'Nuevo'}} paquete de preguntas</div>
            <div class="q-pb-md text-grey-9">Preguntas faltantes: {{examen.faltantes}}</div>
            <div class="text-grey-9">Selecciona la materia</div>
            <q-select outlined dense v-model="courseSelec" :options="courses" map-options option-label="name" label="Nombre de asignatura"
            :error="$v.courseSelec.$error" @blur="$v.courseSelec.$touch()" @input="verifyNivel(courseSelec, false)" >
                <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" >
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
                            <q-item-label caption v-html="scope.opt.total_question + ' preguntas'" />
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

            <div>Cantidad de preguntas</div>
            <q-input
                v-model.number="form.cantidad"
                type="number"
                placeholder="0"
                outlined
                dense
                :error="errorCantidad"
                error-message="Ingresa una cantidad válida según el nivel y el examen"
                @input="verifyCantidad(false)"
            />

            <div class="row justify-center q-pt-lg">
                <q-btn no-caps color="accent" label="Guardar" style="width:80%" @click="!edit ? generar() : actualizar()" />
            </div>
        </q-card>
    </q-dialog>
  </div>
</template>
<script>
import env from '../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      courseSelec: null,
      nivelSelec: null,
      edit: false,
      nueva: false,
      errorCantidad: false,
      questId: '',
      baseuPregunta: '',
      baseuNivel: '',
      faltantes: 0,
      form: {},
      examen: {},
      questions: [],
      courses: [],
      niveles: []
    }
  },
  validations: {
    courseSelec: { required },
    nivelSelec: { required }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.getExamtById()
    this.getAsignaturas()
  },
  methods: {
    async getExamtById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getExamWithQuest/' + this.$route.params.id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.examen = res
          console.log('data', res)
          this.questions = res.questions
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
    verifyNivel (data, bool) {
      this.niveles = data.tests.filter(v => {
        if (!this.questions.find(x => x.nivel_id === v.id)) {
          return v
        } else {
          if (this.edit && v.id === this.nivelSelec.id) {
            return v
          } else {
            return false
          }
        }
      })
      if (!this.edit) {
        this.nivelSelec = null
      } else {
        if (!bool) {
          this.nivelSelec = null
        }
      }
    },
    verifyCantidad (bool) {
      if (this.edit) {
        if (bool) {
          this.faltantes = this.examen.faltantes + this.form.cantidad
        }
      } else {
        this.faltantes = this.examen.faltantes
      }
      if ((this.form.cantidad > this.faltantes) || (this.nivelSelec && (this.form.cantidad > this.nivelSelec.total_question))) {
        this.errorCantidad = true
      } else {
        this.errorCantidad = false
      }
    },
    newQuest () {
      this.form = {}
      this.courseSelec = null
      this.nivelSelec = null
      this.niveles = []
      this.errorCantidad = false
      this.$v.courseSelec.$reset()
      this.$v.nivelSelec.$reset()
      this.edit = false
      this.faltantes = 0
      this.nueva = true
    },
    questEdit (data) {
      this.questId = data._id
      this.form.cantidad = data.cantidad
      this.courseSelec = data.course
      this.nivelSelec = data.nivel
      this.edit = true
      this.faltantes = 0
      this.verifyNivel(this.courseSelec, true)
      this.verifyCantidad(true)
      this.nueva = true
    },
    async generar () {
      this.$v.$touch()
      if (!this.form.cantidad || (this.nivelSelec && (this.form.cantidad > this.nivelSelec.total_question))) {
        this.errorCantidad = true
      } else {
        this.errorCantidad = false
      }
      if (!this.errorCantidad && !this.$v.courseSelec.$error && !this.$v.nivelSelec.$error) {
        this.$q.loading.show({
          message: 'Generando preguntas...'
        })
        this.form.nivel_img = this.nivelSelec._id
        this.form.course_img = this.courseSelec.img
        this.form.course_id = this.courseSelec._id
        this.form.nivel_id = this.nivelSelec.id
        this.form.exam_id = this.$route.params.id
        await this.$api.post('examen_questions', this.form).then(res => {
          if (res) {
            this.nueva = false
            this.$q.loading.hide()
            this.getExamtById()
          }
        })
      }
    },
    async actualizar () {
      this.$v.$touch()
      if (!this.form.cantidad || (this.nivelSelec && (this.form.cantidad > this.nivelSelec.total_question))) {
        this.errorCantidad = true
      } else {
        this.errorCantidad = false
      }
      if (!this.errorCantidad && !this.$v.courseSelec.$error && !this.$v.nivelSelec.$error) {
        this.$q.loading.show({
          message: 'Actualizando...'
        })
        this.form.nivel_img = this.nivelSelec._id
        this.form.course_img = this.courseSelec.img
        this.form.course_id = this.courseSelec._id
        this.form.nivel_id = this.nivelSelec.id
        await this.$api.put('examen_questions/' + this.questId, this.form).then(res => {
          if (res) {
            this.nueva = false
            this.$q.loading.hide()
            this.getExamtById()
          }
        })
      }
    },
    destroyQuest (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este paquete de preguntas?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando Datos...'
        })
        this.$api.delete('examen_questions/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Paquete eliminado correctamente'
            })
            this.getExamtById()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    }
  }
}
</script>
