<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="row justify-center">
      <img src="app movil 4.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Desafios</div>
      <div class="text-grey-8 text-caption q-pl-md">Desafios a los que has sido convocado</div>
      <div v-if="desafiado.length > 0" class="column items-center q-mt-md">
        <q-card v-for="(item,index) in desafiado" :key="index" v-ripple class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px"
        @click="item.status2 === 0 ? $router.push('/desafio/' + item._id) : item.ganador !== 0 ? selecDesafio(item) : ''">
          <q-img :src="baseuNivel + item.nivel_id" style="height: 100px; width: 100%; border-top-right-radius: 15px; border-top-left-radius: 15px" />
          <div class="absolute-top-right">
              <q-chip :color="item.status2 === 0 ? 'blue' : item.status2 === 1 ? 'positive' : item.status2 === 2 ? 'primary' : 'negative'" text-color="white">
                {{item.status2 === 0 ? 'Pendiente' : item.status2 === 1 ? 'Aceptado' : item.status2 === 2 ? 'Completado' : 'Rechazado'}}
              </q-chip>
          </div>
          <div class="row q-pa-sm">
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.creadorInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.creadorInfo.name}}</div>
              <div class="text-grey-8">Ranking: {{item.creadorInfo.points}}</div>
              <div v-if="item.status1 === 2" class="text-grey-8">Puntuación: {{item.total_point1}}</div>
            </div>
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.desafiadoInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.desafiadoInfo.name}}</div>
              <div class="text-grey-8">Ranking: {{item.desafiadoInfo.points}}</div>
              <div v-if="item.status2 === 2" class="text-grey-8">Puntuación: {{item.total_point2}}</div>
            </div>
          </div>
          <div class="row justify-center q-pa-md" v-if="item.status2 === 1">
            <q-btn no-caps color="black" label="Iniciar desafio" style="width: 80%"
            @click="$router.push('/nivel/' + item.nivel_id + '/' + item._id)" />
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
        @click="item.ganador !== 0 ? selecDesafio(item) : ''"
        >
          <q-img :src="baseuNivel + item.nivel_id" style="height: 100px; width: 100%; border-top-right-radius: 15px; border-top-left-radius: 15px" />
          <div class="absolute-top-right">
              <q-chip :color="item.status1 === 0 ? 'blue' : item.status1 === 1 ? 'positive' : item.status1 === 2 ? 'primary' : 'negative'" text-color="white">
                {{item.status1 === 0 ? 'Pendiente' : item.status1 === 1 ? 'Aceptado' : item.status1 === 2 ? 'Completado' : 'Rechazado'}}
              </q-chip>
          </div>
          <div class="row q-pa-sm">
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.creadorInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.creadorInfo.name}}</div>
              <div class="text-grey-8">Ranking: {{item.creadorInfo.points}}</div>
              <div v-if="item.status1 === 2" class="text-grey-8">Puntuación: {{item.total_point1}}</div>
            </div>
            <div class="col-6 column items-center">
              <div>
                <q-img :src="baseuPerfil + item.desafiadoInfo._id" style="width:100px; height:100px; border-radius: 100%" />
              </div>
              <div class="text-subtitle1 text-bold text-grey-8 q-pt-sm">{{item.desafiadoInfo.name}}</div>
              <div class="text-grey-8">Ranking: {{item.desafiadoInfo.points}}</div>
              <div v-if="item.status2 === 2" class="text-grey-8">Puntuación: {{item.total_point2}}</div>
            </div>
          </div>
          <div class="row justify-center q-pa-md" v-if="item.status1 === 1">
            <q-btn no-caps color="black" label="Iniciar desafio" style="width: 80%"
            @click="$router.push('/nivel/' + item.nivel_id + '/' + item._id)" />
          </div>
        </q-card>
      </div>
      <q-card v-else class="shadow-2 q-ma-md q-pa-md">
        <div class="text-center text-subtitle1">Actualmente sin desafios...</div>
      </q-card>
    </div>

    <q-dialog v-model="verDesafio" v-if="verDesafio">
      <q-card class="q-px-sm q-py-lg" style="width:100%; border-radius: 15px">
        <div class="text-center text-h6 text-grey-8">Desafio por puntos</div>
        <div class="text-center text-caption text-grey-9 q-pb-md">Resultados del desafio</div>
        <div class="row items-center q-py-md">
          <div class="q-pr-sm">
            <q-img :src="desafio.ganador === 1 ? baseuPerfil + desafio.creador_id : baseuPerfil + desafio.desafiado_id" style="width:110px; height:110px; border-radius: 100%" />
          </div>
          <div>
            <div class="text-h5 text-grey-8 text-bold">Ganador</div>
            <div class="text-grey-9">{{desafio.ganador === 1 ? desafio.creadorInfo.name : desafio.desafiadoInfo.name}}</div>
            <div class="text-caption text-grey-8"><b>Ranking: </b>{{desafio.ganador === 1 ? desafio.creadorInfo.points : desafio.desafiadoInfo.points}}</div>
            <div class="text-caption text-grey-8"><b>Puntaje obtenido: </b>{{desafio.ganador === 1 ? desafio.total_point1 : desafio.total_point2}}</div>
          </div>
        </div>
        <div class="row items-center q-py-md q-pl-xl">
          <div class="q-pr-sm">
            <q-img :src="desafio.ganador === 2 ? baseuPerfil + desafio.creador_id : baseuPerfil + desafio.desafiado_id" style="width:90px; height:90px; border-radius: 100%" />
          </div>
          <div>
            <div class="text-h6 text-grey-8 text-bold">Perdedor</div>
            <div class="text-caption text-grey-9">{{desafio.ganador === 2 ? desafio.creadorInfo.name : desafio.desafiadoInfo.name}}</div>
            <div class="text-caption text-grey-8"><b>Ranking: </b>{{desafio.ganador === 2 ? desafio.creadorInfo.points : desafio.desafiadoInfo.points}}</div>
            <div class="text-caption text-grey-8"><b>Puntaje obtenido: </b>{{desafio.ganador === 2 ? desafio.total_point1 : desafio.total_point2}}</div>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      verDesafio: false,
      baseuNivel: '',
      baseuPerfil: '',
      desafio: {},
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
          this.$api.get('creador_desafios').then(v => {
            if (v) {
              this.creador = v
              this.$q.loading.hide()
            }
          })
        }
      })
    },
    selecDesafio (data) {
      this.desafio = data
      this.verDesafio = true
    }
  }
}
</script>
