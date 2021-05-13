<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder q-mb-lg">Examenes</div>
    <q-list class="column items-center" style="width: 100%" v-if="examenes.length > 0">
      <q-card v-for="(item,index) in examenes" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 500px">
        <q-item>
          <q-item-section @click="$router.push('/tests_exam/' + item._id)">
            <q-item>
              <q-item-section avatar>
                <q-icon name="grading" size="30px"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.name}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round class="q-mx-sm" color="primary" icon="edit" @click="editExam(item)"/>
            <q-btn flat dense round class="q-mx-sm" color="red" icon="delete" @click="eiminarExam(item._id)"/>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin Examenes...</div>
    </q-card>
    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Examen' : 'Crear Examen'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input rounded dense outlined type="text" v-model="form.name" label="Nuevo nombre" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarExam() : nuevo ? crearExam() : ''" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="primary" size="20px" @click="editExam()"/>
    </q-page-sticky>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      nuevo: false,
      form: {},
      item: 0,
      examenes: []
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(20) }
    }
  },
  mounted () {
    this.getExam()
  },
  methods: {
    actualizarExam () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Examen, Por Favor Espere...'
        })
        this.$api.put('examen/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen Actualizado Correctamente'
            })
            this.getExam()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editExam (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    crearExam () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Examen, Por Favor Espere...'
        })
        this.$api.post('examen', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen Creado Correctamente'
            })
            this.getExam()
          }
        })
      }
    },
    eiminarExam (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('examen/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getExam()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getExam () {
      this.$api.get('examen').then(res => {
        if (res) {
          this.examenes = res
        }
      })
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
