export class InputHandler {
    constructor(canvasRenderer, dataManager, uiHandler) {
        this.renderer = canvasRenderer;
        this.dataManager = dataManager;
        this.ui = uiHandler; // Optional, for errors/feedback if needed
        this.canvas = canvasRenderer.canvas;

        this.isDrawing = false;

        // Coordinates tracking
        this.lastRealX = 0;
        this.lastRealY = 0;
        this.lastDrawX = 0;
        this.lastDrawY = 0;

        this.strokeId = 0;

        // Mode state
        this.mode = 'baseline'; // baseline, perturbation, aftereffect
        this.perturbationAngle = 30 * Math.PI / 180; // 30 degrees

        this.setupListeners();
    }

    setMode(newMode) {
        this.mode = newMode;
    }

    setupListeners() {
        // We bind to the canvas for initial touch, but window for move/up to catch calling outside
        this.canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));

        window.addEventListener("pointermove", this.onPointerMove.bind(this));
        window.addEventListener("pointerup", this.onPointerUp.bind(this));
        window.addEventListener("pointercancel", this.onPointerUp.bind(this));
    }

    getPoint(e) {
        // We need coordinates relative to the canvas
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            pressure: e.pressure !== undefined ? e.pressure : 0.5
        };
    }

    onPointerDown(e) {
        // Allow ONLY the canvas to capture this
        if (e.target !== this.canvas) return;

        // Critical: Prevent default browser actions (scrolling, zooming, selection)
        e.preventDefault();

        this.isDrawing = true;
        this.strokeId++;

        try {
            this.canvas.setPointerCapture(e.pointerId);
        } catch (err) {
            console.warn("Capture failed", err);
        }

        const { x, y } = this.getPoint(e);

        this.lastRealX = x;
        this.lastRealY = y;
        this.lastDrawX = x;
        this.lastDrawY = y;

        // Start path
        this.renderer.ctx.beginPath();
        this.renderer.ctx.moveTo(x, y);
    }

    onPointerMove(e) {
        if (!this.isDrawing) return;

        // Critical: Prevent native gestures while drawing
        if (e.cancelable) e.preventDefault();

        // Optional: Filter for pen only if strict requirements, but mouse/touch is good for testing
        // if (e.pointerType !== 'pen') return; 

        const { x: realX, y: realY, pressure } = this.getPoint(e);

        // Calculate Real Delta
        const dx = realX - this.lastRealX;
        const dy = realY - this.lastRealY;

        let drawX = realX;
        let drawY = realY;

        if (this.mode === 'perturbation') {
            // Rotate Delta
            const cos = Math.cos(this.perturbationAngle);
            const sin = Math.sin(this.perturbationAngle);

            const dxRot = dx * cos - dy * sin;
            const dyRot = dx * sin + dy * cos;

            // Apply rotated delta to the LAST VISUAL position
            drawX = this.lastDrawX + dxRot;
            drawY = this.lastDrawY + dyRot;
        } else {
            // Baseline/Aftereffect - usually 1:1 map
            // Note: Aftereffect implies NO perturbation, just observing after-effects on user behavior.
            drawX = this.lastDrawX + dx;
            drawY = this.lastDrawY + dy;
            // Or simpler: drawX = realX, drawY = realY. 
            // Using delta addition ensures consistancy with the perturbation logic flow.
        }

        // Render
        this.renderer.drawStroke(this.lastDrawX, this.lastDrawY, drawX, drawY, pressure);

        // Log
        this.dataManager.logStroke(
            this.mode,
            this.strokeId,
            realX,
            realY,
            drawX,
            drawY,
            pressure
        );

        // Update state
        this.lastRealX = realX;
        this.lastRealY = realY;
        this.lastDrawX = drawX;
        this.lastDrawY = drawY;
    }

    onPointerUp(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        // this.canvas.releasePointerCapture(e.pointerId); // Implicit usually
    }
}
