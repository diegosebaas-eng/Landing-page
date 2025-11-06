// Animación de las formas flotantes
document.addEventListener('DOMContentLoaded', () => {
    // Animar las formas flotantes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    // Añadir efecto de parallax al scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const content = document.querySelector('.content');
        
        if (hero && content) {
            content.style.transform = `translateY(${scrolled * 0.1}px)`;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // Animación del indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    // Animación de entrada para los elementos de la página
    const animateElements = () => {
        const elements = [
            '.badge',
            '.main-title',
            '.tagline',
            '.description',
            '.features',
            '.cta-container',
            '.tech-stack'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100 * index);
            }
        });
    };

    // Ejecutar animaciones de entrada
    animateElements();

    // Añadir efectos hover a los features
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateY(-5px)';
        });
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateY(0)';
        });
    });

    // Animación del botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.transform = 'scale(1.05)';
        });
        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'scale(1)';
        });
    }
});

// Función para animar elementos cuando entran en el viewport
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elements = document.querySelectorAll('.feature, .tech-stack span');
    elements.forEach(element => observer.observe(element));
};

// Iniciar observación de elementos
observeElements();
