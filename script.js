// --- ส่วนตั้งค่าข้อความ ---
// แก้ไขข้อความที่จะบอกรักตรงนี้ได้เลย (ใช้ \n เพื่อขึ้นบรรทัดใหม่)
const loveMessage = "ขอบคุณที่เข้ามาเป็นเรื่องราวดีๆ\nในชีวิตของพี่นะ\nขอให้ทุกวันเป็นวันที่สดใส\nรักหนูที่สุดเลย 💖\nHappy Valentine's day";
const speed = 50; // ความเร็วในการพิมพ์ (มิลลิวินาที)

// --- ตัวแปรจัดการ DOM ---
const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('openBtn');
const resetBtn = document.getElementById('resetBtn');
const typewriterElement = document.getElementById('typewriter');
let i = 0;
let isOpened = false;

// --- ฟังก์ชันเปิดซองจดหมาย ---
openBtn.addEventListener('click', () => {
    if (!isOpened) {
        envelope.classList.add('open');
        openBtn.classList.add('hidden');
        isOpened = true;
        
        // รอให้กระดาษเด้งขึ้นมาเสร็จก่อนค่อยพิมพ์
        setTimeout(() => {
            typeWriter();
        }, 2000); 

        // หลังจากอ่านจบ แสดงปุ่มรีเซ็ต
        setTimeout(() => {
            resetBtn.classList.remove('hidden');
        }, 5000 + (loveMessage.length * speed));
    }
});

// --- ฟังก์ชันรีเซ็ต ---
resetBtn.addEventListener('click', () => {
    envelope.classList.remove('open');
    resetBtn.classList.add('hidden');
    openBtn.classList.remove('hidden');
    typewriterElement.innerHTML = "";
    i = 0;
    isOpened = false;
});

// --- ฟังก์ชันพิมพ์ข้อความทีละตัว (Typewriter Effect) ---
function typeWriter() {
    if (i < loveMessage.length) {
        // เช็คว่าถ้าเจอ \n ให้ใส่ <br> แทน
        if(loveMessage.charAt(i) === '\n') {
            typewriterElement.innerHTML += '<br>';
        } else {
            typewriterElement.innerHTML += loveMessage.charAt(i);
        }
        i++;
        setTimeout(typeWriter, speed);
    }
}

// ==========================================
// --- ส่วนของ Background Canvas (หัวใจลอย) ---
// ==========================================
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let hearts = [];

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
        this.velocity = {
            x: (Math.random() - 0.5) * 1, // ลอยซ้ายขวานิดหน่อย
            y: Math.random() * -2 - 1     // ลอยขึ้นข้างบน
        };
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
        
        // วาดรูปหัวใจด้วย Bezier Curves
        let topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size * 1.3); // ปลายแหลม
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += 1; // หมุนหัวใจเบาๆ

        if (this.y < -50) { // ถ้าลอยเลยขอบบน ให้รีเซ็ตกลับไปข้างล่าง
            this.y = height + 50;
            this.x = Math.random() * width;
        }
    }
}

function init() {
    hearts = [];
    for (let i = 0; i < 50; i++) { // จำนวนหัวใจบนหน้าจอ
        hearts.push(new Heart());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(heart => {
        heart.draw();
        heart.update();
    });
}

init();
animate();