<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder">Bienvenido!</div>
    <div class="text-black text-h6 q-mb-lg">Asignaturas</div>
    <q-list class="column items-center" style="width: 100%">
      <q-card v-for="(item,index) in asig" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 400px">
        <q-item>
          <q-item-section @click="$router.push('/tests-courses/' + item._id)">
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
        </q-item>
      </q-card>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item: 0,
      asig: []
    }
  },
  mounted () {
    this.getAsignaturas()
  },
  methods: {
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
