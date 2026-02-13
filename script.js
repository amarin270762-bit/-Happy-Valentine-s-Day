document.addEventListener('DOMContentLoaded', () => {
    const seal = document.getElementById('seal');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const letter = document.getElementById('letter');
    const typeWriterElement = document.getElementById('typewriter-text');
    const signatureElement = document.getElementById('signature');
    const finalImageElement = document.getElementById('final-image'); // เพิ่มตัวแปร
    const bgContainer = document.getElementById('bg-container');

    const texts = [
        "สวัสดีวันแห่งความรัก",
        "ขอบคุณที่หนูเข้ามาเป็นเรื่องดีๆในชีวิต",
        "ตอนนี้ก็ 6 ปีแล้วเนอะ",
        "ขอให้วันนี้เป็นวันที่ดีสำหรับหนู",
        "พี่รักหนูที่สุดเลยนะคะ"
    ];

    let isEnvelopeOpen = false;
    let isLetterPulled = false;

    // 1. เปิดซอง
    seal.addEventListener('click', () => {
        if (!isEnvelopeOpen) {
            envelopeWrapper.classList.add('open');
            isEnvelopeOpen = true;
        }
    });

    // 2. ดึงจดหมาย
    letter.addEventListener('click', () => {
        if (isEnvelopeOpen && !isLetterPulled) {
            letter.classList.add('pulled');
            envelopeWrapper.classList.add('pulled-state');
            isLetterPulled = true;

            setTimeout(() => {
                startTypewriter(0, 0);
            }, 800);
        }
    });

    // ฟังก์ชันพิมพ์ข้อความ
    function startTypewriter(lineIndex, charIndex) {
        if (lineIndex < texts.length) {
            if (charIndex < texts[lineIndex].length) {
                typeWriterElement.innerHTML += texts[lineIndex].charAt(charIndex);
                setTimeout(() => startTypewriter(lineIndex, charIndex + 1), 50);
            } else {
                typeWriterElement.innerHTML += "<br>";
                
                // เช็คว่าจบบรรทัดสุดท้ายหรือยัง
                if (lineIndex === texts.length - 1) {
                    // จบแล้ว -> รอ 0.5 วิ -> โชว์ชื่อ
                    setTimeout(() => {
                        signatureElement.classList.add('show');
                        
                        // หลังจากโชว์ชื่อ -> รออีก 1 วิ -> โชว์รูปสุดท้าย
                        setTimeout(() => {
                            finalImageElement.classList.add('show');
                        }, 1000);
                        
                    }, 500);
                }
                setTimeout(() => startTypewriter(lineIndex + 1, 0), 500);
            }
        }
    }

    // ส่วนสร้างหัวใจลอย (3 รูป เหมือนเดิม)
    function createFloatingElements() {
        const el = document.createElement('div');
        const isPhoto = Math.random() < 0.25; 
        
        if (isPhoto) {
            el.classList.add('base-photo-heart');
            const photoClasses = ['photo-1', 'photo-2', 'photo-3'];
            const randomPhotoIndex = Math.floor(Math.random() * photoClasses.length);
            el.classList.add(photoClasses[randomPhotoIndex]);
        } else {
            el.classList.add('floating-heart');
            const colors = ['#e91e63', '#ff4081', '#f48fb1', '#d81b60'];
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        el.style.left = Math.random() * 100 + 'vw';
        
        if (!isPhoto) {
            const size = Math.random() * 20 + 10 + 'px';
            el.style.width = size;
            el.style.height = size;
        }

        el.style.animationDuration = Math.random() * 3 + 4 + 's';
        bgContainer.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 8000);
    }

    setInterval(createFloatingElements, 300);
});