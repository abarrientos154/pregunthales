<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h5 q-pb-md">Examenes</div>
    <div class="column items-center" style="width: 100%" v-if="examenes.length">
      <q-card v-for="(item,index) in examenes" clickable v-ripple :key="index" class="q-pa-none q-mb-md" style="width: 98%; height: 180px; border-radius: 15px; min-width: 300px; max-width: 500px">
        <div class="row">
          <div class="col-6 q-pa-sm">
            <div class="text-subtitle1 text-bold">{{item.title}}</div>
            <div>Preguntas: <b>{{item.cantidad}}</b></div>
            <div>Puntuación: <b>{{item.point}}</b></div>
            <div>Estado: <b>{{item.enable ? 'Completo' : 'En proceso'}}</b></div>
          </div>
          <div class="col-6 q-pa-none">
            <q-img :src="baseuExamen + item._id" style="height: 180px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px" />
          </div>
          <div class="absolute-bottom row q-pa-md">
              <q-btn flat dense round class="q-mx-sm" color="primary" icon="edit" @click="editExam(item)"/>
              <q-btn flat dense round class="q-mx-sm" color="red" icon="delete" @click="eiminarExam(item._id)"/>
              <q-btn no-caps class="q-mx-sm" color="accent" label="Ingresar"
              @click="$router.push('/examen/' + item._id)"/>
            </div>
        </div>
      </q-card>
    </div>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin examenes...</div>
    </q-card>

    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Examen' : 'Crear Examen'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="column items-center q-pb-sm">
            <q-avatar size="100px" class="bg-grey-5">
              <q-img :src="edit ? imgExamen : examenFile ? imgExamen : ''" style="height: 100%">
                <q-file borderless v-model="examenFile" @input="changeFile()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px">
                  <q-icon name="cloud_upload" class="absolute-center q-mt-lg" size="45px" color="white" />
                </q-file>
              </q-img>
            </q-avatar>
            <div :class="$v.examenFile.$error ? 'text-negative' : 'text-grey-9'">Imagen del examen</div>
          </div>
          <q-input
            dense
            outlined
            type="text"
            v-model="form.title"
            label="Nuevo nombre"
            :error="$v.form.title.$error"
            error-message="Este campo es requerido"
            @blur="$v.form.title.$touch()"
          />
          <div class="row justify-around q-gutter-md">
            <div class="col">
              <div>Puntuación del examen</div>
              <q-input
                  v-model.number="form.point"
                  type="number"
                  placeholder="0"
                  outlined
                  dense
                  :error="$v.form.point.$error"
                  error-message="Este campo es requerido"
                  @blur="$v.form.point.$touch()"
                />
            </div>
            <div class="col">
              <div>Duración del examen</div>
              <q-input
                v-model.number="form.time"
                type="number"
                suffix="min"
                outlined
                dense
                :error="$v.form.time.$error"
                error-message="Este campo es requerido"
                @blur="$v.form.time.$touch()"
              />
            </div>
          </div>
          <div class="row justify-around q-gutter-md">
            <div class="col">
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
            </div>
            <q-toggle
                class="col"
                v-model="form.type"
                label="Examen gratuito"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="accent" v-close-popup no-caps style="width:100px"/>
          <q-btn :label="edit ? 'Actualizar' :  'Guardar'" color="accent" no-caps style="width:100px"
          @click="edit ? actualizarExam() : crearExam()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="accent" size="20px" @click="editExam()"/>
    </q-page-sticky>
  </div>
</template>

<script>
import env from '../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      nuevo: false,
      examenFile: null,
      imgExamen: '',
      baseuExamen: '',
      form: {
        type: false
      },
      examenes: []
    }
  },
  validations: {
    form: {
      title: { required },
      point: { required },
      cantidad: { required },
      time: { required }
    },
    examenFile: { required }
  },
  mounted () {
    this.baseuExamen = env.apiUrl + 'examen_img/'
    this.getExams()
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
    crearExam () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.examenFile.$error) {
        this.$q.loading.show({
          message: 'Agregando examen, por favor espere...'
        })
        this.form.enable = false
        const formData = new FormData()
        formData.append('files', this.examenFile)
        formData.append('dat', JSON.stringify(this.form))
        this.$api.post('examen', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen creado correctamente'
            })
            this.getExams()
            this.$q.loading.hide()
            this.nuevo = false
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    actualizarExam () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando examen, por favor espere...'
        })
        const formData = new FormData()
        if (this.examenFile) {
          formData.append('files', this.examenFile)
          this.form.file = true
        } else {
          this.form.file = false
        }
        formData.append('dat', JSON.stringify(this.form))
        this.$api.put('examen/' + this.form._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen actualizado correctamente'
            })
            this.nuevo = false
            if (this.form.file) {
              location.reload()
            }
            this.getExams()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {
        type: false
      }
      this.examenFile = null
      this.imgExamen = ''
      this.edit = false
    },
    editExam (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.imgExamen = this.baseuExamen + this.form._id
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
        this.$v.examenFile.$reset()
        this.$v.form.$reset()
      }
    },
    eiminarExam (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando examen...'
        })
        this.$api.delete('examen/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getExams()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    changeFile () {
      if (this.examenFile) { this.imgExamen = URL.createObjectURL(this.examenFile) }
    }
  }
}
</script>
