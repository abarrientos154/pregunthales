<template>
  <div>
    <div v-if="login" class="absolute-top-right text-white q-pa-sm text-right" style="z-index: 4">
      <div class="text-h6">Puntaje general</div>
      <div class="text-h5 text-bold">{{puntaje}}</div>
    </div>
    <div class="row justify-center">
      <q-img src="app movil 14.png" style="height: 280px; width: 100%" />
    </div>

    <div class="shadow-up-1 q-py-lg full-width bg-white" style="position:absolute; top:265px; padding-bottom:70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">¿Qué te gustaría hacer?</div>
      <div class="text-grey-8 text-caption q-pl-md">Escoge donde quieres jugar</div>
      <q-scroll-area horizontal class="q-mt-md" style="height: 300px; width: 100%;" :thumb-style="thumbStyle">
        <div class="row no-wrap q-px-md q-gutter-md">
          <q-card flat style="width: 160px" clickable v-ripple v-for="(item, index) in type" :key="index"
          @click="login ? $router.push(item.ruta) : !login && index !== 0 ? noLogin = true : $router.push(item.ruta)">
            <img :src="item.img" style="height: 200px; width: 100%; border-radius: 10px">
            <div class="text-h6 text-grey-8">{{item.title}}</div>
            <div class="text-caption text-grey-8">{{item.description}}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <q-page-sticky v-if="!login" position="bottom-right" :offset="[18, 18]">
      <q-btn no-caps color="accent" label="Iniciar sesión" to="/login" />
    </q-page-sticky>

    <q-dialog v-model="alertaDesafio">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6">Atención</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Tienes un desafio pendiente
        </q-card-section>

        <q-card-actions align="right">
          <q-btn no-caps label="Ver desafio" color="accent" @click="$router.push('/desafio/' + idDesafio)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="noLogin">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6 text-center">Atención</div>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          Te invitamos a registrarte para seguir disfrutanto de nuestra aplicación
        </q-card-section>

        <q-card-actions align="center" class="column">
          <q-btn no-caps label="¡Registrarme ahora!" color="accent" to="/registro" />
          <q-btn no-caps flat label="Ya tengo una cuenta" color="primary" to="/login" />
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
      noLogin: false,
      login: false,
      idDesafio: '',
      puntaje: 0,
      thumbStyle: {
        right: '5px',
        borderRadius: '50px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
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
        },
        {
          img: 'app movil 7.png',
          title: 'Examenes',
          description: 'Prueba tu entrenamiento en las diferentes materias',
          ruta: '/examenes'
        }
      ]
    }
  },
  mounted () {
    const value = localStorage.getItem('SESSION_INFO')
    if (value) {
      this.login = true
      this.getDesafio()
      this.getPuntaje()
    }
  },
  methods: {
    async getDesafio () {
      await this.$api.get('desafio').then(res => {
        if (res) {
          this.alertaDesafio = true
          this.idDesafio = res._id
        }
      })
    },
    getPuntaje () {
      this.$api.get('user_info').then(res => {
        if (res) {
          this.puntaje = res.points
        }
      })
    }
  }
}
</script>
