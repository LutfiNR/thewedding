document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi AOS Library
    AOS.init({
        duration: 1000,     // Durasi animasi (ms)
        once: true,         // Animasi hanya sekali saat elemen muncul
        mirror: false       // Animasi tidak berulang saat scroll ke atas
    });

    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-invitation');
    const guestNameElement = document.getElementById('guest-name');
    const backgroundMusic = document.getElementById('background-music');
    const copyButtons = document.querySelectorAll('.copy-button');

    // 1. Mengambil nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');

    if (guestName) {
        // Ganti spasi URL (%20) menjadi spasi biasa
        guestNameElement.textContent = decodeURIComponent(guestName).replace(/\+/g, ' ');
    } else {
        guestNameElement.textContent = "Tamu Undangan"; // Default jika tidak ada nama
    }

    // 2. Logika untuk tombol "Buka Undangan"
    openButton.addEventListener('click', function() {
        // Sembunyikan cover dengan efek fade out
        cover.style.opacity = '0';
        setTimeout(() => {
            cover.style.display = 'none';
        }, 1000); // Waktu transisi 1 detik

        // Tampilkan konten utama
        mainContent.classList.remove('hidden');

        // Putar musik
        backgroundMusic.play().catch(error => {
            console.log("Autoplay musik diblokir oleh browser. Membutuhkan interaksi pengguna.");
        });

        // Scroll ke atas halaman utama
        window.scrollTo(0, 0);
    });

    // 3. Logika Hitung Mundur (Countdown)
    // Atur tanggal pernikahan Anda di sini (Tahun, Bulan-1, Tanggal, Jam, Menit, Detik)
    // Contoh: 28 Desember 2025, pukul 09:00 WIB
    const weddingDate = new Date(2025, 11, 28, 9, 0, 0).getTime(); 

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Perhitungan waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Tampilkan hasilnya di elemen yang sesuai
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

        // Jika waktu sudah habis
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById('countdown').innerHTML = "<h2 class='font-heading text-2xl text-primary'>Acara Sedang Berlangsung!</h2>";
        }
    }, 1000);

    // 4. Logika Copy Rekening
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountNumber = this.dataset.account;
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    // Simpan teks tombol asli
                    const originalText = this.innerHTML;
                    // Ubah teks tombol menjadi "Tersalin!"
                    this.innerHTML = 'Tersalin! <i class="fas fa-check"></i>';
                    
                    // Kembalikan ke teks asli setelah 2 detik
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Gagal menyalin nomor rekening: ', err);
                    alert('Gagal menyalin. Silakan salin manual: ' + accountNumber);
                });
        });
    });
});