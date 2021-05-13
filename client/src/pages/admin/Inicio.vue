<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder">Bienvenido!</div>
    <div class="text-black text-h6 q-mb-lg">Asignaturas</div>
    <q-list class="column items-center" style="width: 100%">
      <q-card v-for="(item,index) in asig" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 500px">
        <q-item>
          <q-item-section @click="$router.push('/tests/' + item._id)">
            <q-item>
              <q-item-section avatar>
                <q-icon name="menu_book" size="30px"/>
              </q-item-section>
              <q-item-section class="colum">
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.name}}</q-item-label>
                <div>
                  <q-chip text-color="white" :label="item.status ? 'Paga' : 'Gratuita'" :color="item.status ? 'green-14' : 'primary'" />
                </div>
              </q-item-section>
            </q-item>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round class="q-mx-sm" color="primary" icon="edit" @click="editAsig(item,index)"/>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
    <q-dialog v-model="edit" @hide="decartarCamb()">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Asignatura</div>
        </q-card-section>
        <q-card-section class="q-pt-none row">
          <div class="col">
            <q-input rounded dense outlined type="text" v-model="form.name" label="Nuevo nombre" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
              <template v-slot:prepend>
                <q-icon name="edit" color="primary"/>
              </template>
            </q-input>
            <q-select :options="titles" rounded dense outlined v-model="form.title" label="Título" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()" map-options emit-value option-value="_id" options-selected-class="text-primary" option-label="name">
            </q-select>
            <q-chip text-color="white" :label="form.status ? 'Paga' : 'Gratuita'" :color="form.status ? 'green-14' : 'primary'" />
          </div>
          <div class="col-2">
            <q-toggle
                @input="form.status != form.status"
                v-model="form.status"
                checked-icon="attach_money"
                unchecked-icon="star"
                :color="form.status ? 'green-14' : 'primary'"
                keep-color
                />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat label="Actualizar" color="primary" v-close-popup @click="actualizarAsig()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      form: {},
      item: 0,
      asig: [],
      options: [
        'Licencia de Navegación', 'Patrón de Navegación Básico, del tema 1 al 6', 'Patrón de Embarcaciones de Recreo del tema 1 al 11', 'Reducido, del tema 7 al 11', 'Patrón de Yate', 'Capitán de Yate'
      ],
      titles: []
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(35) },
      title: { required, minLength: minLength(3), maxLength: maxLength(35) }
    }
  },
  mounted () {
    this.getAsignaturas()
  },
  methods: {
    actualizarAsig () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Asignatura, Por Favor Espere...'
        })
        this.$api.put('updateAsignatura/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Asignatura Actualizada Correctamente'
            })
            this.getAsignaturas()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
    },
    editAsig (itm) {
      this.getTitles()
      const datos = { ...itm }
      this.edit = true
      this.form = datos
    },
    async getAsignaturas () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('asignatura').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.asig = res
        }
      })
    },
    async getTitles () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('titles').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.titles = res
          console.log('titles :>> ', this.titles)
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
