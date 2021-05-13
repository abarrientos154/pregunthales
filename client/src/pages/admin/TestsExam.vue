<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h5">{{course.name}}</div>
    <div class="text-black text-subtitle1 text-weight-bolder q-mb-lg">Temas</div>
    <q-list class="column items-center" style="width: 100%" v-if="tests.length > 0">
      <q-card v-for="(item,index) in tests" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 500px">
        <q-item>
          <q-item-section @click="$router.push('/exam/' + item._id)">
            <q-item>
              <q-item-section avatar>
                <q-icon name="source" size="30px"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.title}}</q-item-label>
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
      <div class="text-center text-subtitle1">Actualmente sin Temas...</div>
    </q-card>
    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Tema' : 'Crear Tema'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input rounded dense outlined type="text" v-model="form.title" label="Nuevo nombre" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarTem() : crearTem()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="primary" size="20px" @click="editTem()"/>
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
      course: {},
      tests: []
    }
  },
  validations: {
    form: {
      title: { required, minLength: minLength(3), maxLength: maxLength(80) }
    }
  },
  mounted () {
    this.getCourse(this.$route.params.id)
    console.log('this.$route.params.id :>> ', this.$route.params.id)
  },
  methods: {
    actualizarTem () {
      this.$q.loading.show({
        message: 'Actualizando Datos...'
      })
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Tema, Por Favor Espere...'
        })
        this.$api.put('test/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tema Actualizado Correctamente'
            })
            this.getCourse(this.$route.params.id)
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editTem (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    crearTem () {
      this.$q.loading.show({
        message: 'Creando Datos...'
      })
      this.$v.$touch()
      this.form.family_id = this.$route.params.id
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Tema, Por Favor Espere...'
        })
        this.$api.post('test', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tema Creado Correctamente'
            })
            this.getCourse(this.$route.params.id)
          }
        })
      }
    },
    eiminarTem (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este tema?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando Datos...'
        })
        this.$api.delete('test/' + id).then(res => {
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
    async getCourse (id) {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getExamWithTest/' + id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.course = res
          this.tests = this.course.tests
          console.log('this.course :>> ', this.course)
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
