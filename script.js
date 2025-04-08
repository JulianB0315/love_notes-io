// Para depuración
console.log('Script iniciado');

// Crear la aplicación Vue
const app = Vue.createApp({
    data() {
        return {
            loveNotes: [], // Inicializar como array vacío
            currentDate: new Date(),
            currentYear: new Date().getFullYear(),
            isLoading: true,
            error: null,
            funSounds: [
                'pop', 'zing', 'tada', 'magic'
            ],
            gradientColors: [
                ['#ff80ab', '#f48fb1'],
                ['#f06292', '#ec407a'],
                ['#e91e63', '#ad1457'],
                ['#f8bbd0', '#ff80ab'],
                ['#c2185b', '#880e4f']
            ],
            // Añadir la propiedad loveQuotes que faltaba
            loveQuotes: [
                "El amor no se mira, se siente, y aún más cuando ella está junto a ti.",
                "Eres mi primer pensamiento cada mañana y mi último pensamiento cada noche.",
                "En un mundo lleno de personas, mis ojos te buscan solo a ti.",
                "Contigo aprendí que el amor verdadero existe y es más bonito de lo que imaginaba.",
                "Cada momento contigo es un tesoro que guardo en mi corazón."
            ],
            currentQuoteIndex: 0
        };
    },
    computed: {
        dayOfYear() {
            try {
                const startOfYear = new Date(this.currentDate.getFullYear(), 0, 0);
                const diff = this.currentDate - startOfYear;
                const oneDay = 1000 * 60 * 60 * 24;
                return Math.floor(diff / oneDay);
            } catch (e) {
                console.error('Error calculando día del año:', e);
                return 1; // Valor predeterminado seguro
            }
        },
        formattedDate() {
            try {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return this.currentDate.toLocaleDateString('es-ES', options);
            } catch (e) {
                console.error('Error al formatear fecha:', e);
                return 'Error al mostrar la fecha';
            }
        },
        currentNote() {
            if (this.isLoading) {
                return {
                    title: 'Cargando nuestra historia de amor...',
                    message: 'Espera un momento mientras escribo estas palabras para ti, con todo mi corazón.',
                    author: 'Con infinito amor'
                };
            }
            
            if (this.error) {
                return {
                    title: 'Un pequeño contratiempo en nuestra historia',
                    message: `No pudimos cargar tu nota de amor... pero eso no impide que mi corazón sienta todo por ti.`,
                    author: 'Siempre tuyo/a'
                };
            }
            
            // Verificar que loveNotes sea un array y tenga elementos
            if (!Array.isArray(this.loveNotes) || this.loveNotes.length === 0) {
                return {
                    title: 'Esperando para escribir nuestra historia',
                    message: 'Pronto este espacio se llenará con todas las razones por las que te amo.',
                    author: 'Quien cuenta los días para amarte'
                };
            }
            
            // Obtener la nota correspondiente al día del año
            try {
                const noteIndex = (this.dayOfYear - 1) % this.loveNotes.length;
                return this.loveNotes[noteIndex] || {
                    title: 'Amor sin palabras',
                    message: 'Hay días en que las palabras no alcanzan para expresar todo lo que siento por ti.',
                    author: 'Tu amor eterno'
                };
            } catch (e) {
                console.error('Error al obtener nota del día:', e);
                return {
                    title: 'Algo salió mal',
                    message: 'Pero mi amor por ti nunca falla.',
                    author: 'Quien te ama incondicionalmente'
                };
            }
        }
    },
    methods: {
        changeDay(offset) {
            console.log(`Cambiando día: ${offset}`);
            try {
                const newDate = new Date(this.currentDate);
                newDate.setDate(newDate.getDate() + offset);
                this.currentDate = newDate;
                
                // Efectos divertidos
                this.playRandomSound();
                this.bounceCardEffect();
            } catch (e) {
                console.error('Error al cambiar día:', e);
            }
        },
        resetToToday() {
            console.log('Volviendo a hoy');
            try {
                this.currentDate = new Date();
                
                // Efectos divertidos
                this.showConfetti();
                this.playRandomSound();
            } catch (e) {
                console.error('Error al resetear a hoy:', e);
            }
        },
        async loadNotes() {
            console.log('Cargando notas de amor...');
            this.isLoading = true;
            this.error = null;
            
            try {
                const response = await fetch('data/love_notes.json');
                console.log('Respuesta recibida:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Verificar que data sea un array
                if (!Array.isArray(data)) {
                    throw new Error('El formato de los datos no es válido');
                }
                
                console.log(`Notas cargadas: ${data.length}`);
                this.loveNotes = data;
            } catch (error) {
                console.error('Error al cargar las notas:', error);
                this.error = error.message;
                // Inicializar loveNotes como array vacío en caso de error
                this.loveNotes = [];
            } finally {
                this.isLoading = false;
            }
        },
        createFloatingHearts() {
            console.log('Creando corazones flotantes');
            const createHeart = () => {
                const heart = document.createElement('div');
                heart.innerHTML = '<i class="fas fa-heart"></i>';
                heart.classList.add('floating-heart');
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.top = '100%';
                heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
                heart.style.animationDuration = Math.random() * 8 + 8 + 's';
                
                // Añadir variación de color
                const hue = Math.floor(Math.random() * 20);
                heart.style.color = `rgba(226, ${92 + hue}, ${139 + hue}, ${Math.random() * 0.3 + 0.4})`;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 16000);
            };
            
            // Crear corazones iniciales
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    createHeart();
                }, i * 400);
            }
            
            // Seguir creando corazones periódicamente
            setInterval(createHeart, 3000);
        },
        createFallingPetals() {
            const petalsContainer = document.querySelector('.falling-petals');
            
            const createPetal = () => {
                const petal = document.createElement('div');
                petal.classList.add('petal');
                
                // Tamaño aleatorio
                const size = Math.random() * 15 + 10;
                petal.style.width = `${size}px`;
                petal.style.height = `${size}px`;
                
                // Posición inicial aleatoria
                petal.style.left = `${Math.random() * 100}%`;
                petal.style.top = '-5%';
                
                // Variación de color
                const hue = Math.floor(Math.random() * 30);
                petal.style.backgroundColor = `rgba(${226 + hue}, ${92 + hue}, ${139 - hue}, ${Math.random() * 0.2 + 0.1})`;
                
                // Duración aleatoria
                const duration = Math.random() * 10 + 15;
                petal.style.animationDuration = `${duration}s`;
                
                petalsContainer.appendChild(petal);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    petal.remove();
                }, duration * 1000);
            };
            
            // Crear pétalos iniciales
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createPetal();
                }, i * 300);
            }
            
            // Seguir creando pétalos periódicamente
            setInterval(createPetal, 2000);
        },
        randomizeQuote() {
            try {
                // Verificar que loveQuotes exista y sea un array
                if (!Array.isArray(this.loveQuotes) || this.loveQuotes.length === 0) {
                    console.error('loveQuotes no está definido o está vacío');
                    return;
                }
                
                const newIndex = Math.floor(Math.random() * this.loveQuotes.length);
                // Asegurarse de que no se repita la cita
                if (newIndex === this.currentQuoteIndex && this.loveQuotes.length > 1) {
                    this.currentQuoteIndex = (newIndex + 1) % this.loveQuotes.length;
                } else {
                    this.currentQuoteIndex = newIndex;
                }
                
                // Actualizar el texto de la cita en el DOM
                const quoteElement = document.querySelector('.love-quote p');
                if (quoteElement) {
                    quoteElement.textContent = `"${this.loveQuotes[this.currentQuoteIndex]}"`;
                }
            } catch (e) {
                console.error('Error en randomizeQuote:', e);
            }
        },
        createFloatingBubbles() {
            console.log('Creando burbujas flotantes con gradientes');
            const bubblesContainer = document.querySelector('.floating-bubbles');
            
            if (!bubblesContainer) {
                console.error('No se encontró el contenedor de burbujas');
                return;
            }
            
            const createBubble = () => {
                try {
                    const bubble = document.createElement('div');
                    bubble.classList.add('bubble');
                    
                    // Tamaño aleatorio
                    const size = Math.random() * 50 + 10;
                    bubble.style.width = `${size}px`;
                    bubble.style.height = `${size}px`;
                    
                    // Posición inicial aleatoria
                    bubble.style.left = `${Math.random() * 100}%`;
                    
                    // Gradiente aleatorio
                    if (Array.isArray(this.gradientColors) && this.gradientColors.length > 0) {
                        const gradientIndex = Math.floor(Math.random() * this.gradientColors.length);
                        const colorPair = this.gradientColors[gradientIndex];
                        
                        if (Array.isArray(colorPair) && colorPair.length >= 2) {
                            const start = colorPair[0];
                            const end = colorPair[1];
                            bubble.style.background = `linear-gradient(135deg, ${start}22, ${end}11)`;
                        }
                    }
                    
                    // Duración aleatoria
                    const duration = Math.random() * 10 + 8;
                    bubble.style.animationDuration = `${duration}s`;
                    
                    bubblesContainer.appendChild(bubble);
                    
                    // Eliminar después de la animación
                    setTimeout(() => {
                        if (bubble && bubble.parentNode) {
                            bubble.parentNode.removeChild(bubble);
                        }
                    }, duration * 1000);
                } catch (e) {
                    console.error('Error al crear burbuja:', e);
                }
            };
            
            // Crear burbujas iniciales
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    createBubble();
                }, i * 200);
            }
            
            // Seguir creando burbujas periódicamente
            setInterval(createBubble, 1500);
        },
        // Reemplazar createFloatingEmojis con createGradientElements
        createGradientElements() {
            console.log('Creando elementos con gradientes');
            
            // Añadir un efecto de gradiente al fondo en intervalos
            const changeBackgroundGradient = () => {
                try {
                    const body = document.body;
                    
                    if (!body || !Array.isArray(this.gradientColors) || this.gradientColors.length === 0) {
                        return;
                    }
                    
                    const randomIndex1 = Math.floor(Math.random() * this.gradientColors.length);
                    const randomIndex2 = Math.floor(Math.random() * this.gradientColors.length);
                    
                    const colorPair1 = this.gradientColors[randomIndex1];
                    const colorPair2 = this.gradientColors[randomIndex2];
                    
                    if (Array.isArray(colorPair1) && colorPair1.length >= 2 && 
                        Array.isArray(colorPair2) && colorPair2.length >= 2) {
                        
                        const startColor = colorPair1[0];
                        const midColor = colorPair2[1];
                        const endColor = colorPair1[1];
                        
                        body.style.background = `linear-gradient(135deg, ${startColor}22 0%, ${midColor}22 50%, ${endColor}22 100%)`;
                        body.style.backgroundSize = '400% 400%';
                        body.style.animation = 'gradientBG 15s ease infinite';
                    }
                } catch (e) {
                    console.error('Error al cambiar gradiente:', e);
                }
            };
            
            // Cambiar gradiente cada cierto tiempo
            setInterval(changeBackgroundGradient, 10000);
        },
        showConfetti() {
            try {
                const colors = [];
                
                // Verificar que gradientColors sea un array
                if (Array.isArray(this.gradientColors)) {
                    // Usar colores de nuestros gradientes para el confeti
                    this.gradientColors.forEach(gradient => {
                        if (Array.isArray(gradient) && gradient.length >= 2) {
                            colors.push(gradient[0]);
                            colors.push(gradient[1]);
                        }
                    });
                }
                
                // Si no hay colores, usar algunos predeterminados
                if (colors.length === 0) {
                    colors.push('#ff6b6b', '#4568dc', '#0ba360', '#ff9966', '#7b4397');
                }
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: colors
                });
                
                this.playRandomSound();
            } catch (e) {
                console.error('Error al mostrar confeti:', e);
            }
        },
        bounceCardEffect() {
            try {
                const card = document.querySelector('.love-note-card');
                if (card) {
                    card.classList.add('animate__animated', 'animate__rubberBand');
                    setTimeout(() => {
                        card.classList.remove('animate__animated', 'animate__rubberBand');
                    }, 1000);
                }
            } catch (e) {
                console.error('Error en efecto de rebote:', e);
            }
        },
        surpriseMe() {
            try {
                // Ir a un día aleatorio
                const randomDay = Math.floor(Math.random() * 365) + 1;
                const currentYear = new Date().getFullYear();
                this.currentDate = new Date(currentYear, 0, randomDay);
                
                // Mostrar efectos
                this.showConfetti();
                
                // Animar tarjeta
                const card = document.querySelector('.love-note-card');
                if (card) {
                    card.classList.add('animate__animated', 'animate__flip');
                    setTimeout(() => {
                        card.classList.remove('animate__animated', 'animate__flip');
                    }, 1000);
                }
                
                // Cambiar gradientes aleatorios en elementos clave
                this.applyRandomGradients();
            } catch (e) {
                console.error('Error en surpriseMe:', e);
            }
        },
        applyRandomGradients() {
            try {
                // Verificar que gradientColors sea un array y tenga elementos
                if (!Array.isArray(this.gradientColors) || this.gradientColors.length === 0) {
                    return;
                }
                
                // Aplicar gradientes aleatorios a elementos clave
                const randomGradient = (el, property = 'background') => {
                    if (!el) return;
                    
                    const randomIndex = Math.floor(Math.random() * this.gradientColors.length);
                    const colorPair = this.gradientColors[randomIndex];
                    
                    if (Array.isArray(colorPair) && colorPair.length >= 2) {
                        const start = colorPair[0];
                        const end = colorPair[1];
                        el.style[property] = `linear-gradient(45deg, ${start}, ${end})`;
                    }
                };
                
                // Aplicar a algunos elementos
                const heartContainer = document.querySelector('.gradient-heart-container');
                randomGradient(heartContainer);
                
                const gradientLine = document.querySelector('.gradient-line');
                randomGradient(gradientLine);
            } catch (e) {
                console.error('Error al aplicar gradientes:', e);
            }
        },
        playRandomSound() {
            // Método usado pero no implementado
            console.log('Reproduciendo sonido aleatorio');
            // En una implementación completa, aquí iría el código para reproducir un sonido
        }
    },
    mounted() {
        console.log('Vue App montada');
        
        // Cargar notas primero
        this.loadNotes().then(() => {
            // Solo iniciar efectos visuales después de cargar datos
            this.createFloatingHearts();
            this.createFallingPetals();
            this.randomizeQuote();
            this.createFloatingBubbles();
            this.createGradientElements(); // Reemplazamos createFloatingEmojis
            this.applyRandomGradients();   // Inicializar gradientes
            
            // Confetti de bienvenida
            setTimeout(() => {
                this.showConfetti();
            }, 1000);
            
            // Efecto inicial de bienvenida
            setTimeout(() => {
                const loveNoteCard = document.querySelector('.love-note-card');
                if (loveNoteCard) {
                    loveNoteCard.classList.add('animate__animated', 'animate__heartBeat');
                    setTimeout(() => {
                        loveNoteCard.classList.remove('animate__heartBeat');
                    }, 1500);
                }
            }, 1000);
            
            // Efecto inicial divertido
            setTimeout(() => {
                const card = document.querySelector('.love-note-card');
                if (card) {
                    card.classList.add('animate__animated', 'animate__bounceIn');
                    setTimeout(() => {
                        card.classList.remove('animate__bounceIn');
                    }, 1500);
                }
            }, 500);
        }).catch(error => {
            console.error('Error en la inicialización:', error);
        });
    }
});

// Montar la aplicación con manejo de errores
try {
    console.log('Intentando montar la aplicación Vue');
    const mountedApp = app.mount('#app');
    console.log('Aplicación Vue montada correctamente');
} catch (e) {
    console.error('Error al montar la aplicación Vue:', e);
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px; font-family: 'Pacifico', cursive;">
            <h1 style="color: #ff6b6b;">¡Ups! Pequeño problemita</h1>
            <p style="font-family: 'Comic Neue', cursive; font-size: 1.2rem;">
                Algo salió mal, pero no te preocupes, ¡el amor siempre encuentra su camino!
            </p>
            <p style="font-family: 'Comic Neue', cursive;">Error: ${e.message}</p>
            <button onclick="location.reload()" style="padding: 10px 20px; background: linear-gradient(to right, #ff6b6b, #ff9e7d); color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px; font-family: 'Comic Neue', cursive; font-weight: bold; font-size: 1.1rem;">
                ¡Intentémoslo de nuevo! <i class="fas fa-redo"></i>
            </button>
        </div>
    `;
}
