<template>
  <div>
    <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">Fecha Examen</div>
    <q-card class="row justify-start bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Programar Nueva Fecha</div>
        <div class="row">
          <q-btn @click="newDE = true" class="text-subtitle1" padding="10px 5px" color="primary" icon="add" no-caps>Nueva</q-btn>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="newDE" @hide="reload">
      <new-date-exam @close="closeComponent" :id="dateExam_id"/>
    </q-dialog>
    <div class="row justify-center">
      <listable style="min-width: 900px" :columns="columns" :data="data" @function="execute"/>
    </div>
  </div>
</template>
<script>
import Listable from '../../components/Listable.vue'
import NewDateExam from '../../components/NewDateExam.vue'
export default {
  components: { Listable, NewDateExam },
  data () {
    return {
      load: false,
      data: null,
      dateExams: null,
      dateExam_id: '',
      newDE: false,
      columns: [
        { name: 'ccaa', label: 'CCAA', align: 'left', field: 'community_name' },
        { name: 'place', align: 'center', label: 'Lugar', field: 'place_name' },
        { name: 'date', label: 'Fecha', field: 'date' },
        { name: 'expireDate', label: 'Finaliza', field: 'expireDate' },
        { name: 'pvp', label: 'PVP€', field: 'pvp' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ]
    }
  },
  mounted () {
    this.getDateExam()
  },
  methods: {
    async getDateExam () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('dateExam').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.data = res
          console.log('res :>> ', res)
        } else {
          this.$q.loading.hide()
        }
      })
    },
    reload () {
      this.dateExam_id = ''
    },
    closeComponent (close) {
      if (close === false) {
        this.newDE = false
        this.getDateExam()
      }
    },
    destroyDateExam (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Fecha de Examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando Datos...'
        })
        this.$api.delete('destroyDateExam/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Fecha de Examen Eliminada Correctamente'
            })
            this.getDateExam()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    execute (emit) {
      console.log('emit :>> ', emit)
      if (emit.title === 'Eliminar') {
        this.destroyDateExam(emit.id)
      } else if (emit.title === 'Editar') {
        this.dateExam_id = emit.id
        this.newDE = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dimension {
  min-width: 280px;
}
.dimensionC {
  min-width: 270px;
}
</style>
