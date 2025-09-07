document.addEventListener('DOMContentLoaded', function() {
    
    // Inisialisasi AOS (Animasi saat scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // FUNGSI UNTUK MEMBUKA FULLSCREEN
    function openFullscreen() {
        const elem = document.documentElement; // Targetnya adalah seluruh halaman HTML
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    // === ELEMEN-ELEMEN PENTING ===
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-invitation');
    const guestNameElement = document.getElementById('guest-name');
    const backgroundMusic = document.getElementById('background-music');
    const copyButton = document.getElementById('copy-button');
    const accountNumber = document.getElementById('account-number').innerText;

    // === MENGAMBIL NAMA TAMU DARI URL ===
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to');

        if (guestName) {
            guestNameElement.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
        } else {
            guestNameElement.textContent = "Tamu Undangan";
        }
    } catch (error) {
        console.error("Error processing URL parameters:", error);
        guestNameElement.textContent = "Tamu Undangan";
    }

    // === LOGIKA MEMBUKA UNDANGAN ===
    openButton.addEventListener('click', function() {
        // Panggil fungsi fullscreen saat tombol diklik
        openFullscreen();

        // 1. Buat cover menghilang (fade out)
        cover.classList.add('opacity-0');
        
        // 2. Setelah transisi selesai, sembunyikan cover sepenuhnya dan tampilkan konten utama
        setTimeout(() => {
            cover.style.display = 'none';
            mainContent.classList.remove('hidden');
            document.body.classList.remove('cover-active'); // Aktifkan scroll
            
            // Re-inisialisasi AOS agar animasi di konten utama berjalan
            AOS.refresh();
        }, 1000); // Sesuaikan dengan durasi transisi di CSS

        // 3. Putar musik latar
        backgroundMusic.play().catch(error => {
            console.log("Autoplay musik dicegah oleh browser.");
        });
    });

    // === LOGIKA HITUNG MUNDUR (COUNTDOWN) ===
    // Atur tanggal pernikahan Anda di sini: (TAHUN, BULAN-1, TANGGAL, JAM, MENIT, DETIK)
    const weddingDate = new Date(2025, 8, 13, 9, 0, 0).getTime(); // 13 September 2025, 09:00

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById('countdown').innerHTML = "<h3 class='font-heading text-2xl text-primary'>Acara Telah Berlangsung</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);

    // === LOGIKA SALIN NOMOR REKENING ===
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = 'Berhasil Disalin! <i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Gagal menyalin: ', err);
                alert('Gagal menyalin. Silakan salin manual.');
            });
    });

});