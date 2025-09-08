document.addEventListener('DOMContentLoaded', function() {
    
    gsap.registerPlugin(ScrollTrigger);

    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-invitation');
    const guestNameElement = document.getElementById('guest-name');
    const backgroundMusic = document.getElementById('background-music');

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to');
        guestNameElement.textContent = guestName ? decodeURIComponent(guestName).replace(/\+/g, ' ') : "Tamu Undangan";
    } catch (error) {
        console.error("Error processing URL parameters:", error);
        guestNameElement.textContent = "Tamu Undangan";
    }
    
function runCoverAnimations() {
        gsap.set("#cover .relative.z-10 > *", { opacity: 0, y: 20 });
        gsap.set("#cover > img", { opacity: 0, y: -100 }); 

        const tl = gsap.timeline({ defaults: { duration: 1.2, ease: 'power2.out' } });

        tl.to("#cover > img", { opacity: 0.7, y: 0, stagger: 0.2 })
        .to("#cover h1:first-of-type", { opacity: 1, y: 0 }, "-=0.8")
        .to("#cover img[src='./image1.png']", { opacity: 1, scale: 1 }, "-=0.9")
        .to("#cover .font-script", { opacity: 1, y: 0 }, "-=0.9")
        .to("#cover .font-body.font-semibold", { opacity: 1, y: 0 }, "-=0.8")
        .to("#cover .font-body.text-sm.text-grey", { opacity: 1, y: 0 }, "-=0.8")
        .to("#cover .font-body.text-sm.mt-8", { opacity: 1, y: 0, delay: 0.2 })
        .to("#guest-name", { opacity: 1, scale: 1 })
        .to("#open-invitation", { opacity: 1, y: 0 }, "-=0.5");
    }

    runCoverAnimations();

    openButton.addEventListener('click', function() {
        gsap.to(cover, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: () => {
                cover.style.display = 'none';
                mainContent.classList.remove('hidden');
                document.body.classList.remove('cover-active');
                runScrollAnimations();
            }
        });

        if (backgroundMusic) {
            backgroundMusic.play().catch(error => { console.log("Autoplay musik dicegah oleh browser."); });
        }
    });

    function runScrollAnimations() {
        // Animasi yang sudah berjalan baik
        gsap.timeline({ defaults: { duration: 1, ease: 'power2.out' } })
            .from('#hero h4', { opacity: 0, y: -30, delay: 0.5 })
            .from('#hero h1', { opacity: 0, scale: 0.8 }, '-=0.5')
            .from('#hero p', { opacity: 0, y: 30 }, '-=0.5');

        gsap.from('#ayat p', { scrollTrigger: { trigger: '#ayat', start: 'top 80%' }, opacity: 0, y: 50, duration: 1, stagger: 0.3 });
        gsap.from('#mempelai h2', { scrollTrigger: { trigger: '#mempelai', start: 'top 80%' }, opacity: 0, y: -50, duration: 1 });
        gsap.from('.mempelai-pria', { scrollTrigger: { trigger: '.mempelai-pria', start: 'top 80%' }, opacity: 0, x: -100, duration: 1 });
        gsap.from('.mempelai-wanita', { scrollTrigger: { trigger: '.mempelai-wanita', start: 'top 80%' }, opacity: 0, x: 100, duration: 1 });

        
        // ==========================================================
        //         PERBAIKAN FINAL UNTUK SECTION WAKTU & ACARA
        // ==========================================================
        // Kita gabungkan animasi h2 dan kartu ke dalam SATU timeline
        // yang dipicu oleh SATU ScrollTrigger. Ini cara paling andal.
        gsap.timeline({
            scrollTrigger: {
                trigger: '#acara',
                start: 'top 80%',
                // markers: true, // Hapus komentar ini jika masih ingin debug
            }
        })
        .from('#acara h2', {
            y: -50,
            opacity: 0,
            duration: 1
        })
                
        // Lanjutan animasi untuk section lainnya
        gsap.from('#countdown', { scrollTrigger: { trigger: '#countdown', start: 'top 80%' }, opacity: 0, scale: 0.9, duration: 1 });
        gsap.from('#hadiah > *', { scrollTrigger: { trigger: '#hadiah', start: 'top 80%' }, opacity: 0, y: 50, duration: 1, stagger: 0.2 });
        gsap.from('footer > *', { scrollTrigger: { trigger: 'footer', start: 'top 90%' }, opacity: 0, y: 50, duration: 1, stagger: 0.2 });
    }

    // Kode countdown dan copy-paste tetap sama...
    const weddingDate = new Date('2025-09-13T09:00:00').getTime();
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "<h3 class='font-heading text-2xl text-primary'>Acara Telah Berlangsung</h3>";
            return;
        }
        document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);

    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        const accountNumber = document.getElementById('account-number').innerText;
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = 'Berhasil Disalin! <i class="fas fa-check"></i>';
                    setTimeout(() => { this.innerHTML = originalText; }, 2000);
                })
                .catch(err => {
                    console.error('Gagal menyalin: ', err);
                    alert('Gagal menyalin. Silakan salin manual.');
                });
        });
    }
});