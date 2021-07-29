<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder">Bienvenido!</div>
    <div class="text-black text-h6 q-mb-lg">Asignaturas</div>
    <q-list class="column items-center" style="width: 100%">
      <q-card v-for="(item,index) in asig" :key="index" v-ripple clickable class="q-pa-sm q-mb-md bordes" style="width: 75%;"
      @click="$router.push('/niveles/' + item._id)" >
        <q-item>
          <q-item-section>
            <q-item>
              <q-item-section avatar>
                <img :src="item.img" style="width:50px; height:50px; border-radius: 100%"/>
              </q-item-section>
              <q-item-section class="colum">
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.name}}</q-item-label>
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
      asig: [],
      titles: []
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
      await this.$api.get('course').then(res => {
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
