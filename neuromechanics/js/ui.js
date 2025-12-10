export class UIHandler {
    constructor(app) {
        this.app = app;

        // Elements
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.clearBtn = document.getElementById('clearBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.toast = document.getElementById('toast');

        this.setupEventListeners();
        this.showOnboarding();
    }

    setupEventListeners() {
        // Mode Switching
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setMode(mode);
            });
        });

        // Actions
        this.clearBtn.addEventListener('click', () => {
            this.app.canvas.clear();
            this.app.data.clear();
            this.showToast('Canvas Cleared', 'trash');
        });

        this.saveBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `drawing_${Date.now()}.png`;
            link.href = this.app.canvas.canvas.toDataURL();
            link.click();
            this.showToast('Drawing Saved', 'check');
        });

        this.downloadBtn.addEventListener('click', () => {
            const success = this.app.data.downloadCSV();
            if (success) {
                this.showToast('Data Downloaded', 'download');
            } else {
                this.showToast('No Data to Download', 'info');
            }
        });

        // Modal Dismiss
        document.getElementById('startBtn').addEventListener('click', () => {
            document.querySelector('.modal-overlay').classList.remove('active');
        });
    }

    setMode(mode) {
        // Update App State
        this.app.setMode(mode);

        // Update UI
        this.modeBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Optional: Show a toast for mode change
        const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);
        this.showToast(`Mode: ${modeName}`);
    }

    showToast(message, iconType = 'info') {
        // Simple icon mapping
        let iconSvg = '';
        if (iconType === 'check') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        } else if (iconType === 'trash') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        } else if (iconType === 'download') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16V12" stroke="currentColor" stroke-width="2"/><path d="M12 8H12.01" stroke="currentColor" stroke-width="2"/></svg>`;
        }

        this.toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        this.toast.classList.add('show');

        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }

    showOnboarding() {
        setTimeout(() => {
            document.querySelector('.modal-overlay').classList.add('active');
        }, 500);
    }
}
