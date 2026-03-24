function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function getElementById(id) {
    return document.getElementById(id);
}

function showMessage(message, duration = 3000) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'message';
    document.body.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, duration);
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}