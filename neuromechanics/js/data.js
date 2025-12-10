export class DataManager {
    constructor() {
        this.dataLog = [];
        this.startTime = Date.now();
    }

    logStroke(mode, strokeId, realX, realY, drawX, drawY, pressure) {
        this.dataLog.push({
            timestamp: Date.now(),
            relativeTime: performance.now(),
            mode: mode,
            strokeId: strokeId,
            realX: parseFloat(realX.toFixed(2)),
            realY: parseFloat(realY.toFixed(2)),
            drawX: parseFloat(drawX.toFixed(2)),
            drawY: parseFloat(drawY.toFixed(2)),
            pressure: parseFloat(pressure.toFixed(3))
        });
    }

    clear() {
        this.dataLog = [];
    }

    downloadCSV() {
        if (this.dataLog.length === 0) return false;

        let csv = "timestamp,relativeTime,mode,strokeId,realX,realY,drawX,drawY,pressure\n";
        this.dataLog.forEach(row => {
            csv += `${row.timestamp},${row.relativeTime},${row.mode},${row.strokeId},${row.realX},${row.realY},${row.drawX},${row.drawY},${row.pressure}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `visuomotor_data_${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
    }
}
