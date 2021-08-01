<template>
  <div>
    <div class="q-py-sm row justify-center">
      <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    </div>

    <div class="shadow-up-1 q-py-lg q-pl-md" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6">¿Qué te gustaría hacer?</div>
      <div class="text-grey-8 text-caption">Escoge donde quieres jugar</div>
      <q-scroll-area class="q-mt-md" style="height: 300px; width: 100%;">
        <div class="row no-wrap q-gutter-md">
          <q-card flat style="width: 160px" clickable v-ripple v-for="(item, index) in type" :key="index"
          @click="$router.push(item.ruta)">
            <img :src="item.img" style="height: 200px; width: 100%; border-radius: 10px">
            <div class="text-h6 text-grey-8">{{item.title}}</div>
            <div class="text-caption text-grey-8">{{item.description}}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <q-dialog v-model="alertaDesafio">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6">Atención</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Te están desafiando
        </q-card-section>

        <q-card-actions align="right">
          <q-btn no-caps label="Ver desafio" color="primary" @click="$router.push('/desafio/' + idDesafio)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      alertaDesafio: false,
      idDesafio: '',
      type: [
        {
          img: 'noimg.png',
          title: 'Jugar solo',
          description: 'Compite contigo mismo y entrena para obtener mejores resultados',
          ruta: '/asignaturas'
        },
        {
          img: 'noimg.png',
          title: 'Reta a un amigo',
          description: 'Compite contra un amigo',
          ruta: '/desafio'
        }
      ]
    }
  },
  mounted () {
    this.getDesafio()
  },
  methods: {
    async getDesafio () {
      await this.$api.get('desafio').then(res => {
        if (res) {
          this.alertaDesafio = true
          this.idDesafio = res._id
        }
      })
    }
  }
}
</script>
