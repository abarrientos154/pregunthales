<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated class="bg-white">
        <q-toolbar>
          <q-btn flat dense round color="primary" icon="menu" aria-label="Menu" @click="DrawerOpen = !DrawerOpen"/>

          <q-toolbar-title class="row">
            <img src="logo-pregunthales.jpg" style="width: 50px; height: 50px">
            <div class="text-bold text-primary column justify-center q-pl-sm">Pregunthales</div>
          </q-toolbar-title>

          <div v-if="rol == 2" class="text-black">{{ultimaConeccion == {} ? user.ultima_coneccion.fecha : ultimaConeccion.fecha}}</div>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="DrawerOpen" bordered>
        <q-list>
          <q-item-label header class="column items-center">
            <img src="logo-pregunthales.jpg" style="height: 280px; max-width: 280px">
          </q-item-label>
          <template v-for="(item, index) in menu">
            <q-item :key="index" clickable v-ripple @click="item.label === 'Cerrar Sesión' ? cerrarSesion() : item.label === 'Datos Masivos' ? uploadData() : rutas(item)">
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>
                  {{ item.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" />
          </template>
        </q-list>
      </q-drawer>

      <q-dialog v-model="up">
        <big-data @file="getFile"></big-data>
      </q-dialog>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import BigData from '../components/BigData.vue'
import { mapMutations } from 'vuex'
export default {
  components: { BigData },
  name: 'MainLayout',
  data () {
    return {
      up: false,
      hoy: new Date(),
      fecha: '',
      hora: '',
      rol: null,
      user: {},
      ultimaConeccion: {},
      DrawerOpen: false,
      menu: [],
      menuAdmin: [
        {
          icon: 'menu_book',
          label: 'Asignaturas',
          ruta: '/inicio_administrador'
        },
        {
          icon: 'article',
          label: 'Usuarios',
          ruta: ''
        },
        {
          icon: 'logout',
          label: 'Cerrar Sesión',
          ruta: ''
        }
      ],
      menuUser: [
        {
          icon: 'home',
          label: 'Inicio',
          ruta: '/inicio'
        },
        {
          icon: 'menu_book',
          label: 'Asignaturas',
          ruta: '/courses'
        },
        {
          icon: 'article',
          label: 'Examenes',
          ruta: '/exams'
        },
        {
          icon: 'event',
          label: 'Fecha Examen',
          ruta: '/date_exams_users'
        },
        {
          icon: 'logout',
          label: 'Cerrar Sesión',
          ruta: ''
        }
      ]
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    cerrarSesion () {
      this.$q.loading.show({
        message: 'Cerrando Sesión...'
      })
      this.$api.put('updateUser/' + this.user._id, this.user).then((res) => {
        if (res) {
          this.$q.loading.hide()
          this.logout()
          this.$router.push('/login')
        }
      })
    },
    uploadData () {
      this.up = true
    },
    getFile (f) {
      if (f === false) {
        this.up = false
      }
    },
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.rol = v.roles[0]
          // this.ultimaConeccion = v.ultima_coneccion
          this.user = v
          if (this.rol === 1) {
            this.menu = this.menuAdmin
          } else if (this.rol === 2) {
            this.menu = this.menuUser
          }
        }
      })
    },
    rutas (itm) {
      this.$router.push(itm.ruta)
    }
  }
}
</script>
