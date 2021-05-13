<template>
  <div>
    <q-card class="row justify-center bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">Preguntas</div>
      </div>
    </q-card>
    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column dimension">
          <q-list bordered class="rounded-borders q-ma-md q-pa-md">
            <div class="text-h6 text-primary">Asignaciones:</div>
            <q-expansion-item
              v-for="(item, index) in data"
              :key="index"
              expand-separator
              icon="menu_book"
              :label="item.name"
            >
              <q-card>
                <q-card-section>
                  <q-list bordered class="rounded-borders q-ma-md q-pa-md">
                    <div class="text-h6 text-primary">Temas:</div>
                    <q-expansion-item
                      v-for="(item2, index) in item.tests"
                      :key="index"
                      expand-separator
                      icon="source"
                      :label="item2.title"
                    >
                      <q-card>
                        <q-card-section>
                          <q-list bordered class="rounded-borders q-ma-md q-pa-md">
                            <div class="text-h6 text-primary">Preguntas:</div>
                            <div class="text-subtitle1 q-ml-sm" v-for="(item3, index) in item2.questions" :key="index">{{index + 1}} - {{item3.question}}
                              <q-checkbox v-model="item3.isActive" @input="questSelected(item3)"/>
                              <div v-for="(item4, index) in item3.answers" :key="index">
                                <q-item class="text-subtitle1">{{item4.titleAnswer}}</q-item>
                              </div>
                            </div>
                          </q-list>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div class="row justify-center q-mb-md">
            <q-btn icon="add_circle" color="primary" @click="save()" label="Guardar"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Questions',
  props: ['id'],
  data () {
    return {
      data: null,
      send: []
    }
  },
  mounted () {
    this.getQuestions()
  },
  methods: {
    async getQuestions () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getFullQuestions/').then(res => {
        if (res) {
          this.$q.loading.hide()
          this.data = res
          console.log('this.data >> ', this.data)
        }
      })
    },
    questSelected (quest, ind) {
      if (quest.isActive === true) {
        this.send.push(quest)
      }
      console.log('quest, ind :>> ', quest, this.send)
    },
    save () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      for (const i in this.send) {
        if (this.send[i].isActive === false) {
          this.send.splice(i, 1)
        }
      }
      this.$api.put('multiplesQuestions', {
        multiple: this.send,
        id: this.id
      }).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dimension {
  min-width: 300px;
}
</style>
