<template>
  <div>
    <div class="text-h5 text-center q-my-md text-primary">{{examen.title}}</div>

    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column items-center q-py-md" v-if="questions.length">
          <q-card class="q-py-md q-mb-md" v-for="(qt, index) in questions" :key="index" style="width:100%">
            <div class="row items-start">
              <div class="col-3 row justify-center q-mr-sm">
                <img :src="baseuPregunta + qt._id" style="width: 150px; height: 150px; border-radius: 10px"/>
              </div>
              <div class="col">
                <q-card class="row bg-blue-2 q-pa-sm q-mb-md">
                  <div class="col-9 text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
                  <div>
                    <q-btn class="col-6" round flat size="md" text-color="primary" icon="edit" @click="questEdit(qt._id)"  />
                    <q-btn class="col-6" round flat size="md" text-color="primary" icon="delete" @click="destroyQuest(qt._id)" />
                  </div>
                </q-card>
                  <div v-for="(item, index2) in qt.answers" :key="index2">
                    <q-item clickable>
                      <div class="row items-start no-wrap">
                        <div class="text-bold q-pr-sm">{{index2 == 0 ? 'A)' : index2 == 1 ? 'B)' : index2 == 2 ? 'C)' : 'D)'}}</div>
                        <div class="text-subtitle1">{{item.titleAnswer}}</div>
                      </div>
                    </q-item>
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
      <q-btn round icon="add" color="primary" size="20px" @click="newQuest()" />
    </q-page-sticky>

    <q-dialog v-model="nueva">
        <q-card class="q-pa-md" style="width:100%">
            <div class="text-primary text-h6 q-pb-md">{{edit ? 'Editar' : 'Nueva'}} pregunta</div>
            <div class="text-grey-9">Selecciona la materia</div>
            <q-select outlined dense v-model="courseSelec" :options="courses" map-options option-label="name" label="Nombre de asignatura"
            :error="$v.courseSelec.$error" @blur="$v.courseSelec.$touch()" @input="niveles = courseSelec.tests, nivelSelec = null" >
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
                :error="$v.form.cantidad.$error"
                error-message="Este campo es requerido"
                @blur="$v.form.cantidad.$touch()"
            />

            <div class="row justify-center q-pt-lg">
                <q-btn no-caps color="black" label="Generar preguntas" style="width:80%" @click="generar()" />
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
      baseuPregunta: '',
      baseuNivel: '',
      form: {},
      examen: {},
      questions: [],
      courses: [],
      niveles: []
    }
  },
  validations: {
    form: {
      cantidad: { required }
    },
    courseSelec: { required },
    nivelSelec: { required }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.baseuPregunta = env.apiUrl + 'pregunta_img/'
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
    newQuest () {
      this.edit = false
      this.form = {}
      this.courseSelec = null
      this.nivelSelec = null
      this.$v.form.$reset()
      this.$v.courseSelec.$reset()
      this.$v.nivelSelec.$reset()
      this.nueva = true
    },
    async generar () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.courseSelec.$error && !this.$v.nivelSelec.$error) {
        this.$q.loading.show({
          message: 'Generando preguntas...'
        })
        this.form.nivel_id = this.nivelSelec.id
        this.form.exam_id = this.$route.params.id
        await this.$api.post('examen_questions', this.form).then(res => {
          if (res) {
            this.getExamtById()
            this.$q.loading.hide()
          }
        })
      }
    },
    questEdit () {
      this.edit = true
      this.nueva = true
    },
    destroyQuest (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Pregunta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando Datos...'
        })
        this.$api.delete('destroyQuest/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Eliminada Correctamente'
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
