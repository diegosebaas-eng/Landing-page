// ============================================
// MÓDULO TASKS
// Validaciones y utilidades generales
// ============================================

export const Tasks = {
  // Validación de email
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validación de teléfono
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 8 && cleaned.length <= 15;
  },

  // Validación de nombre
  validateName(name) {
    return name.trim().length >= 2;
  },

  // Validación de mensaje
  validateMessage(message) {
    return message.trim().length >= 10;
  },

  // Sanitiza texto para prevenir XSS
  sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Formatea fecha
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Debounce para optimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};