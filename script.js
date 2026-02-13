// --- ส่วนตั้งค่าข้อความ ---
// แก้ไขข้อความที่จะบอกรักตรงนี้ได้เลย (ใช้ \n เพื่อขึ้นบรรทัดใหม่)
const loveMessage = "ขอบคุณที่เข้ามาเป็นเรื่องราวดีๆ\nในชีวิตของพี่นะ\nขอให้ทุกวันเป็นวันที่สดใส\nรักหนูที่สุดเลย 💖\nHappy Valentine's day";
const speed = 50; // ความเร็วในการพิมพ์ (มิลลิวินาที)

const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('openBtn');
const resetBtn = document.getElementById('resetBtn');
const typewriterElement = document.getElementById('typewriter');
let i = 0;
let isOpened = false;

// ==========================================
// --- ส่วนควบคุม Slideshow รูปภาพพื้นหลัง ---
// ==========================================
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const slideInterval = 5000; // เปลี่ยนรูปทุกๆ 5 วินาที (5000ms)

function nextSlide() {
    // เอารูปปัจจุบันออก
    slides[currentSlide].classList.remove('active');
    // คำนวณรูปถัดไป (ถ้าถึงรูปสุดท้ายให้วนกลับมารูปแรก)
    currentSlide = (currentSlide + 1) % slides.length;
    // แสดงรูปถัดไป
    slides[currentSlide].classList.add('active');
}

// เริ่มต้นการทำงานของ Slideshow ถ้ามีรูปภาพมากกว่า 1 รูป
if (slides.length > 1) {
    setInterval(nextSlide, slideInterval);
}
// ==========================================


openBtn.addEventListener('click', () => {
    if (!isOpened) {
        envelope.classList.add('open');
        openBtn.classList.add('hidden');
        isOpened = true;
        setTimeout(() => { typeWriter(); }, 2000); 
        setTimeout(() => {
            resetBtn.classList.remove('hidden');
        }, 5000 + (loveMessage.length * speed));
    }
});

resetBtn.addEventListener('click', () => {
    envelope.classList.remove('open');
    resetBtn.classList.add('hidden');
    openBtn.classList.remove('hidden');
    typewriterElement.innerHTML = "";
    i = 0;
    isOpened = false;
});

function typeWriter() {
    if (i < loveMessage.length) {
        if(loveMessage.charAt(i) === '\n') {
            typewriterElement.innerHTML += '<br>';
        } else {
            typewriterElement.innerHTML += loveMessage.charAt(i);
        }
        i++;
        setTimeout(typeWriter, speed);
    }
}

// --- Canvas Floating Hearts (เหมือนเดิม) ---
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let width, height, hearts = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.velocity = { x: (Math.random() - 0.5) * 1, y: Math.random() * -2 - 1 };
        this.size = Math.random() * 15 + 5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(255, ${Math.floor(Math.random() * 50) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${this.opacity})`;
        this.rotation = Math.random() * 360;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        let topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size * 1.3);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += 1;
        if (this.y < -50) { this.y = height + 50; this.x = Math.random() * width; }
    }
}

function init() {
    hearts = [];
    for (let i = 0; i < 50; i++) hearts.push(new Heart());
}
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(heart => { heart.draw(); heart.update(); });
}
init();
animate();
