/*
This is a simple clock timer class that triggers callbacks on each second tick and at the 
half-second mark. Suited for use with a clock display.


Usage:

const clock1 = new Clock(
    (now) => {
        // do second tick actions
    },
    (now) => {
        // do half-second actions
    }
);

clock1.start();


*/


class ClockTimer {
    constructor(onTick, onHalfSecond) {
        this.onTick = onTick || function () {};
        this.onHalfSecond = onHalfSecond || function () {};
        this.lastSecond = null;
        this.running = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sleepWithHalfway(ms, onHalfway) {
        return new Promise(resolve => {
            const halfway = ms / 2;

            setTimeout(() => {
                if (typeof onHalfway === "function") {
                    onHalfway();
                }
            }, halfway);

            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    async start() {
        this.running = true;
        while (this.running) {
            const now = new Date();
            const currentSecond = now.getSeconds();

            if (currentSecond !== this.lastSecond) {
                this.lastSecond = currentSecond;

                // 🕒 Tick callback
                await this.onTick(now);

                // ⏱ Halfway callback
                await this.sleepWithHalfway(1000, () => {
                    this.onHalfSecond(now);
                });
            }

            await this.sleep(100);
        }
    }

    stop() {
        this.running = false;
    }
}
