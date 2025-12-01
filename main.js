// ============================================
// MAIN.JS - Orquestador Principal
// Importa y coordina todos los módulos
// ============================================

import { UI } from './ui.js';
import { Storage } from './storage.js';
import { Tasks } from './tasks.js';

// ============================================
// MÓDULO: Navegación
// ============================================
const Navigation = {
  init() {
    this.setupSmoothScroll();
    this.setupScrollspy();
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  setupScrollspy() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(18, 18, 18, 0.98)';
        header.style.boxShadow = '0 2px 15px rgba(0, 255, 224, 0.2)';
      } else {
        header.style.background = 'linear-gradient(135deg, #1e1e2f, #121212)';
        header.style.boxShadow = 'none';
      }
    });
  }
};

// ============================================
// MÓDULO: Animaciones
// ============================================
const Animations = {
  init() {
    this.observeElements();
  },

  observeElements() {
    const elements = document.querySelectorAll('.card, .gallery-item, .step');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease';
      observer.observe(element);
    });
  }
};

// ============================================
// MÓDULO: Formulario
// ============================================
const ContactForm = {
  init() {
    this.form = document.getElementById('formulario');
    if (!this.form) return;
    
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', Tasks.debounce(() => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      }, 500));
    });
  },

  validateField(field) {
    const value = field.value.trim();
    let isValid = false;
    let errorMsg = '';

    switch(field.id) {
      case 'nombre':
        isValid = Tasks.validateName(value);
        errorMsg = 'El nombre debe tener al menos 2 caracteres';
        break;
      case 'email':
        isValid = Tasks.validateEmail(value);
        errorMsg = 'Email inválido';
        break;
      case 'telefono':
        isValid = Tasks.validatePhone(value);
        errorMsg = 'Teléfono inválido (8-15 dígitos)';
        break;
      case 'mensaje':
        isValid = Tasks.validateMessage(value);
        errorMsg = 'El mensaje debe tener al menos 10 caracteres';
        break;
    }

    this.showFieldError(field, isValid, errorMsg);
    return isValid;
  },

  showFieldError(field, isValid, errorMsg) {
    let errorDiv = field.nextElementSibling;
    
    if (!errorDiv || !errorDiv.classList.contains('error-msg')) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-msg';
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      errorDiv.textContent = '';
    } else {
      field.classList.remove('valid');
      field.classList.add('invalid');
      errorDiv.textContent = errorMsg;
    }
  },

  handleSubmit() {
    const fields = {
      nombre: document.getElementById('nombre'),
      email: document.getElementById('email'),
      telefono: document.getElementById('telefono'),
      mensaje: document.getElementById('mensaje')
    };

    const validations = Object.values(fields).map(field => 
      this.validateField(field)
    );

    if (validations.every(v => v)) {
      this.sendForm({
        nombre: fields.nombre.value,
        email: fields.email.value,
        telefono: fields.telefono.value,
        mensaje: fields.mensaje.value,
        fecha: new Date().toISOString()
      });
    } else {
      UI.showNotification('Por favor completá todos los campos correctamente', 'error');
    }
  },

  async sendForm(data) {
    const btn = this.form.querySelector('button[type="submit"]');
    UI.toggleLoader(true, btn);

    // Guardar en localStorage
    const submissions = Storage.get('form_submissions') || [];
    submissions.push(data);
    Storage.save('form_submissions', submissions);

    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    UI.showNotification(`¡Gracias ${data.nombre}! Te contactaremos pronto`, 'success');
    this.form.reset();
    UI.toggleLoader(false, btn);
    UI.clearFormErrors(this.form);

    console.log('Formulario guardado:', data);
  }
};

// ============================================
// MÓDULO: Galería Modal
// ============================================
const Gallery = {
  init() {
    this.createModal();
    this.setupGalleryItems();
  },

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img src="" alt="Proyecto ampliado">
        <div class="modal-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  },

  setupGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('p').textContent;
        this.openModal(img.src, caption);
      });
    });
  },

  openModal(src, caption) {
    const modal = document.getElementById('gallery-modal');
    const modalImg = modal.querySelector('img');
    const modalCaption = modal.querySelector('.modal-caption');
    
    modal.style.display = 'flex';
    modalImg.src = src;
    modalCaption.textContent = caption;
  },

  closeModal() {
    document.getElementById('gallery-modal').style.display = 'none';
  }
};

// ============================================
// MÓDULO: Contador de Estadísticas
// ============================================
const StatsCounter = {
  init() {
    this.setupCounters();
  },

  setupCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  },

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }
};

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Ares 3D...');
  
  try {
    Navigation.init();
    Animations.init();
    ContactForm.init();
    Gallery.init();
    StatsCounter.init();
    
    console.log('✅ Sistema inicializado correctamente');
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
    UI.showNotification('Error al cargar la aplicación', 'error');
  }
});