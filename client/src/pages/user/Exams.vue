<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h3 text-weight-bolder q-mb-lg">Examenes</div>
    <q-list class="column items-center" style="width: 100%" v-if="examenes.length > 0">
      <q-card v-for="(item,index) in examenes" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 450px">
        <q-item>
          <q-item-section @click="$router.push('/tests_exams/' + item._id)">
            <q-item>
              <q-item-section avatar>
                <q-icon name="grading" size="30px"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.name}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin Examenes...</div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item: 0,
      examenes: []
    }
  },
  mounted () {
    this.getExam()
  },
  methods: {
    getExam () {
      this.$api.get('examen').then(res => {
        if (res) {
          this.examenes = res
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
