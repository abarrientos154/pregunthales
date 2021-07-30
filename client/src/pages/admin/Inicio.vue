<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder">Bienvenido!</div>
    <div class="text-black text-h6 q-mb-lg">Asignaturas</div>

    <div class="column items-center q-mt-md" style="width: 100%">
      <q-card v-for="(item,index) in asig" :key="index" v-ripple clickable class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px; min-width: 300px; max-width: 500px">
        <div class="row">
          <div class="col-6 q-pa-sm">
            <div class="text-h6">{{item.name}}</div>
            <div class="text-caption">{{'Descripcion'}}</div>
            <div class="absolute-bottom q-pa-md">
              <q-btn no-caps color="black" label="Ingresar" class="q-px-md"
              @click="$router.push('/niveles/' + item._id)" />
            </div>
          </div>
          <div class="col-6 q-pa-none">
            <q-img :src="item.img" style="height: 200px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px" />
          </div>
        </div>
      </q-card>
    </div>
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
