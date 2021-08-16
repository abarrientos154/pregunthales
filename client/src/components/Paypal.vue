<template>
  <div>
    <div ref="paypal"></div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    },
    descripcion: {
      type: String
    }
  },
  data: function () {
    return {
      loaded: false
    }
  },
  mounted: function () {
    const script = document.createElement('script')
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AZTnzmmUOx5sBDPMecAspoye5M5Gdgl0udOZw3EWaHDTUv36ELbU-4E6nHZncnt-ZJJkBT7hDVV5I6a'
    script.addEventListener('load', this.setLoaded)
    document.body.appendChild(script)
  },
  methods: {
    setLoaded: function () {
      this.loaded = true
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.descripcion ? this.descripcion : 'Sin descripcion',
                  amount: {
                    currency_code: 'USD',
                    value: this.total
                  }
                }
              ]
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            this.$emit('pagoProcesado')
            console.log(order, 'orden aprobada')
          },
          onError: err => {
            console.log(err, 'ocurrio un error')
            alert(JSON.stringify(err))
          }
        }).render(this.$refs.paypal)
    }
  }
}
</script>

<style>

</style>
