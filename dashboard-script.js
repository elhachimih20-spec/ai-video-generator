// Dashboard Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item')?.classList.add('active');
}

// Create Video Steps Navigation
let currentStep = 1;

function nextStep(stepNumber) {
    if (validateStep(currentStep)) {
        document.getElementById('step-' + currentStep).classList.remove('active');
        document.getElementById('step-' + stepNumber).classList.add('active');
        updateStepIndicator(stepNumber);
        currentStep = stepNumber;
    }
}

function previousStep(stepNumber) {
    document.getElementById('step-' + currentStep).classList.remove('active');
    document.getElementById('step-' + stepNumber).classList.add('active');
    updateStepIndicator(stepNumber);
    currentStep = stepNumber;
}

function validateStep(step) {
    if (step === 2) {
        const inputs = document.querySelectorAll('#step-2 input[required], #step-2 textarea[required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return false;
            }
        }
    }
    return true;
}

function updateStepIndicator(stepNumber) {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
}

// Template Selection
let selectedTemplate = null;

function selectTemplate(templateId) {
    selectedTemplate = templateId;
    document.querySelectorAll('.template-card').forEach(card => {
        card.style.border = '2px solid #e2e8f0';
    });
    event.target.closest('.template-card').style.border = '3px solid #6366f1';
}

// Generate Video
function generateVideo() {
    const title = document.querySelector('#step-2 input[placeholder*="عنوان"]')?.value;
    const description = document.querySelector('#step-2 textarea')?.value;
    const duration = document.querySelector('#step-2 select')?.value;

    if (!title || !description || !selectedTemplate) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    // Show loading modal
    document.getElementById('loading-modal').style.display = 'flex';

    // Prepare video data
    const videoData = {
        title: title,
        description: description,
        duration: duration,
        template: selectedTemplate,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage (for now)
    const videos = JSON.parse(localStorage.getItem('videos')) || [];
    videos.push(videoData);
    localStorage.setItem('videos', JSON.stringify(videos));

    // Simulate video generation (2-5 seconds)
    setTimeout(() => {
        document.getElementById('loading-modal').style.display = 'none';
        alert('✅ تم إنشاء الفيديو بنجاح!');
        
        // Reset form
        document.getElementById('step-1').classList.add('active');
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-3').classList.remove('active');
        document.getElementById('step-4').classList.remove('active');
        currentStep = 1;
        
        // Redirect to my videos
        showSection('my-videos');
    }, 3000);
}

// File Upload Handler
document.querySelectorAll('.file-upload').forEach(upload => {
    upload.addEventListener('click', function() {
        this.querySelector('input[type="file"]').click();
    });

    upload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = 'rgba(99, 102, 241, 0.1)';
    });

    upload.addEventListener('dragleave', function() {
        this.style.background = 'var(--light-bg)';
    });

    upload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = 'var(--light-bg)';
        const files = e.dataTransfer.files;
        console.log('Files uploaded:', files);
    });
});

// Load My Videos
function loadMyVideos() {
    const videos = JSON.parse(localStorage.getItem('videos')) || [];
    const videosGrid = document.querySelector('.videos-grid');
    
    if (videosGrid && videos.length > 0) {
        videosGrid.innerHTML = videos.map((video, index) => `
            <div class="video-card">
                <img src="https://via.placeholder.com/250x150?text=فيديو+${index + 1}" alt="Video">
                <div class="video-card-content">
                    <h4>${video.title}</h4>
                    <p>${video.duration} • 1080p</p>
                    <div class="video-status completed">✓ مكتمل</div>
                </div>
                <div class="video-card-actions">
                    <button class="btn-icon" title="تشغيل"><i class="fas fa-play"></i></button>
                    <button class="btn-icon" title="تحميل"><i class="fas fa-download"></i></button>
                    <button class="btn-icon" title="حذف" onclick="deleteVideo(${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
}

function deleteVideo(index) {
    const videos = JSON.parse(localStorage.getItem('videos')) || [];
    videos.splice(index, 1);
    localStorage.setItem('videos', JSON.stringify(videos));
    loadMyVideos();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMyVideos();
    
    // Set default active section
    showSection('home');
    
    // Add smooth transitions
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
});

// Color picker initialization
document.querySelectorAll('input[type="color"]').forEach(picker => {
    picker.addEventListener('change', function() {
        console.log('Color changed to:', this.value);
    });
});

// Form submission handlers
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

// Notification badge
function addNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);