// ============================================
// MÓDULO STORAGE
// Maneja el almacenamiento de datos
// ============================================

export const Storage = {
  // Guarda datos en localStorage
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error guardando datos:', error);
      return false;
    }
  },

  // Obtiene datos de localStorage
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      return null;
    }
  },

  // Elimina datos de localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error eliminando datos:', error);
      return false;
    }
  },

  // Limpia todo el localStorage
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
      return false;
    }
  }
};