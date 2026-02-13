// --- ส่วนตั้งค่าข้อความ ---
// แก้ไขข้อความที่จะบอกรักตรงนี้ได้เลย (ใช้ \n เพื่อขึ้นบรรทัดใหม่)
const loveMessage = "ขอบคุณที่เข้ามาเป็นเรื่องราวดีๆ\nในชีวิตของพี่นะ\nขอให้ทุกวันเป็นวันที่สดใส\nรักหนูที่สุดเลย 💖\nHappy Valentine's day";
const userPhotoFiles = [
    'photo1.jpg',
    'photo2.jpg', 
    'photo3.jpg',
    // 'my_cute_photo.png', 
];
const speed = 50; // ความเร็วในการพิมพ์ (มิลลิวินาที)

const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('openBtn');
const resetBtn = document.getElementById('resetBtn');
const typewriterElement = document.getElementById('typewriter');
let i = 0;
let isOpened = false;

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

// ==========================================
// --- ส่วนของ Canvas Background (หัวใจ + รูปภาพ) ---
// ==========================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let floatingElements = []; // เก็บทั้งหัวใจและรูปภาพรวมกัน

// โหลดรูปภาพทั้งหมดให้เสร็จก่อนเริ่มอนิเมชั่น
let loadedImages = [];
let imagesLoadedCount = 0;

function preloadImages(callback) {
    if (userPhotoFiles.length === 0) {
        callback();
        return;
    }
    userPhotoFiles.forEach((file) => {
        const img = new Image();
        img.src = file;
        img.onload = () => {
            imagesLoadedCount++;
            loadedImages.push(img);
            // ถ้าโหลดครบทุกรูปแล้ว ให้เรียกฟังก์ชัน callback (เพื่อเริ่ม init)
            if (imagesLoadedCount === userPhotoFiles.length) {
                callback();
            }
        };
        // กรณีโหลดรูปไม่ผ่าน ก็ให้นับว่าโหลดแล้ว เพื่อไม่ให้โปรแกรมค้าง
        img.onerror = () => {
             console.error("Cannot load image:", file);
             imagesLoadedCount++;
             if (imagesLoadedCount === userPhotoFiles.length) callback();
        }
    });
}


function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Class สำหรับหัวใจ (เหมือนเดิม) ---
class Heart {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.velocity = { x: (Math.random() - 0.5) * 1, y: Math.random() * -2 - 1 };
        // ขนาดหัวใจ (สูงสุดประมาณ 20)
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

// --- Class สำหรับรูปภาพลอย (ของใหม่!) ---
class FloatingPhoto {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 200; // เริ่มต้นต่ำกว่าหัวใจหน่อย
        this.velocity = { x: (Math.random() - 0.5) * 0.8, y: Math.random() * -1.5 - 0.5 }; // ลอยช้ากว่าหัวใจนิดนึง
        // ขนาดรูปภาพ: ใหญ่กว่าหัวใจประมาณ 2 เท่า (40px - 70px)
        this.size = Math.random() * 30 + 40; 
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5; // หมุนช้าๆ
        this.opacity = Math.random() * 0.3 + 0.5; // โปร่งแสงนิดๆ
        // สุ่มเลือกรูปจากที่โหลดไว้
        this.img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    }
    draw() {
        if (!this.img) return; // ป้องกัน error ถ้ารูปไม่มี
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity; // ตั้งค่าความโปร่งแสง
        // วาดรูปโดยให้จุดศูนย์กลางอยู่ที่ x,y (ต้องลบออกครึ่งนึงของขนาด)
        // และใส่ border radius ให้รูปดูกลมมน (ใช้ clip)
        ctx.beginPath();
        // สร้างกรอบวงกลม/สี่เหลี่ยมมนรอบรูป
        ctx.roundRect(-this.size/2, -this.size/2, this.size, this.size, 10);
        ctx.clip(); 
        // วาดรูป
        ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size);
        
        // เพิ่มขอบสีขาวบางๆ ให้รูปดูเด่นขึ้น (optional)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);

        ctx.restore();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;
        // ถ้ารูปหลุดจอไปข้างบน ให้วนกลับมาข้างล่างใหม่
        if (this.y < -100) { 
            this.y = height + 100; 
            this.x = Math.random() * width;
            // สุ่มรูปใหม่ตอนวนกลับมา
            this.img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
        }
    }
}

function init() {
    floatingElements = [];
    // สร้างหัวใจ 40 ดวง
    for (let i = 0; i < 40; i++) {
        floatingElements.push(new Heart());
    }
    // สร้างรูปภาพลอย 15 รูป (ถ้ามีรูปให้โหลด)
    if (loadedImages.length > 0) {
        for (let i = 0; i < 15; i++) {
            floatingElements.push(new FloatingPhoto());
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    // เคลียร์ canvas และวาดพื้นหลังสีชมพูอ่อนทับจางๆ ทุกเฟรมเพื่อให้ดูนวลๆ
    ctx.fillStyle = 'rgba(255, 240, 245, 0.4)'; 
    ctx.fillRect(0, 0, width, height);
    
    // วาดองค์ประกอบทั้งหมด
    floatingElements.forEach(el => {
        el.draw();
        el.update();
    });
}

// เริ่มต้น: โหลดรูปให้เสร็จก่อน แล้วค่อย init และ animate
preloadImages(() => {
    init();
    animate();
});
