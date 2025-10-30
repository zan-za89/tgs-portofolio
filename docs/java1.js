document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const modal = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescriptionText = document.getElementById('modalDescriptionText');
    const modalImagesContainer = document.getElementById('modalImagesContainer');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const typingTextElement = document.getElementById('typingText');
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-button');
    const mainLogo = document.getElementById('mainLogo');
    
    // Terminal elements
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    
    // Statistics elements
    const statProyek = document.getElementById('stat-proyek'); 
    const statSertifikat = document.getElementById('stat-sertifikat');
    const statPrestasi = document.getElementById('stat-prestasi');
    const statOrganisasi = document.getElementById('stat-organisasi'); 

    const fullText = "Active in IRC ITPLN, focusing on Data Engineering, Scientific Research, and technological solution implementation. My interests also strongly include IoT, Robotics, Machine Learning, and Artificial Intelligence (AI).";

    
    // 1. TYPING EFFECT 
    
    let typingTimeout;
    const startTyping = (text, element, delay = 30) => {
        clearTimeout(typingTimeout);
        let charIndex = 0;
        element.textContent = '';
        element.classList.add('typing-cursor');
        
        const type = () => {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                typingTimeout = setTimeout(type, delay);
            } else {
                element.classList.remove('typing-cursor');
            }
        };
        type();
    };

    
    // 2. DYNAMIC STATISTIC COUNTER 
    
    const updateProjectStats = (stats) => {
        if (statProyek) statProyek.textContent = stats.proyek;
        if (statSertifikat) statSertifikat.textContent = stats.sertifikat;
        if (statPrestasi) statPrestasi.textContent = stats.prestasi;
    };

    
    // 3. FILTER PROJECT (FIXED DUAL TAGGING & COUNTING FOR STATS)
   
    
    const runFilter = (filterTag) => {
        // Inisialisasi hitungan (proyek akan menghitung event dan riset)
        let currentStats = { proyek: 0, sertifikat: 0, prestasi: 0 }; 

        // Set active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.filter-button[data-filter="${filterTag}"]`);
        if(activeButton) activeButton.classList.add('active');

        projectCards.forEach(card => {
            const type = card.getAttribute('data-type'); 
            
            // Logika untuk Dual Tagging (Memecah data-tags)
            const tagsAttribute = card.getAttribute('data-tags');
            const tagsArray = tagsAttribute ? tagsAttribute.split(',').map(tag => tag.trim()) : [];

            let isVisible = false;

            // LOGIKA VISIBILITAS DUAL:
            if (filterTag === 'all') {
                isVisible = true; 
            } else if (type === filterTag) {
                // Cek Kategori Utama (e.g., type='riset' cocok dengan filter='riset')
                isVisible = true; 
            } else if (tagsArray.includes(filterTag)) {
                // Cek Kategori Sekunder (e.g., tags='prestasi' cocok dengan filter='prestasi')
                isVisible = true; 
            }

            if (isVisible) {
                // Tampilkan card
                card.style.display = 'block'; 
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';

                // PENGHITUNGAN
                
                // 1. Hitung ke Proyek (Writing and Research): Jika tipenya riset, event, atau proyek
                if (type === 'riset' || type === 'event' || type === 'proyek') {
                    currentStats.proyek++; 
                } 
                
                // 2. Hitung ke Prestasi: Jika tipenya 'prestasi' ATAU memiliki tag 'prestasi'
                if (type === 'prestasi' || tagsArray.includes('prestasi')) {
                    currentStats.prestasi++;
                } 
                
                // 3. Hitung ke Sertifikat: Jika tipenya sertifikat
                if (type === 'sertifikat') {
                    currentStats.sertifikat++;
                } 

            } else {
                // Sembunyikan card
                card.style.display = 'none';
                card.style.opacity = 0;
            }
        });
        
        updateProjectStats(currentStats);
    }
    
    // Attach event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterTag = button.getAttribute('data-filter');
            runFilter(filterTag);
        });
    });

    // Panggil runFilter dengan sedikit delay untuk memastikan semua elemen DOM proyek terhitung
    setTimeout(() => {
        runFilter('all'); 
    }, 100); 


    
    // 4. TERMINAL LOGIC (TIDAK DIUBAH)
    
    const commands = {
        'help': () => {
            addOutput('--- Available Commands ---', '#38bdf8');
            addOutput('  help   - Tampilkan daftar perintah.');
            addOutput('  stats  - Tampilkan statistik pencapaian saat ini.');
            addOutput('  whoami - Tampilkan ringkasan profil.');
            addOutput('  clear  - Bersihkan layar terminal.');
            addOutput('  matrix - Aktifkan Matrix Mode (Double klik logo untuk shortcut).');
        },
        'stats': () => {
            const proyek = statProyek ? statProyek.textContent : '?';
            const sertifikat = statSertifikat ? statSertifikat.textContent : '?';
            const prestasi = statPrestasi ? statPrestasi.textContent : '?';
            const organisasi = statOrganisasi ? statOrganisasi.textContent : '?';
            
            addOutput('--- Statistik Kunci (Tampilan Saat Ini) ---', '#38bdf8');
            addOutput(`[INFO] Proyek Data/Riset: ${proyek}`);
            addOutput(`[INFO] Sertifikat Pelatihan: ${sertifikat}`);
            addOutput(`[INFO] Prestasi Kompetisi: ${prestasi}`);
            addOutput(`[INFO] Organisasi (Ex/Current): ${organisasi}`);
            addOutput('------------------------------------------------', '#38bdf8');
        },
        'whoami': () => {
            addOutput('Nama: Muh. Razzan Rezqy Pratama', '#a78bfa');
            addOutput('Peran: Mahasiswa Teknik Informatika');
            addOutput('Fokus: Big Data Engineering & Riset Ilmiah');
        },
        'clear': () => {
            terminalOutput.innerHTML = '';
            addOutput('Terminal Cleared.', '#94a3b8');
        },
        'matrix': () => {
            addOutput('Initiating Matrix Mode...', '#00ff41');
            html.classList.add('dark', 'matrix');
            mainLogo.textContent = 'SYSTEM ACTIVE';
        }
    };

    const addOutput = (text, color = '#00ff41') => {
        const textHTML = color === 'transparent' ? text : `<span style="color:${color};">${text}</span>`;
        terminalOutput.innerHTML += `${textHTML}<br/>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight; 
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputCommand = terminalInput.value.trim().toLowerCase();
            const prompt = `<span class="pl-2 font-semibold text-xs text-cyan-400">guest@user ></span> ${inputCommand}`;
            addOutput(prompt, 'transparent'); 

            if (commands[inputCommand]) {
                commands[inputCommand]();
            } else {
                addOutput(`Error: Command '${inputCommand}' not found. Type 'help' for available commands.`, '#f87171');
            }

            terminalInput.value = ''; 
        }
    });

    
    // 5. OTHER LOGIC (Modal, Animation, Tilt, dll.)
        // SCROLL PROGRESS BAR (TIDAK DIUBAH)
    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 4px; background-color: var(--accent-blue); z-index: 50; transition: width 0.1s linear;';
    document.body.prepend(progressBar);
    
    const updateProgressBar = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
        
        if (scrolled > 100) { 
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateProgressBar);
    
    // THEME & MATRIX MODE
    const applyTheme = (theme) => {
        html.classList.remove('matrix', 'dark');
        if (theme === 'matrix') {
            html.classList.add('dark', 'matrix');
            document.getElementById('darkModeIcon').classList.replace('fa-sun', 'fa-moon');
        } else if (theme === 'dark') {
            html.classList.add('dark');
            document.getElementById('darkModeIcon').classList.replace('fa-sun', 'fa-moon');
        } else {
            document.getElementById('darkModeIcon').classList.replace('fa-moon', 'fa-sun');
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'dark');
    startTyping(fullText, typingTextElement, 30);
    
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        let currentTheme = html.classList.contains('matrix') ? 'dark' : (html.classList.contains('dark') ? 'light' : 'dark');
        if (html.classList.contains('matrix')) currentTheme = 'dark'; 
        
        applyTheme(currentTheme);
        if (!html.classList.contains('matrix')) {
            startTyping(fullText, typingTextElement, 30);
        }
    });

    mainLogo.addEventListener('dblclick', () => {
        const isMatrix = html.classList.toggle('matrix');
        
        if (isMatrix) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'matrix');
            mainLogo.textContent = 'SYSTEM ACTIVE';
            startTyping('ACCESS GRANTED. INITIATING DATA FLOW...', typingTextElement, 20);
        } else {
            mainLogo.textContent = 'Muh. Razzan P.';
            localStorage.removeItem('theme');
            applyTheme('dark'); 
            startTyping(fullText, typingTextElement, 30);
        }
    });
    
    // MODAL LOGIC 
    document.querySelectorAll('.clickable-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title') || 'Detail Item';
            const desc = item.getAttribute('data-description') || 'Deskripsi tidak tersedia.';
            
            let images = [];
            const imagesJson = item.getAttribute('data-images');

            if (imagesJson) {
                try {
                    images = JSON.parse(imagesJson.replace(/'/g, '"'));
                } catch (e) {
                    images = [imagesJson];
                }
            }
            
            modalTitle.textContent = title;
            modalDescriptionText.textContent = desc;
            modalImagesContainer.innerHTML = ''; 

            const docSection = document.querySelector('.modal-documentation-section');
            
            if (images && images.length > 0 && images[0] && images[0] !== 'null' && images[0] !== '[]') {
                docSection.style.display = 'block';
                modalImagesContainer.classList.add('modal-images-scroll');
                
                images.forEach((img, index) => {
                    const imgDiv = document.createElement('div');
                    imgDiv.classList.add('modal-image-item', 'rounded-lg', 'shadow-md', 'p-2', 'border'); 
                    imgDiv.style.borderColor = 'var(--border-color)';
                    imgDiv.style.backgroundColor = 'var(--bg-card)';
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = img;
                    imgElement.alt = `Dokumentasi ${index + 1}`;
                    imgElement.classList.add('w-full', 'h-auto', 'object-cover', 'rounded-lg');

                    const caption = document.createElement('p');
                    caption.classList.add('text-xs', 'text-secondary', 'text-center', 'mt-2');
                    caption.textContent = `Dokumen ${index + 1}`;

                    imgDiv.appendChild(imgElement);
                    imgDiv.appendChild(caption);
                    modalImagesContainer.appendChild(imgDiv);

                    // LOGIKA LIGHTBOX
                    imgDiv.style.cursor = 'pointer'; 
                    imgDiv.addEventListener('click', () => {
                        const lightbox = document.createElement('div');
                        lightbox.id = 'lightbox-overlay';
                        lightbox.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 100; display: flex; justify-content: center; align-items: center; cursor: pointer;';

                        const bigImage = document.createElement('img');
                        bigImage.src = img;
                        bigImage.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; box-shadow: 0 0 20px rgba(255,255,255,0.2);';

                        lightbox.appendChild(bigImage);
                        document.body.appendChild(lightbox);

                        lightbox.addEventListener('click', () => {
                            document.body.removeChild(lightbox);
                        });
                    });
                });
            } else {
                docSection.style.display = 'none';
                modalImagesContainer.classList.remove('modal-images-scroll');
            }

            modal.classList.add('open');
        });
    });
    
    modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        modal.classList.remove('open');
    });

    modal.addEventListener('click', e => { 
        if (e.target === modal) {
            modal.classList.remove('open'); 
        }
    });
    
    // FADE IN ANIMATION 
    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up').forEach(el => fadeInObserver.observe(el));
    
    // 3D TILT EFFECT 
    const heroContainer = document.getElementById('hero-intro-content');
    if (heroContainer) { 
        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((centerY - y) / centerY) * 3; 
            const rotateY = ((x - centerX) / centerX) * 3;  

            heroContainer.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.01)
            `;
        });
        
        heroContainer.addEventListener('mouseleave', () => {
            heroContainer.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    }
});