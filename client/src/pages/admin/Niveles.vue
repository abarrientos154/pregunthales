<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h5">{{course.name}}</div>
    <div class="text-black text-subtitle1 text-weight-bolder q-mb-lg">Niveles</div>
    <q-list class="column items-center" style="width: 100%" v-if="tests.length > 0">
      <q-card v-for="(item,index) in tests" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 500px">
        <q-item>
          <q-item-section @click="$router.push('/preguntas/' + item._id)">
            <q-item>
              <q-item-section>
                <div class="row items-center q-gutter-md">
                  <img :src="baseuNivel + item._id" style="width: 70px; height: 70px; border-radius: 10px"/>
                <div class="text-black text-bold text-h6">{{item.title}}</div>
                </div>
              </q-item-section>
            </q-item>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round class="q-mx-sm" color="primary" icon="edit" @click="editTem(item)"/>
            <q-btn flat dense round class="q-mx-sm" color="red" icon="delete" @click="eiminarTem(item._id)"/>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin niveles...</div>
    </q-card>

    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Nivel' : 'Crear Nivel'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="column items-center q-pb-sm">
            <q-avatar size="100px" class="bg-grey-5">
              <q-img :src="edit ? imgNivel : nivelFile ? imgNivel : ''" style="height: 100%">
                <q-file borderless v-model="nivelFile" @input="changeFile()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px">
                  <q-icon name="cloud_upload" class="absolute-center q-mt-lg" size="45px" color="white" />
                </q-file>
              </q-img>
            </q-avatar>
            <div :class="$v.nivelFile.$error ? 'text-negative' : 'text-grey-9'">Imagen del nivel</div>
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
          <div class="row justify-around q-pb-md q-gutter-md">
            <div class="col">
              <div>Puntuación del nivel</div>
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
              <div>Duración del nivel</div>
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
          <q-toggle
            v-model="form.type"
            label="Nivel gratuito"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" v-close-popup no-caps style="width:100px"
          @click="decartarCamb()" />
          <q-btn :label="edit ? 'Actualizar' :  'Guardar'" color="primary" no-caps style="width:100px"
          @click="edit ? actualizarTem() : crearTem()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="primary" size="20px" @click="editTem()"/>
    </q-page-sticky>
  </div>
</template>

<script>
import env from '../../env'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      nuevo: false,
      nivelFile: null,
      imgNivel: '',
      baseuNivel: '',
      form: {
        type: false
      },
      course: {},
      tests: []
    }
  },
  validations: {
    form: {
      title: { required, minLength: minLength(3), maxLength: maxLength(20) },
      point: { required },
      time: { required }
    },
    nivelFile: { required }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.getCourse(this.$route.params.id)
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
    crearTem () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.nivelFile.$error) {
        this.$q.loading.show({
          message: 'Agregando nivel, por favor espere...'
        })
        this.form.family_id = this.$route.params.id
        const formData = new FormData()
        formData.append('files', this.nivelFile)
        formData.append('dat', JSON.stringify(this.form))
        this.$api.post('nivel', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Nivel creado correctamente'
            })
            this.getCourse(this.$route.params.id)
            this.$q.loading.hide()
            this.nuevo = false
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    actualizarTem () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando nivel, por favor espere...'
        })
        const formData = new FormData()
        if (this.nivelFile) {
          formData.append('files', this.nivelFile)
          this.form.file = true
        } else {
          this.form.file = false
        }
        formData.append('dat', JSON.stringify(this.form))
        this.$api.put('nivel/' + this.form._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Nivel actualizado correctamente'
            })
            this.nuevo = false
            if (this.form.file) {
              location.reload()
            }
            this.getCourse(this.$route.params.id)
          }
        })
      }
    },
    decartarCamb () {
      this.form = {
        type: false
      }
      this.edit = false
    },
    editTem (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        console.log(this.form)
        this.imgNivel = this.baseuNivel + this.form._id
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
        this.$v.form.$reset()
      }
    },
    eiminarTem (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este nivel?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando nivel...'
        })
        this.$api.delete('nivel/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getCourse(this.$route.params.id)
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    changeFile () {
      if (this.nivelFile) { this.imgNivel = URL.createObjectURL(this.nivelFile) }
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border-left: 6px solid $primary;
  background-color: rgba(202, 202, 202, 0.474);
  border-radius: 12px;
}
</style>
