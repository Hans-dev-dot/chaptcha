const svgCaptcha = require('svg-captcha');

let currentCaptcha = null;
let failedAttempts = 0;
let lastFailedAttemptTime = null;

exports.createCaptcha = (req, res) => {

  // Buat captcha baru setiap kali endpoint ini dipanggil
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    background: '#f0f0f0'
  });

  currentCaptcha = captcha;

  // Kirim data captcha dalam format SVG sebagai respons
  res.type('svg');
  res.status(200).send(captcha.data);
};

exports.verifyCaptcha = (req, res) => {

  // Destructure userInput dari req.body
  const { userInput } = req.body;

  // Cek apakah ada percobaan gagal yang perlu menunggu
  if (failedAttempts >= 3) {
    const now = new Date();
    if (lastFailedAttemptTime && (now - lastFailedAttemptTime) < 3 * 60 * 1000) {
      // Masih dalam periode penundaan
      const remainingTime = Math.ceil((3 * 60 * 1000 - (now - lastFailedAttemptTime)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Silakan tunggu ${remainingTime} detik sebelum mencoba lagi.`
      });
    } else {
      // Reset percobaan gagal setelah 3 menit
      failedAttempts = 0;
    }
  }

  // Ambil teks captcha yang disimpan
  const storedCaptcha = currentCaptcha;

  // Verifikasi apakah captcha ada
  if (!storedCaptcha || !storedCaptcha.text) {
    return res.status(400).json({ success: false, message: 'Captcha tidak tersedia' });
  }

  // Lakukan validasi captcha
  const isCaptchaValid = userInput === storedCaptcha.text;

  // Reset captcha saat ini setelah verifikasi
  currentCaptcha = null;

  if (isCaptchaValid) {
    // Reset jumlah percobaan gagal setelah berhasil
    failedAttempts = 0;
    return res.status(200).json({ success: true, message: 'Captcha valid' });
  } else {
    // Tambahkan jumlah percobaan gagal
    failedAttempts++;
    // Set waktu percobaan gagal terakhir
    lastFailedAttemptTime = new Date();
    // Jika sudah mencapai 3 kali percobaan, informasikan untuk menunggu
    if (failedAttempts >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Anda telah mencoba 3 kali yang salah. Silakan tunggu 3 menit sebelum mencoba lagi.'
      });
    } else {
      return res.status(400).json({ success: false, message: 'Captcha tidak valid' });
    }
  }
};
