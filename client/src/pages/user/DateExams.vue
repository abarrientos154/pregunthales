<template>
  <div>
    <q-card class="row justify-center bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Fechas de Examen</div>
      </div>
    </q-card>
    <div class="row justify-center">
      <listable style="min-width: 900px" :columns="columns" :data="data" @function="execute"/>
    </div>
  </div>
</template>
<script>
import Listable from '../../components/Listable.vue'
export default {
  components: { Listable },
  data () {
    return {
      data: null,
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
      await this.$api.get('dateExamUser').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.data = res
          console.log('res :>> ', res)
        } else {
          this.$q.loading.hide()
        }
      })
    },
    execute (emit) {
      console.log('emit :>> ', emit)
      if (emit.title === 'Comprar') {
        console.log('compras pronto')
      }
    }
  }
}
</script>
