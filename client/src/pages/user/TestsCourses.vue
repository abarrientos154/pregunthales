<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h5">{{course.name}}</div>
    <div class="text-black text-subtitle1 text-weight-bolder q-mb-lg">Temas</div>
    <q-list class="column items-center" style="width: 100%" v-if="tests.length > 0">
      <q-card v-for="(item,index) in tests" :key="index" v-ripple class="q-pa-sm q-mb-md bordes" style="width: 75%; min-width: 300px; max-width: 300px">
        <q-item>
          <q-item-section @click="$router.push('/test-course/' + item._id)">
            <q-item>
              <q-item-section avatar>
                <q-icon name="source" size="30px"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-black text-weight-bolder text-h6">{{item.title}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card>
    </q-list>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin Temas...</div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      item: 0,
      course: {},
      tests: []
    }
  },
  mounted () {
    this.getCourse(this.$route.params.id)
  },
  methods: {
    async getCourse (id) {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getCourseWithTest/' + id).then(async res => {
        if (res) {
          this.$q.loading.hide()
          this.course = res
          this.tests = this.course.tests
          console.log('this.course :>> ', this.course)
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
