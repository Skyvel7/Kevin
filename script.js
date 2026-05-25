document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN DE MÚSICA (PREMIUM SPOTIFY STYLE) ---
    const playlist = [
        { src: 'musica/cancion1.mp3', title: 'Brillas', artist: 'León Larregui' },
        { src: 'musica/cancion2.mp3', title: 'Disfruto', artist: 'Carla Morrison' },
        { src: 'musica/cancion3.mp3', title: 'Amor Completo', artist: 'Mon Laferte' },
        { src: 'musica/cancion4.mp3', title: 'Caminar de tu Mano', artist: 'Río Roma ft. Fonseca' },
        { src: 'musica/cancion5.mp3', title: 'Te Amo y Más', artist: 'Diego Luna' }
    ];
    let currentSongIndex = 4; // Empezar con Te Amo y Más
    const audioPlayer = document.getElementById('audio-player');
    const playerWidget = document.getElementById('music-player-widget');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const playerPlayBtn = document.getElementById('player-play-btn');
    const miniSongTitle = document.getElementById('mini-song-title');
    const miniSongArtist = document.getElementById('mini-song-artist');
    const playerSongTitle = document.getElementById('player-song-title');
    const playerSongArtist = document.getElementById('player-song-artist');
    const playlistList = document.getElementById('playlist-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let musicStarted = false;

    function loadSong(index) {
        currentSongIndex = index;
        const song = playlist[currentSongIndex];
        audioPlayer.src = song.src;
        
        miniSongTitle.innerText = song.title;
        miniSongArtist.innerText = song.artist;
        playerSongTitle.innerText = song.title;
        playerSongArtist.innerText = song.artist;

        document.querySelectorAll('.playlist-item').forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function playSong() {
        audioPlayer.play();
        musicStarted = true;
        playerWidget.classList.add('music-player-widget-playing');
        updatePlayButtons(true);
        
        // Sincronizar historia si existe
        const storyRing = document.querySelector('#play-music-story .ig-story-ring');
        if (storyRing) storyRing.classList.add('playing');
    }

    function pauseSong() {
        audioPlayer.pause();
        musicStarted = false;
        playerWidget.classList.remove('music-player-widget-playing');
        updatePlayButtons(false);
        
        // Sincronizar historia si existe
        const storyRing = document.querySelector('#play-music-story .ig-story-ring');
        if (storyRing) storyRing.classList.remove('playing');
    }

    function togglePlay() {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    }

    function updatePlayButtons(isPlaying) {
        const playIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        const pauseIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        const mainPlayIcon = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        const mainPauseIcon = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

        miniPlayBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
        playerPlayBtn.innerHTML = isPlaying ? mainPauseIcon : mainPlayIcon;
    }

    function playRandomSong() {
        playSong();
    }

    // Inicializar Playlist
    playlistList.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        li.innerHTML = `
            <span>${song.title} - <small>${song.artist}</small></span>
            <span class="song-duration">❤️</span>
        `;
        li.addEventListener('click', () => {
            loadSong(index);
            playSong();
        });
        playlistList.appendChild(li);
    });

    loadSong(currentSongIndex);

    // Eventos del Reproductor
    miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    playerPlayBtn.addEventListener('click', togglePlay);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) prevIndex = playlist.length - 1;
        loadSong(prevIndex);
        playSong();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(nextIndex);
        playSong();
    });

    audioPlayer.addEventListener('ended', () => {
        let nextIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(nextIndex);
        playSong();
    });

    document.getElementById('music-mini-bar').addEventListener('click', () => {
        playerWidget.classList.remove('minimized');
        playerWidget.classList.add('expanded');
    });

    document.getElementById('minimize-player-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerWidget.classList.remove('expanded');
        playerWidget.classList.add('minimized');
    });

    document.getElementById('expand-player-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerWidget.classList.remove('minimized');
        playerWidget.classList.add('expanded');
    });


    // --- 2. CONFIGURACIÓN DE NAVEGACIÓN (LA MAGIA) ---
    const vistaListaCartas = document.getElementById('vista-lista-cartas');
    const vistaCartaIndividual = document.getElementById('vista-carta-individual');
    const todosLosEnlacesDeCartas = document.querySelectorAll('.carta-link');


    // --- 3. LÓGICA DEL JUEGO DE SAN VALENTÍN ---
    let gameInterval;
    let gameActive = false;
    let score = 0;
    const WINNING_SCORE = 50;
    let player = { x: 135, y: 340, width: 50, height: 50, speed: 5 }; // Ajustado para canvas 320x400
    let items = []; // Corazones y obstáculos
    let canvas, ctx;

    // Imágenes (usaremos emojis para simplificar y no depender de archivos externos por ahora)
    const PLAYER_EMOJI = "🧺"; // Cesta
    const HEART_EMOJI = "❤️";
    const BAD_EMOJI = "😢";

    function initGame() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return; // Si no hay canvas, no es la carta del juego
        ctx = canvas.getContext('2d');

        const btnStart = document.getElementById('btn-start-game');
        const btnRestart = document.getElementById('btn-restart-game');
        const btnRestartWon = document.getElementById('btn-restart-game-won');

        if (btnStart) btnStart.addEventListener('click', startGame);
        if (btnRestart) btnRestart.addEventListener('click', startGame);
        if (btnRestartWon) btnRestartWon.addEventListener('click', startGame);

        // Controles Táctiles y Ratón
        // Controles Táctiles y Ratón
        const handleInput = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; // Factor de escala por si el CSS reduce el canvas
            const touchX = (clientX - rect.left) * scaleX;

            player.x = touchX - player.width / 2;
            // Limites
            if (player.x < 0) player.x = 0;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        };

        canvas.addEventListener('mousemove', (e) => {
            if (!gameActive) return;
            handleInput(e.clientX);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!gameActive) return;
            handleInput(e.touches[0].clientX);
        }, { passive: false });
    }

    function startGame() {
        gameActive = true;
        score = 0;
        items = [];
        player.x = canvas.width / 2 - player.width / 2;
        updateScore();

        document.getElementById('game-ui').style.pointerEvents = 'none'; // Permitir juego
        document.getElementById('btn-start-game').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-won').style.display = 'none';

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 20); // ~50 FPS
    }

    function stopGame() {
        gameActive = false;
        clearInterval(gameInterval);
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.pointerEvents = 'auto';
        }
    }

    function movePlayer(e) {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        player.x = mouseX - player.width / 2;

        // Limites
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }

    function gameLoop() {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar Jugador
        ctx.font = "40px Arial";
        ctx.fillText(PLAYER_EMOJI, player.x, player.y + 40);

        // Generar items aleatorios
        if (Math.random() < 0.05) { // Probabilidad de spawn
            const type = Math.random() < 0.3 ? 'bad' : 'good'; // 30% malos, 70% buenos
            items.push({
                x: Math.random() * (canvas.width - 30),
                y: -30,
                type: type,
                speed: Math.random() * 2 + 2
            });
        }

        // Actualizar y dibujar items
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.y += item.speed;

            // Dibujar
            ctx.font = "30px Arial";
            ctx.fillText(item.type === 'good' ? HEART_EMOJI : BAD_EMOJI, item.x, item.y + 30);

            // Colisiones
            if (
                item.x < player.x + player.width &&
                item.x + 30 > player.x &&
                item.y < player.y + player.height &&
                item.y + 30 > player.y
            ) {
                // Tocado
                if (item.type === 'good') {
                    score++;
                    updateScore();
                    // Eliminar item
                    items.splice(i, 1);
                    i--;

                    if (score >= WINNING_SCORE) {
                        gameWin();
                    }
                } else {
                    gameOver();
                }
            } else if (item.y > canvas.height) {
                // Salió de pantalla
                items.splice(i, 1);
                i--;
            }
        }
    }

    function updateScore() {
        document.getElementById('score-display').innerText = `Puntos: ${score}`;
    }

    function gameOver() {
        stopGame();
        document.getElementById('game-message').innerText = `¡Oh no! Atrapaste una carita triste 😢. \nPuntaje final: ${score}`;
        document.getElementById('game-over').style.display = 'block';
    }

    function gameWin() {
        stopGame();
        document.getElementById('game-won').style.display = 'block';

        // --- GUARDAR PROGRESO ---
        localStorage.setItem('valentin_won', 'true');

        // Cambiar comportamiento del botón para ir a la carta
        const btnWon = document.getElementById('btn-restart-game-won');
        if (btnWon) {
            btnWon.innerText = "💌 Leer mi Carta 💌";
            // Clonamos el botón para eliminar listeners anteriores (como startGame)
            const newBtn = btnWon.cloneNode(true);
            btnWon.parentNode.replaceChild(newBtn, btnWon);

            newBtn.addEventListener('click', () => {
                cargarCarta('cartas/carta-san-valentin-recompensa.html');
            });
        }
    }

    // --- 4. CONFIGURACIÓN DE NAVEGACIÓN (MODIFICADA) ---

    // Función para mostrar la lista de cartas (oculta la carta)
    function mostrarListaCartas() {
        stopGame(); // DETIENE EL JUEGO AL SALIR
        vistaCartaIndividual.style.display = 'none';
        vistaCartaIndividual.innerHTML = '';
        vistaListaCartas.style.display = 'block';
    }

    // Función para cargar y mostrar una carta
    async function cargarCarta(url) {
        try {
            // Inicia la música si es el primer clic
            if (!musicStarted) {
                playRandomSong();
            }

            // 1. Carga el archivo HTML de la carta
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo cargar la carta.');
            const cartaHtmlCompleto = await response.text();

            // 2. Extrae SÓLO .carta-individual
            const parser = new DOMParser();
            const doc = parser.parseFromString(cartaHtmlCompleto, 'text/html');
            const contenidoCarta = doc.querySelector('.carta-individual');

            if (!contenidoCarta) {
                throw new Error('El archivo de la carta no tiene la clase .carta-individual.');
            }

            // 3. Limpia e inserta
            vistaCartaIndividual.innerHTML = '';
            vistaCartaIndividual.appendChild(contenidoCarta);

            // 4. Cambia las vistas
            vistaListaCartas.style.display = 'none';
            vistaCartaIndividual.style.display = 'block';

            // --- INICIALIZAR JUEGO SI EXISTE ---
            // Pequeño timeout para asegurar que el DOM se ha pintado
            setTimeout(() => {
                if (document.getElementById('gameCanvas')) {
                    initGame();
                }
                // Si es la carta especial de 2 años y 2 meses
                if (document.querySelector('.carta-2-anos-2-meses')) {
                    initAnniversaryLetter();
                }
            }, 50);

            // 5. Asigna la función de "volver"
            vistaCartaIndividual.querySelectorAll('.btn-volver').forEach(boton => {
                // Si es el botón de jugar de nuevo
                if (boton.id === 'btn-replay-game') {
                    boton.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarCarta('cartas/carta-san-valentin.html');
                    });
                } else {
                    // Si es el botón de volver normal
                    boton.addEventListener('click', (e) => {
                        e.preventDefault();
                        mostrarListaCartas();
                    });
                }
            });

        } catch (error) {
            console.error('Error al cargar la carta:', error);
            alert('Error al cargar la carta. Revisa la consola.');
        }
    }

    // 6. Asigna la función de cargar a CADA enlace de carta
    todosLosEnlacesDeCartas.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let urlDeLaCarta = link.getAttribute('href');

            // --- VERIFICACIÓN DE RECOMPENSA ---
            // Si intenta abrir la carta de San Valentín Y ya ganó antes...
            if (urlDeLaCarta.includes('carta-san-valentin.html')) {
                const yaGano = localStorage.getItem('valentin_won') === 'true';
                if (yaGano) {
                    // ... le mostramos directamente la carta de recompensa
                    urlDeLaCarta = 'cartas/carta-san-valentin-recompensa.html';
                }
            }

            cargarCarta(urlDeLaCarta);
        });
    });

    // --- INSTAGRAM UI LOGIC ---

    // Funcionalidad de dar "Me gusta"
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Evitar comportamientos extraños
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.setAttribute('fill', '#ed4956');
                this.setAttribute('stroke', '#ed4956');
            } else {
                this.setAttribute('fill', 'none');
                this.setAttribute('stroke', 'currentColor');
            }
        });
    });

    // Funcionalidad de la historia de música
    const playMusicStory = document.getElementById('play-music-story');
    if (playMusicStory) {
        playMusicStory.addEventListener('click', () => {
            const ring = playMusicStory.querySelector('.ig-story-ring');
            if (!musicStarted) {
                playRandomSong();
                ring.classList.add('playing');
            } else {
                audioPlayer.pause();
                musicStarted = false;
                ring.classList.remove('playing');
            }
        });
    }

    // Funcionalidad de Carruseles (Dots)
    document.querySelectorAll('.ig-post-carousel-container').forEach(container => {
        const carousel = container.querySelector('.ig-post-carousel');
        const dots = container.querySelectorAll('.ig-carousel-dots .dot');

        if (carousel && dots.length > 0) {
            carousel.addEventListener('scroll', () => {
                const scrollLeft = carousel.scrollLeft;
                const clientWidth = carousel.clientWidth;
                // Calculamos el índice de la foto actual redondeando la posición
                const activeIndex = Math.round(scrollLeft / clientWidth);
                
                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });
        }
    });

    // --- 5. LÓGICA DE PARTÍCULAS (LLUVIA DE PÉTALOS Y CORAZONES) ---
    let particlesEnabled = localStorage.getItem('particles_enabled') !== 'false';
    const particlesCanvas = document.getElementById('particles-canvas');
    const particlesCtx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
    let particles = [];
    const particleTypes = ['heart', 'petal'];

    function resizeParticlesCanvas() {
        if (!particlesCanvas) return;
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeParticlesCanvas);
    resizeParticlesCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * (particlesCanvas ? particlesCanvas.width : 500);
            this.y = Math.random() * -(particlesCanvas ? particlesCanvas.height : 500) - 20;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 2 - 1;
            this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            this.color = this.type === 'heart' 
                ? `hsl(${Math.random() * 20 + 345}, 100%, ${Math.random() * 20 + 60}%)`
                : `hsl(${Math.random() * 25 + 340}, 100%, ${Math.random() * 15 + 75}%)`;
            this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            this.oscillationDistance = Math.random() * 30 + 10;
            this.initialX = this.x;
            this.oscillationOffset = Math.random() * Math.PI * 2;
        }

        update() {
            if (!particlesCanvas) return;
            this.y += this.speedY;
            this.angle += this.spinSpeed;
            this.x = this.initialX + Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * this.oscillationDistance;

            if (this.y > particlesCanvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * particlesCanvas.width;
                this.initialX = this.x;
                this.speedY = Math.random() * 1.5 + 0.8;
            }
        }

        draw() {
            if (!particlesCtx) return;
            particlesCtx.save();
            particlesCtx.translate(this.x, this.y);
            particlesCtx.rotate((this.angle * Math.PI) / 180);

            if (this.type === 'heart') {
                particlesCtx.fillStyle = this.color;
                particlesCtx.beginPath();
                const size = this.size;
                particlesCtx.moveTo(0, -size / 4);
                particlesCtx.bezierCurveTo(size / 2, -size, size, -size / 3, 0, size);
                particlesCtx.bezierCurveTo(-size, -size / 3, -size / 2, -size, 0, -size / 4);
                particlesCtx.fill();
            } else {
                particlesCtx.fillStyle = this.color;
                particlesCtx.beginPath();
                const size = this.size;
                particlesCtx.ellipse(0, 0, size / 2, size, 0, 0, Math.PI * 2);
                particlesCtx.fill();
            }
            particlesCtx.restore();
        }
    }

    function initParticles() {
        if (!particlesCanvas) return;
        particles = [];
        const count = Math.min(50, Math.floor(window.innerWidth / 8));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        if (!particlesCanvas || !particlesCtx) return;
        particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        if (particlesEnabled) {
            particles.forEach(p => {
                p.update();
                p.draw();
            });
        }
        requestAnimationFrame(animateParticles);
    }

    // Inicializar partículas
    if (particlesCanvas) {
        initParticles();
        animateParticles();
    }

    // Activar botón toggle de partículas en la cabecera
    const toggleParticlesBtn = document.getElementById('toggle-particles');
    if (toggleParticlesBtn) {
        if (!particlesEnabled) toggleParticlesBtn.style.opacity = '0.5';
        toggleParticlesBtn.addEventListener('click', () => {
            particlesEnabled = !particlesEnabled;
            localStorage.setItem('particles_enabled', particlesEnabled);
            if (particlesEnabled) {
                toggleParticlesBtn.style.opacity = '1';
                initParticles();
            } else {
                toggleParticlesBtn.style.opacity = '0.5';
                if (particlesCtx && particlesCanvas) {
                    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
                }
            }
        });
    }

    // --- 6. CONTADOR DE AMOR EN TIEMPO REAL (DESDE 25 DE MARZO DE 2024) ---
    function updateLoveCounter() {
        const timerContainer = document.getElementById('love-timer');
        if (!timerContainer) return;

        const startDate = new Date('2024-03-25T00:00:00');
        const now = new Date();
        
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }
        
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const yEl = document.getElementById('timer-years');
        const mEl = document.getElementById('timer-months');
        const dEl = document.getElementById('timer-days');
        const hEl = document.getElementById('timer-hours');
        const minEl = document.getElementById('timer-minutes');
        const sEl = document.getElementById('timer-seconds');

        if (yEl) yEl.innerText = years;
        if (mEl) mEl.innerText = months;
        if (dEl) dEl.innerText = days;
        if (hEl) hEl.innerText = String(hours).padStart(2, '0');
        if (minEl) minEl.innerText = String(minutes).padStart(2, '0');
        if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
    }

    if (document.getElementById('love-timer')) {
        setInterval(updateLoveCounter, 1000);
        updateLoveCounter();
    }

    // --- 7. LÓGICA DE LA CARTA INTERACTIVA DE 2 AÑOS Y 2 MESES ---
    const loveReasons = [
        { text: "Tu risa contagiosa que ilumina cualquier día gris.", icon: "😄" },
        { text: "Cómo me cuidas y te preocupas por mí en todo momento.", icon: "🥰" },
        { text: "Tus abrazos cálidos que me hacen sentir seguro y en casa.", icon: "🤗" },
        { text: "Tu forma tan bonita de ver la vida y tu gran corazón.", icon: "❤️" },
        { text: "Las miradas cómplices que solo nosotros entendemos.", icon: "👁️‍🗨️" },
        { text: "Tu paciencia infinita y cómo sabes escucharme siempre.", icon: "💬" },
        { text: "Cómo me apoyas en cada uno de mis sueños y metas.", icon: "🚀" },
        { text: "Lo cariñosa y detallista que eres conmigo.", icon: "🎁" },
        { text: "Las pequeñas tonterías y bromas que solo nosotros compartimos.", icon: "🤪" },
        { text: "Simplemente ser tú, mi compañera de vida perfecta.", icon: "👑" }
    ];

    function initAnniversaryLetter() {
        initScratchCard();
        initLoveCards();
        typeText();
    }

    // A. Efecto de Máquina de Escribir compatible con etiquetas HTML
    function typeText() {
        const source = document.getElementById('typewriter-source');
        const target = document.getElementById('typewriter-text');
        if (!source || !target) return;
        
        target.innerHTML = '';
        const paras = Array.from(source.children);
        let pIndex = 0;
        
        function showParagraph() {
            // Si la carta ya no está visible (la usuaria volvió), cancelar
            if (!document.getElementById('typewriter-text')) return;

            if (pIndex >= paras.length) return;
            
            const originalP = paras[pIndex];
            const newP = document.createElement(originalP.tagName);
            newP.style.cssText = originalP.style.cssText;
            newP.className = originalP.className;
            target.appendChild(newP);
            
            const htmlContent = originalP.innerHTML;
            let currentHtml = "";
            let charIndex = 0;
            let inTag = false;
            
            function typeChar() {
                // Si la carta ya no está visible (la usuaria volvió), cancelar
                if (!document.getElementById('typewriter-text')) return;

                if (charIndex >= htmlContent.length) {
                    pIndex++;
                    setTimeout(showParagraph, 500); // Pausa entre párrafos
                    return;
                }
                
                const char = htmlContent[charIndex];
                if (char === '<') inTag = true;
                currentHtml += char;
                if (char === '>') inTag = false;
                
                newP.innerHTML = currentHtml + '<span class="cursor">|</span>';
                charIndex++;
                
                if (inTag) {
                    typeChar();
                } else {
                    setTimeout(typeChar, Math.random() * 15 + 10);
                }
            }
            
            typeChar();
        }
        
        showParagraph();
    }

    // B. Tarjeta de Raspar (Scratch Card)
    function initScratchCard() {
        const canvas = document.getElementById('scratch-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Cobertura rosa con gradiente
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#ff9a9e');
        grad.addColorStop(0.5, '#fecfef');
        grad.addColorStop(1, '#ff85a2');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar borde decorativo
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Texto descriptivo
        ctx.font = 'bold 16px Arial, Helvetica, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Sombra de texto
        ctx.shadowColor = 'rgba(214, 51, 108, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fillText('¡Raspa aquí con amor! 💖', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0; // reset
        
        let isDrawing = false;
        
        function scratch(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.fill();
            
            checkScratchPercentage();
        }
        
        function checkScratchPercentage() {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;
            let transparentCount = 0;
            
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) transparentCount++;
            }
            
            const totalPixels = canvas.width * canvas.height;
            const ratio = transparentCount / totalPixels;
            
            // Si supera el 50%, desvanecer y ocultar canvas
            if (ratio > 0.5) {
                canvas.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                canvas.style.opacity = '0';
                canvas.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    canvas.style.display = 'none';
                }, 800);
            }
        }
        
        // Ratón
        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) scratch(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => isDrawing = false);
        
        // Táctil (Móvil)
        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
        });
        canvas.addEventListener('touchmove', (e) => {
            if (isDrawing && e.touches[0]) {
                e.preventDefault();
                scratch(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        window.addEventListener('touchend', () => isDrawing = false);
    }

    // C. Mazo de 10 Tarjetas de Amor
    function initLoveCards() {
        const card = document.getElementById('interactive-love-card');
        const count = document.getElementById('love-card-count');
        const icon = document.getElementById('love-card-icon');
        const text = document.getElementById('love-card-text');
        if (!card || !count || !icon || !text) return;
        
        let rIndex = 0;
        
        card.addEventListener('click', () => {
            card.classList.add('flip-anim');
            
            setTimeout(() => {
                rIndex = (rIndex + 1) % loveReasons.length;
                count.innerText = `Razón ${rIndex + 1} de 10`;
                icon.innerText = loveReasons[rIndex].icon;
                text.innerText = loveReasons[rIndex].text;
            }, 250);
            
            setTimeout(() => {
                card.classList.remove('flip-anim');
            }, 500);
        });
    }

});
