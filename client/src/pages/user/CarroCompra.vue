<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="row justify-center">
      <img src="app movil 10.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top: 265px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Mi carro de compra</div>
      <div v-if="puntos" class="text-grey-8 text-caption q-pl-md">Aquí podrás adquirir los puntos que necesites</div>
      <div v-if="membresia" class="text-grey-8 text-caption q-pl-md">Obtendrás puntos diarios ilimitados en modos de juego solitario y jugador vs jugador</div>

        <div v-if="puntos">
          <q-card clickable v-ripple flat class="row items-start q-px-sm q-mt-md q-py-md" style="width:100%"
          @click="puntosSelec = 1, verFacturaPuntos = true">
            <div>
                <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
            </div>
            <div class="col q-pl-md">
                <div class="text-grey-8 text-h5">1000 puntos</div>
                <div class="text-grey-8 text-caption">Selecciona para obtener 1000 puntos</div>
                <div class="text-grey-8 text-h6"><b>Costo </b>$0,99</div>
            </div>
          </q-card>
          <q-card clickable v-ripple flat class="row items-start q-px-sm q-mt-md q-py-md" style="width:100%"
          @click="puntosSelec = 2, verFacturaPuntos = true">
            <div>
                <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
            </div>
            <div class="col q-pl-md">
                <div class="text-grey-8 text-h5">2000 puntos</div>
                <div class="text-grey-8 text-caption">Selecciona para obtener 2000 puntos</div>
                <div class="text-grey-8 text-h6"><b>Costo </b>$1,5</div>
            </div>
          </q-card>
        </div>

        <q-card v-if="membresia" flat clickable v-ripple class="row items-start q-px-sm q-mt-md q-py-md" style="width:100%"
        @click="user.membresia ? verDialog() : verFacturaMembresia = true">
          <div>
              <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
          </div>
          <div class="col q-pl-md">
              <div class="text-grey-8 text-h5">Membresia</div>
              <div class="text-grey-8 text-caption">Podrás entrenar y desafiar cuanto quieras</div>
              <div class="text-grey-8 text-h6"><b>Costo </b>$5</div>
          </div>
        </q-card>

      <q-dialog v-model="verFacturaPuntos">
        <q-card class="q-pa-md" style="width:100%; border-radius:15px">
          <div class="text-h6">Paquete de puntos</div>
          <div class="row items-start q-mt-md q-py-md">
            <div>
                <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
            </div>
            <div class="col q-pl-md">
                <div class="text-grey-8 text-h5">{{puntosSelec === 1 ? 1000 : 2000}} puntos</div>
                <div class="text-grey-8 text-caption">Obtendras {{puntosSelec === 1 ? 1000 : 2000}} puntos en tu ranking</div>
                <div class="text-grey-8 text-h6"><b>Costo </b>${{puntosSelec === 1 ? 0.99 : 1.5}}</div>
            </div>
          </div>
          <div class="row justify-center q-pt-xl">
            <paypal @pagoProcesado="comprarPuntos" :total="puntosSelec === 1 ? 0.99 : 1.5" :descripcion="'Puntos'" style="width:100%" />
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="verFacturaMembresia">
        <q-card class="q-pa-md" style="width:100%; border-radius:15px">
          <div class="text-h6">Adquirir membresia</div>
          <div class="row items-start q-mt-md q-py-md">
            <div>
                <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
            </div>
            <div class="col q-pl-md">
                <div class="text-grey-8 text-h5">Membresia</div>
                <div class="text-grey-8 text-caption">Podrás entrenar y desafiar cuanto quieras</div>
                <div class="text-grey-8 text-h6"><b>Costo </b>$5</div>
            </div>
          </div>
          <div class="row justify-center q-pt-xl">
            <paypal @pagoProcesado="comprarMembresia" :total="5" :descripcion="'Membresia'" style="width:100%" />
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="compraExitosa" persistent maximized>
          <q-card style="width:100%;">
            <img src="app movil 11.png" style="width:100%; height: 100%;" />
            <div class="absolute-bottom q-pb-md column items-center" style="width: 100%">
                <div class="q-pb-xl text-h5 text-center">Tu compra se realizó <br> con <b>Éxito</b></div>
                <q-btn no-caps color="black" label="Volver" style="width: 90%" @click="$router.go(-1)" />
            </div>
          </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import Paypal from '../../components/Paypal.vue'
export default {
  components: { Paypal },
  data () {
    return {
      paypalPuntos: false,
      paypalMembresia: false,
      puntos: false,
      membresia: false,
      verFacturaMembresia: false,
      verFacturaPuntos: false,
      compraExitosa: false,
      puntosSelec: 0,
      user: {},
      data: []
    }
  },
  mounted () {
    if (this.$route.params.compra === 'puntos') {
      this.puntos = true
    } else {
      this.membresia = true
    }
    this.getUser()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    async comprarPuntos () {
      this.$q.loading.show({
        message: 'Adquiriendo puntos...'
      })
      await this.$api.post('comprar_puntos', { puntos: this.puntosSelec === 1 ? 1000 : 2000, costo: this.puntosSelec === 1 ? 0.99 : 1.5 }).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.compraExitosa = true
        }
      })
    },
    async comprarMembresia () {
      this.$q.loading.show({
        message: 'Adquiriendo membresia...'
      })
      await this.$api.post('comprar_membresia').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.compraExitosa = true
          this.verFacturaMembresia = false
        }
      })
    },
    verDialog () {
      this.$q.dialog({
        title: 'Atención',
        message: 'Ya posees tu membresia, no es necesario que adquieras otra',
        cancel: false,
        persistent: false
      }).onOk(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
