const formatCantidad = (cantidad) => {
    return cantidad.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })
}

const formateFecha = fecha => {
    const fechaNew = new Date(fecha);

    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }

    return fechaNew.toLocaleDateString('es-ES', options);

}





module.exports = {
    formateFecha,
    formatCantidad,
    formatResumenPromesasPago,
}