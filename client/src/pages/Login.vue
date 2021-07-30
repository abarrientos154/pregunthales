<template>
  <div class="absolute-center column items-center">
    <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">

    <div class="self-start text-grey-8">Ingresa correo o nombre de usuario</div>
    <q-input dense outlined type="email" v-model="form.email" placeholder="micorreo@pregunthales.com" style="width: 300px"
    :error="$v.form.email.$error" error-message="Este campo es requerido"  @blur="$v.form.email.$touch()" />

    <div class="self-start text-grey-8">Ingresa tu contraseña</div>
    <q-input dense outlined class="q-mb-sm" :type="isPwd ? 'password' : 'text'" v-model="form.password" placeholder="Contraseña" style="width: 300px"
    :error="$v.form.password.$error" error-message="Este campo es requerido"  @blur="$v.form.password.$touch()">
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
      </template>
    </q-input>

    <div class="row">
      <div class="text-caption">¿Olvidaste tu contraseña?</div>
    </div>

    <div class="q-my-md row justify-center" style="width: 100%">
      <q-btn color="black" text-color="white" label="Ingresar" :loading="loading" @click="loguear()" no-caps class="q-py-xs" style="width: 100%">
        <template v-slot:loading>
          <q-spinner-hourglass class="on-center" />
          Ingresando...
        </template>
      </q-btn>
    </div>

    <div class="row items-center">
      <div class="text-grey-8">Soy nuevo, quiero</div>
      <div>
        <q-btn flat dense color="primary" label="REGISTRARME" @click="$router.push('/registro')" />
      </div>
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
            this.login(res)
            if (this.user.roles[0] === 1) {
              this.$router.push('/administrador')
            } else {
              this.$router.push('/inicio')
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
