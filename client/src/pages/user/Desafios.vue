<template>
  <div>
    <q-btn class="absolute-top" round flat color="grey-9" icon="arrow_back" @click="$router.go(-1)" />
    <div class="q-py-sm row justify-center">
      <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Desafios</div>
      <div class="text-grey-8 text-caption q-pl-md">Desafios a los que has sido convocado</div>
      <div v-if="desafiado.length > 0" class="column items-center q-mt-md">
        <q-card v-for="(item,index) in desafiado" :key="index" v-ripple class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px"
        @click="$router.push('/desafio/' + item._id)">
          <q-img :src="baseuNivel + item.nivel_id" style="height: 100px; width: 100%; border-top-right-radius: 15px; border-top-left-radius: 15px" />
          <div class="absolute-top-right">
              <q-chip :color="item.status === 0 ? 'blue' : item.status === 1 ? 'positive' : item.status === 2 ? 'primary' : 'negative'" text-color="white">
                {{item.status === 0 ? 'Pendiente' : item.status === 1 ? 'Aceptado' : item.status === 2 ? 'Completado' : 'Rechazado'}}
              </q-chip>
          </div>
          <div class="row q-pa-sm">
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.creadorInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.creadorInfo.name}}</div>
              <div class="text-grey-8">Puntuació: {{item.creadorInfo.points}}</div>
            </div>
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.desafiadoInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.desafiadoInfo.name}}</div>
              <div class="text-grey-8">Puntuació: {{item.desafiadoInfo.points}}</div>
            </div>
          </div>
        </q-card>
      </div>
      <q-card v-else class="shadow-2 q-ma-md q-pa-md">
        <div class="text-center text-subtitle1">Actualmente sin desafios...</div>
      </q-card>

      <div class="text-grey-8 text-h6 q-pl-md">Mis desafios</div>
      <div class="text-grey-8 text-caption q-pl-md">Desafios que has creado</div>
      <div v-if="creador.length > 0" class="column items-center q-mt-md">
        <q-card v-for="(item,index) in creador" :key="index" v-ripple class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px"
        >
          <q-img :src="baseuNivel + item.nivel_id" style="height: 100px; width: 100%; border-top-right-radius: 15px; border-top-left-radius: 15px" />
          <div class="absolute-top-right">
              <q-chip :color="item.status === 0 ? 'blue' : item.status === 1 ? 'positive' : item.status === 2 ? 'primary' : 'negative'" text-color="white">
                {{item.status === 0 ? 'Pendiente' : item.status === 1 ? 'Aceptado' : item.status === 2 ? 'Completado' : 'Rechazado'}}
              </q-chip>
          </div>
          <div class="row q-pa-sm">
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.creadorInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.creadorInfo.name}}</div>
              <div class="text-grey-8">Puntuació: {{item.creadorInfo.points}}</div>
            </div>
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.desafiadoInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.desafiadoInfo.name}}</div>
              <div class="text-grey-8">Puntuació: {{item.desafiadoInfo.points}}</div>
            </div>
          </div>
        </q-card>
      </div>
      <q-card v-else class="shadow-2 q-ma-md q-pa-md">
        <div class="text-center text-subtitle1">Actualmente sin desafios...</div>
      </q-card>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      baseuNivel: '',
      baseuPerfil: '',
      desafiado: [],
      creador: []
    }
  },
  mounted () {
    this.baseuNivel = env.apiUrl + 'nivel_img/'
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getDesafios()
  },
  methods: {
    getDesafios () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      this.$api.get('desafiado_desafios').then(res => {
        if (res) {
          this.desafiado = res
          console.log(res)
          this.$api.get('creador_desafios').then(v => {
            if (v) {
              this.creador = v
              console.log(v)
              this.$q.loading.hide()
            }
          })
        }
      })
    }
  }
}
</script>
