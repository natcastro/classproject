export class CanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d", { desynchronized: true });
        this.width = 0;
        this.height = 0;

        // Handle High DPI
        this.dpr = window.devicePixelRatio || 1;

        window.addEventListener("resize", () => this.resize());
        this.resize();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.drawHouseGuide();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawHouseGuide();
    }

    drawHouseGuide() {
        const w = this.width * 0.35;
        const h = this.height * 0.35;
        const x = (this.width - w) / 2;
        const y = (this.height - h) / 2 + (h * 0.1); // slightly lower

        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        this.ctx.lineWidth = 4;

        // Draw House
        this.ctx.beginPath();
        // Base
        this.ctx.rect(x, y + h * 0.35, w, h * 0.65);
        // Roof
        this.ctx.moveTo(x - 20, y + h * 0.35);
        this.ctx.lineTo(x + w / 2, y);
        this.ctx.lineTo(x + w + 20, y + h * 0.35);
        this.ctx.stroke();

        this.ctx.restore();
    }

    // Draw a segment using quadratic curves for smoothness if we had history,
    // but for immediate feedback we'll stick to lines or simple curves.
    // To support pressure, we set lineWidth based on pressure.
    drawStroke(x1, y1, x2, y2, pressure = 0.5) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);

        // Dynamic width based on pressure
        // Base width 2, max extra 4 depending on pressure
        this.ctx.lineWidth = 2 + (pressure * 4);
        this.ctx.strokeStyle = "#000000";
        this.ctx.stroke();
    }
}
