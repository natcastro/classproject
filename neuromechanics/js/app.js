import { CanvasRenderer } from './canvas.js';
import { InputHandler } from './input.js';
import { DataManager } from './data.js';
import { UIHandler } from './ui.js';

class App {
    constructor() {
        this.data = new DataManager();
        this.canvas = new CanvasRenderer('canvas');
        this.ui = new UIHandler(this);
        this.input = new InputHandler(this.canvas, this.data, this.ui);

        // Initialize default mode
        this.input.setMode('baseline');

        console.log('App Initialized');
    }

    setMode(mode) {
        this.input.setMode(mode);
    }
}

// Start the app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
