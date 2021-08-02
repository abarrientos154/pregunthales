<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header v-if="rol !== 2" elevated class="bg-white">
        <q-toolbar>
          <q-btn flat dense round color="primary" icon="menu" aria-label="Menu" @click="DrawerOpen = !DrawerOpen"/>

          <q-toolbar-title class="row">
            <img src="logo-pregunthales.jpg" style="width: 50px; height: 50px">
            <div class="text-bold text-primary column justify-center q-pl-sm">Pregunthales</div>
          </q-toolbar-title>
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

      <q-footer elevated v-if="rol === 2">
        <div class="bg-primary shadow-2 full-width row justify-around q-py-sm" >
          <div class="row items-center" v-for="(item, index) in menu" :key="index">
            <q-btn :icon="item.icon" color="white" flat stack dense no-caps size="md" @click="item.label === 'Cerrar Sesión' ? cerrarSesion() : $router.push(item.ruta)">
              <div class="text-caption">{{item.label}}</div>
            </q-btn>
          </div>
        </div>
      </q-footer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
      rol: null,
      user: {},
      DrawerOpen: false,
      menu: [],
      menuAdmin: [
        {
          icon: 'menu_book',
          label: 'Asignaturas',
          ruta: '/administrador'
        },
        {
          icon: 'person',
          label: 'Usuarios',
          ruta: '/usuarios'
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
          icon: 'store',
          label: 'Tienda',
          ruta: '/tienda'
        },
        {
          icon: 'circle_notifications',
          label: 'Desafios',
          ruta: '/desafios'
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
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.rol = v.roles[0]
          this.user = v
          if (this.rol === 1) {
            this.menu = this.menuAdmin
          } else if (this.rol === 2) {
            this.menu = this.menuUser
          }
        }
      })
    },
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
    rutas (itm) {
      this.$router.push(itm.ruta)
    }
  }
}
</script>
