// ============================================
// MÓDULO UI
// Maneja todas las interacciones de interfaz
// ============================================

export const UI = {
  // Muestra notificaciones toast
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Muestra/oculta loader
  toggleLoader(show, element) {
    if (show) {
      element.disabled = true;
      element.dataset.originalText = element.textContent;
      element.textContent = 'Enviando...';
    } else {
      element.disabled = false;
      element.textContent = element.dataset.originalText;
    }
  },

  // Limpia mensajes de error del formulario
  clearFormErrors(form) {
    form.querySelectorAll('.valid, .invalid').forEach(field => {
      field.classList.remove('valid', 'invalid');
    });
    form.querySelectorAll('.error-msg').forEach(msg => {
      msg.textContent = '';
    });
  }
};