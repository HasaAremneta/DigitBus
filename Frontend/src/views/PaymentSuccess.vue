<template>
    <div class="payment-success">
        <div class="success-icon">
            <i class="pi pi-check-circle" style="font-size: 18vh; color: green;"></i>
        </div>
        <h1>¡Pago exitoso!</h1>
        <p>Gracias por tu compra. Tu pago ha sido procesado correctamente.</p>
        
    </div>
</template>

<script>
export default {
    name: 'PaymentSuccess'
}
</script>

<style scoped>
.payment-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
}
.success-icon {
    margin-bottom: 34px;
}
h1 {
    color: #4CAF50;
    margin-bottom: 12px;
}

</style>