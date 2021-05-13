<template>
  <div class="absolute-center column items-center">
    <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    <!-- <div class="text-primary text-h4 q-mb-lg">2007 - 2021</div> -->
    <q-input rounded dense outlined class="q-mb-lg" type="email" v-model="form.email" label="User/Email" style="width: 300px" :error="$v.form.email.$error" error-message="Este campo es requerido"  @blur="$v.form.email.$touch()">
      <template v-slot:prepend>
        <q-icon name="person" color="primary"/>
      </template>
    </q-input>
    <q-input rounded dense outlined class="q-mb-sm" :type="isPwd ? 'password' : 'text'" v-model="form.password" label="Contraseña" style="width: 300px" :error="$v.form.password.$error" error-message="Este campo es requerido"  @blur="$v.form.password.$touch()">
      <template v-slot:prepend>
        <q-icon name="https" color="primary"/>
      </template>
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
      </template>
    </q-input>
    <div class="row">
      <div class="text-black text-h9">Has olvidado tu contraseña?</div>
      <div class="text-primary q-ml-sm text-bold text-h9">Recuperar.</div>
    </div>
    <div class="row">
      <div class="text-black text-h9">Aún no tienes cuenta?</div>
      <div class="text-primary q-ml-sm text-bold text-h9" @click="$router.push('/registro')">Registrar.</div>
    </div>
    <div class="q-my-md row justify-center">
      <q-btn rounded color="primary" text-color="white" label="Iniciar Sesión" :loading="loading" @click="loguear()" no-caps>
        <template v-slot:loading>
          <q-spinner-hourglass class="on-center" />
          Iniciando...
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      isPwd: true,
      form: {},
      user: {}
    }
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    ...mapActions('generals', ['saveUser']),
    loguear () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.loading = true
        this.$q.loading.show({
          message: 'Iniciando sesión'
        })
        this.$api.post('login', this.form).then(res => {
          if (res) {
            this.user = res.SESSION_INFO
            console.log('user', this.user)
            this.login(res)
            if (this.user.roles[0] === 1) {
              this.$router.push('/inicio_administrador')
            } else {
              this.$router.push('/home')
            }
          } else {
            console.log('error de ususario')
            this.loading = false
            this.$q.loading.hide()
          }
          this.$q.loading.hide()
          this.loading = false
        })
      }
    }
  }
}
</script>
