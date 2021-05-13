<template>
  <div class="column items-center justify-center">
    <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px" class="q-mt-lg">
    <!-- <div class="text-primary text-h4 q-mb-sm">2007 - 2021</div> -->
    <div class="text-primary text-h6 q-mb-lg text-weight-bolder">Registro</div>

    <div class="row" style="width: 70%; min-width: 300px">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.name" label="Nombre" error-message="Ingrese un nombre válido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()">
          <template v-slot:prepend>
            <q-icon name="person" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.last_name" label="Apellido" error-message="Ingrese un apellido válido" :error="$v.form.last_name.$error" @blur="$v.form.last_name.$touch()">
          <template v-slot:prepend>
            <q-icon name="supervisor_account" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="email" v-model="form.email" label="Email" :error="$v.form.email.$error" error-message="Ingrese un email válido"  @blur="$v.form.email.$touch()">
          <template v-slot:prepend>
            <q-icon name="email" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" :type="isPwd ? 'text' : 'password'" v-model="password" label="Contraseña" error-message="Ingrese una contraseña válida, mínimo 6 caracteres" :error="$v.password.$error" @blur="$v.password.$touch()">
          <template v-slot:prepend>
            <q-icon name="https" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" :type="isPwd ? 'text' : 'password'" v-model="repeatPassword" label="Repita contraseña" error-message="Las contraseñas deben ser iguales" :error="$v.repeatPassword.$error" @blur="$v.repeatPassword.$touch()">
          <template v-slot:prepend>
            <q-icon name="https" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.nif_nie" label="NIF/NIE" error-message="Ingrese un NIF o NIE válido" :error="$v.form.nif_nie.$error" @blur="$v.form.nif_nie.$touch()">
          <template v-slot:prepend>
            <q-icon name="payment" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.phone" label="Numero de telefono" error-message="Ingrese un Nº telefónico válido" :error="$v.form.phone.$error" @blur="$v.form.phone.$touch()">
          <template v-slot:prepend>
            <q-icon name="phone" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.cp" label="C.P" error-message="Ingrese un C.P válido" :error="$v.form.cp.$error" @blur="$v.form.cp.$touch()">
          <!-- <template v-slot:prepend>
            <q-icon name="person" color="primary"/>
          </template> -->
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <!-- <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.pais" label="País" error-message="Ingrese un país válido" :error="$v.form.pais.$error" @blur="$v.form.pais.$touch()">
          <template v-slot:prepend>
            <q-icon name="person" color="primary"/>
          </template>
        </q-input> -->
        <q-select rounded outlined dense class="q-mb-sm" label="País" v-model="form.pais" :options="['España']" error-message="Seleccione un país" :error="$v.form.pais.$error" @blur="$v.form.pais.$touch()">
          <template v-slot:prepend>
            <q-icon name="public" color="primary"/>
          </template>
        </q-select>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.provincia" label="Provincia" error-message="Ingrese una provincia válida" :error="$v.form.provincia.$error" @blur="$v.form.provincia.$touch()">
          <template v-slot:prepend>
            <q-icon name="location_city" color="primary"/>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-px-sm">
        <q-input rounded dense outlined class="q-mb-sm" type="text" v-model="form.poblacion" label="Población" error-message="Ingrese una población válida" :error="$v.form.poblacion.$error" @blur="$v.form.poblacion.$touch()">
          <template v-slot:prepend>
            <q-icon name="person_pin_circle" color="primary"/>
          </template>
        </q-input>
      </div>
    </div>

    <q-checkbox v-model="isPwd" size="xs" label="Mostrar contraseña." />

    <q-checkbox v-model="terminos" size="xs" label="Acepta Terminos y condiciones de uso?" />
    <div class="text-negative text-h7" v-if="!terminos && aparecer"> Debe Aceptar los terminos </div>

    <div class="row">
      <div class="text-black text-h9">Ya tiene cuenta?</div>
      <div class="text-primary q-ml-sm text-bold text-h9" @click="$router.push('/login')">Iniciar sesion.</div>
    </div>

    <div class="column items-center justify-center q-my-md">
      <q-btn rounded color="primary" text-color="white" label="Registrar" :loading="loading" @click="registrarse()" no-caps>
        <template v-slot:loading>
          <q-spinner-hourglass class="on-center" />
          Registrando...
        </template>
      </q-btn>
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
      terminos: false,
      aparecer: false,
      repeatPassword: '',
      password: '',
      rol: 2,
      form: {}
    }
  },
  validations: {
    form: {
      name: { required, maxLength: maxLength(20), minLength: minLength(2) },
      last_name: { required, maxLength: maxLength(20), minLength: minLength(2) },
      email: { required, email },
      roles: { required },
      nif_nie: { required },
      phone: { required },
      cp: { required },
      pais: { required },
      provincia: { required },
      poblacion: { required }
    },
    repeatPassword: { sameAsPassword: sameAs('password') },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    async registrarse () {
      this.$v.$touch()
      this.form.roles = this.rol
      console.log(this.$v.form.$error, this.$v.password.$error, this.$v.repeatPassword.$error, this.terminos)
      if (!this.$v.form.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error && this.terminos) {
        this.form.password = this.password
        console.log(this.form, 'form')
        await this.$api.post('register', this.form).then(res => {
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
        this.aparecer = true
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
    }
  }
}
</script>

<style>
</style>
