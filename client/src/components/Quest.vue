<template>
  <div>
    <q-card class="column q-pa-md">
      <div v-if="edit" class="text-h6">Editar Pregunta</div>
      <div v-else class="text-h6">Crear Nueva Pregunta</div>
      <div class="q-my-sm">
        <q-input outlined v-model="quest.question" label="Introduzca la pregunta:" dense :error="$v.quest.question.$error" error-message="Este campo es requerido"  @blur="$v.quest.question.$touch()"/>
      </div>
      <div class="text-subtitle-1">Opciones:</div>
      <div class="row q-mb-sm">
        <q-input class="q-mr-md" outlined v-model="answers.optionA" label="Opción A:" dense :error="$v.answers.optionA.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionA.$touch()"/>
        <q-input outlined v-model="answers.optionB" label="Opción B:" dense :error="$v.answers.optionB.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionB.$touch()"/>
      </div>
      <div class="row q-mb-sm">
        <q-input class="q-mr-md" outlined v-model="answers.optionC" label="Opción C:" dense :error="$v.answers.optionC.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionC.$touch()"/>
        <q-input outlined v-model="answers.optionD" label="Opción D:" dense :error="$v.answers.optionD.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionD.$touch()"/>
      </div>
      <q-btn icon="add_circle" color="primary" @click="edit ?update() : save()" :label="edit ? 'Actualizar' : 'Guardar'"/>
    </q-card>
  </div>
</template>
<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Quest',
  props: ['id', 'index', 'test_id'],
  data () {
    return {
      quest: {},
      answers: {},
      edit: false
    }
  },
  validations: {
    quest: {
      question: { required, minLength: minLength(12), maxLength: maxLength(250) }
    },
    answers: {
      optionA: { required, minLength: minLength(1), maxLength: maxLength(150) },
      optionB: { required, minLength: minLength(1), maxLength: maxLength(150) },
      optionC: { required, minLength: minLength(1), maxLength: maxLength(150) },
      optionD: { required, minLength: minLength(1), maxLength: maxLength(150) }
    }
  },
  mounted () {
    this.getQuestById()
    console.log('this.index :>> ', this.index)
    console.log('this.test_id >> ', this.test_id)
  },
  methods: {
    async getQuestById () {
      if (this.id !== '') {
        this.$q.loading.show({
          message: 'Cargando Datos...'
        })
        console.log('this.id :>> ', this.id)
        this.edit = true
        await this.$api.get('questById/' + this.id).then(res => {
          if (res) {
            this.$q.loading.hide()
            console.log('res :>> ', res)
            this.quest = res
            this.answers.optionA = this.quest.answers[0].titleAnswer
            this.answers.optionB = this.quest.answers[1].titleAnswer
            this.answers.optionC = this.quest.answers[2].titleAnswer
            this.answers.optionD = this.quest.answers[3].titleAnswer
          }
        })
      }
    },
    async save () {
      this.$q.loading.show({
        message: 'Creando Datos...'
      })
      this.$v.$touch()
      if (!this.$v.quest.$error && !this.$v.answers.$error) {
        this.quest.test_id = this.test_id
        this.quest.question_number = this.index
        await this.$api.post('newQuest', {
          quest: this.quest,
          answers: this.answers
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Pregunta Creada Correctamente',
              color: 'positive'
            })
            this.$emit('question', false)
          }
        })
      }
    },
    async update () {
      this.$q.loading.show({
        message: 'Actualizando Datos...'
      })
      this.$v.$touch()
      if (!this.$v.quest.$error && !this.$v.answers.$error) {
        this.quest.question_number = this.index
        await this.$api.put('updateQuest/' + this.id, {
          quest: this.quest,
          answers: this.answers
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Pregunta Editada Correctamente',
              color: 'positive'
            })
            this.$emit('question', false)
          }
        })
      }
    }
  }
}
</script>
