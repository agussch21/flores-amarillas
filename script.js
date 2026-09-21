document.addEventListener('DOMContentLoaded', () => {

    // --- CANVAS DE PARTÍCULAS Y PÉTALOS ---
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    const particleCount = 40;

    class Particle {
        constructor(isBurst = false) {
            this.reset(isBurst);
        }

        reset(isBurst = false) {
            this.x = Math.random() * width;
            this.y = isBurst ? Math.random() * -200 : Math.random() * height - height;
            this.size = Math.random() * 10 + 6;
            this.speedY = isBurst ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 3 - 1.5;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = `rgba(255, ${Math.floor(Math.random() * 80 + 175)}, 50, ${this.opacity})`;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20) {
                this.reset();
                this.y = -10;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size / 2, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();


    // --- BOTÓN LLUVIA DE FLORES ---
    const btnPetals = document.getElementById('btnPetals');
    btnPetals.addEventListener('click', () => {
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle(true));
        }
    });


    // --- LÓGICA DE LA VENTANA MODAL (CARTA) ---
    const modal = document.getElementById('modalLetter');
    const btnLetter = document.getElementById('btnLetter');
    const closeModal = document.getElementById('closeModal');

    btnLetter.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });


    // --- REPRODUCTOR DE MÚSICA LOCAL ---
    const btnMusic = document.getElementById('btnMusic');
    const audio = document.getElementById('audioFloricienta');

    btnMusic.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                btnMusic.textContent = "🔊 Pausar Canción";
            }).catch(error => {
                console.error("Error al reproducir audio:", error);
                alert("No se encontró 'flores_amarillas.mp3'. Revisa si tu archivo se llama 'flores_amarillas.mp3.mp3' o si estás usando Live Server en VS Code.");
            });
        } else {
            audio.pause();
            btnMusic.textContent = "🎵 Reproducir Canción";
        }
    });
});