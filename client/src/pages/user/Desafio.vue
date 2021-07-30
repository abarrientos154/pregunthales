<template>
  <div>
    <q-btn class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$router.go(-1)" />
    <div class="q-py-sm row justify-center">
      <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 text-center">Desafio por puntos</div>
      <div class="text-grey-8 text-caption text-center">Escoge la modalidad del juego</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      usuarios: []
    }
  },
  mounted () {
    this.getAllUsers()
  },
  methods: {
    getAllUsers () {
      this.$api.get('all_user').then(v => {
        if (v) {
          this.usuarios = v
          console.log(this.usuarios)
        }
      })
    }
  }
}
</script>
