<template>
  <div>
    <div class="row justify-center">
      <q-img src="app movil 14.png" style="height: 280px; width: 100%" />
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">¿Qué te gustaría hacer?</div>
      <div class="text-grey-8 text-caption q-pl-md">Escoge donde quieres jugar</div>
      <q-scroll-area horizontal class="q-mt-md" style="height: 300px; width: 100%;">
        <div class="row no-wrap q-px-md q-gutter-md">
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
          Tienes un desafio pendiente
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
          img: 'app movil 24.png',
          title: 'Jugar solo',
          description: 'Compite contigo mismo y entrena para obtener mejores resultados',
          ruta: '/asignaturas'
        },
        {
          img: 'app movil 25.png',
          title: 'Reta a un amigo',
          description: 'Compite contra un amigo y pon a prueba tu entrenamiento',
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
