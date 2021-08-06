<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="row justify-center">
      <img src="app movil 15.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Desafio individual</div>
      <div class="text-grey-8 text-caption q-pl-md">Escoge la materia que quieres entrenar</div>
      <div class="column items-center q-mt-md">
        <q-card v-for="(item,index) in asig" :key="index" v-ripple clickable class="q-pa-none q-mb-md" style="width: 95%; border-radius: 15px">
          <div class="row">
            <div class="col-6 q-pa-sm">
              <div class="text-h6 text-grey-9 ellipsis">{{item.name}}</div>
              <div class="text-caption text-grey-9 ellipsis-3-lines">{{'Descripcion'}}</div>
              <div class="absolute-bottom q-pa-md">
                <q-btn no-caps color="black" label="Ingresar"
                @click="$router.push('/asignatura/niveles/' + item._id)" />
              </div>
            </div>
            <div class="col-6 q-pa-none">
              <q-img :src="item.img" style="height: 170px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px" />
            </div>
          </div>
        </q-card>
      </div>
    </div>
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
