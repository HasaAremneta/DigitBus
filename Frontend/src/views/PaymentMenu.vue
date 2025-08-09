<template>
    <div class="payment-menu">
        <h1>Payment Menu</h1>
        <!-- Add your payment options/components here -->
        <div class="options">
            <div class="option">
                <h2>Tarjeta</h2>
            </div>
            <div class="option">
                <h2>Transferencia</h2>
            </div>
        </div>
    </div>
</template>
<style>
.payment-menu {
    display: flex;
    flex-direction: column;
}
.options {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}
.option {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>