<template>
  <div>
    <div class="q-pt-lg q-pb-sm row justify-center">
      <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
    </div>
    <div class="absolute-top">
      <q-btn round flat icon="arrow_back" @click="$router.go(-1)" />
    </div>

    <div class="shadow-up-1 column items-center justify-center" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-primary text-h6 q-py-md">Registro de usuario</div>
      <div class="row justify-center">
        <q-avatar size="150px" class="bg-grey-5">
          <q-img :src="perfile ? imgPerfil : ''" style="width: 100%; height: 100%">
            <q-file class="absolute-center" borderless v-model="perfile" @input="changeProfile()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px">
              <div class="absolute-center column items-center q-mt-xl full-width">
                <q-icon name="cloud_upload" size="50px" color="grey-9" />
              <div :class="$v.perfile.$error ? 'text-negative' : 'text-grey-9'" style="font-size: 15px">Selecciona avatar</div>
              </div>
            </q-file>
          </q-img>
        </q-avatar>
      </div>

      <div class="row" style="width: 70%; min-width: 300px">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
          <div class="text-grey-8">Nombre de usuario</div>
          <q-input dense outlined type="text" v-model="form.name" placeholder="Ingresa un nombre" error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()">
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
          <div class="text-grey-8">Ingresa correo</div>
          <q-input dense outlined type="email" v-model="form.email" placeholder="micorreo@pregunthales.com" :error="$v.form.email.$error" error-message="Ingrese un email válido"  @blur="$v.form.email.$touch()">
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
          <div class="text-grey-8">Contraseña</div>
          <q-input dense outlined :type="isPwd ? 'text' : 'password'" v-model="password" placeholder="Ingresa una contraseña" error-message="Ingrese una contraseña válida, mínimo 6 caracteres" :error="$v.password.$error" @blur="$v.password.$touch()">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
          <div class="text-grey-8">Repita contraseña</div>
          <q-input dense outlined :type="isPwd ? 'text' : 'password'" v-model="repeatPassword" placeholder="Repita contraseña" error-message="Las contraseñas deben ser iguales" :error="$v.repeatPassword.$error" @blur="$v.repeatPassword.$touch()">
          </q-input>
        </div>
      </div>

      <div class="column items-center justify-center q-my-md" style="width: 70%">
        <q-btn color="black" text-color="white" label="Registrar" :loading="loading" @click="registrarse()" no-caps class="q-py-xs" style="width:100%">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            Registrando...
          </template>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { required, maxLength, email, sameAs, minLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      isPwd: false,
      loading: false,
      perfile: null,
      repeatPassword: '',
      password: '',
      imgPerfil: '',
      form: {}
    }
  },
  validations: {
    form: {
      name: { required, maxLength: maxLength(20), minLength: minLength(2) },
      email: { required, email }
    },
    perfile: { required },
    repeatPassword: { sameAsPassword: sameAs('password') },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    async registrarse () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.perfile.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) {
        this.form.roles = 2
        this.form.password = this.password
        const formData = new FormData()
        formData.append('files', this.perfile)
        formData.append('dat', JSON.stringify(this.form))
        await this.$api.post('register', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Ya formas parte de Pregunthales, Bienvenido',
              color: 'positive'
            })
            this.loguear()
          }
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos correspondientes',
          color: 'negative'
        })
      }
    },
    loguear () {
      this.$api.post('login', this.form).then(res => {
        if (res) {
          const usuario = res.SESSION_INFO.roles.find(value => value === 2)
          if (usuario) {
            this.login(res)
            this.$router.push('/inicio')
          }
        } else {
          console.log('error de ususario')
          // this.loading = false
        }
        this.$q.loading.hide()
      })
    },
    changeProfile () {
      if (this.perfile) { this.imgPerfil = URL.createObjectURL(this.perfile) }
    }
  }
}
</script>

<style>
</style>
