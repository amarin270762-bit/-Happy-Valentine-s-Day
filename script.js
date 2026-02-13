// --- ส่วนตั้งค่าข้อความ ---
// แก้ไขข้อความที่จะบอกรักตรงนี้ได้เลย (ใช้ \n เพื่อขึ้นบรรทัดใหม่)
const loveMessage = "ขอบคุณที่เข้ามาเป็นเรื่องราวดีๆ\nในชีวิตของพี่นะ\nขอให้ทุกวันเป็นวันที่สดใส\nรักหนูที่สุดเลย 💖\nHappy Valentine's day";
const speed = 50; // ความเร็วในการพิมพ์ (มิลลิวินาที)

// ใส่ชื่อไฟล์รูปของคุณที่นี่ (ตรวจสอบนามสกุล .jpg / .png ให้ถูกต้องเป๊ะๆ นะครับ)
const userPhotoFiles = [
    'photo1.jpg',
    'photo2.jpg',
    'photo3.jpg' 
    // ถ้ามีรูปเพิ่ม ใส่ต่อท้ายได้เลยครับ
];

// ==========================================
// 2. ส่วนควบคุมซองจดหมาย (Interaction)
// ==========================================
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
// 3. ส่วน Canvas (หัวใจ + รูปภาพ) - แก้ใหม่ให้ชัวร์ขึ้น
// ==========================================
const canvas = document.getElementById('bgCanvas'); // ต้องตรงกับ id ใน html (บรรทัดที่ 15)
if (!canvas) {
    console.error("ไม่พบ Canvas! เช็คว่า id ใน HTML เป็น 'bgCanvas' หรือยังครับ");
}

const ctx = canvas.getContext('2d');
let width, height;
let floatingElements = []; // เก็บของที่จะลอยทั้งหมด

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Class: หัวใจ (Heart) ---
class Heart {
    constructor() {
        this.reset(true); // true = สุ่มตำแหน่งทั่วจอตอนเริ่ม
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 100;
        this.velocity = { 
            x: (Math.random() - 0.5) * 1.5, 
            y: (Math.random() * -1.5) - 0.5 
        };
        this.size = Math.random() * 20 + 5; // ขนาด 5-25
        this.opacity = Math.random() * 0.5 + 0.3;
        // สีโทนชมพู/แดง/ขาว
        this.color = `rgba(255, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${this.opacity})`;
        this.rotation = Math.random() * 360;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // สูตรวาดหัวใจ
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
        // ถ้าลอยพ้นขอบบน ให้รีเซ็ตกลับไปข้างล่าง
        if (this.y < -50) {
            this.reset(false);
        }
    }
}

// --- Class: รูปภาพวงกลม (PhotoBubble) ---
class PhotoBubble {
    constructor(imgElement) {
        this.img = imgElement;
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 150;
        // ลอยช้ากว่าหัวใจนิดหน่อย จะได้ดูมีมิติ
        this.velocity = { 
            x: (Math.random() - 0.5) * 1, 
            y: (Math.random() * -1) - 0.5 
        };
        // ขนาดใหญ่กว่าหัวใจ (40-80px)
        this.size = Math.random() * 40 + 40; 
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.6;
    }

    draw() {
        if (!this.img) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        ctx.beginPath();
        // วาดเป็นวงกลม (Circle Clip) - รองรับทุก Browser
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.closePath();
        
        ctx.save(); // Save ก่อน Clip
        ctx.clip();
        // วาดรูปภาพให้อยู่กึ่งกลาง
        ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore(); // Restore หลังวาดรูปเสร็จ

        // วาดขอบสีขาวฟุ้งๆ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;
        if (this.y < -100) {
            this.reset(false);
        }
    }
}

// ==========================================
// 4. เริ่มต้นทำงาน (Main Execution)
// ==========================================

function init() {
    floatingElements = [];
    
    // 1. สร้างหัวใจ 50 ดวงทันที (ไม่ต้องรอรูป)
    for (let i = 0; i < 50; i++) {
        floatingElements.push(new Heart());
    }

    // 2. เริ่ม Animation Loop ทันที
    animate();

    // 3. ทยอยโหลดรูปทีหลัง (Asynchronous Loading)
    if (userPhotoFiles.length > 0) {
        userPhotoFiles.forEach(file => {
            const img = new Image();
            img.src = file;
            
            // เมื่อรูปโหลดเสร็จ ค่อยสร้าง bubble ใส่เข้าไปในจอ
            img.onload = () => {
                // สร้างรูปนี้ลอยขึ้นมา 5 อัน (กระจายๆ กัน)
                for(let k=0; k<5; k++) {
                    floatingElements.push(new PhotoBubble(img));
                }
                console.log(`Loaded: ${file}`);
            };

            img.onerror = () => {
                console.error(`หาไฟล์รูปไม่เจอ: ${file} (เช็คชื่อไฟล์/นามสกุลดีๆ นะครับ)`);
            };
        });
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // เคลียร์หน้าจอ
    ctx.clearRect(0, 0, width, height);

    // วาดพื้นหลังสีชมพูจางๆ ทับเพื่อให้ดูนวลๆ (เอาออกได้ถ้าไม่ชอบ)
    // ctx.fillStyle = 'rgba(255, 240, 245, 0.2)';
    // ctx.fillRect(0, 0, width, height);

    // สั่งวาดทุกอย่าง
    floatingElements.forEach(el => {
        el.draw();
        el.update();
    });
}

// รันเลย!
init();
