"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeAtWorkService = void 0;
class TimeAtWorkService {
    constructor(timeRepository) {
        this.timeRepository = timeRepository;
    }
    async getTimeAtWorkData(user, timezone = 'GMT+1') {
        const punchInRecord = await this.timeRepository.findPunchInRecord(user.id);
        const punchedIn = !!punchInRecord && !punchInRecord.punchOutTime;
        const now = new Date();
        const weekStart = this.getWeekStart(now);
        const weekEnd = this.getWeekEnd(now);
        const weeklyHours = await this.timeRepository.findWeeklyHours(user.id, weekStart, weekEnd);
        const weekData = this.formatWeekData(weeklyHours, weekStart);
        let todayHours = { hours: 0, minutes: 0, totalMinutes: 0 };
        if (punchedIn && punchInRecord.punchInTime) {
            todayHours = this.calculateTodayHours(punchInRecord.punchInTime, now);
        }
        return {
            punchedIn,
            punchInTime: punchedIn && punchInRecord.punchInTime
                ? punchInRecord.punchInTime.toISOString()
                : '',
            timezone,
            todayHours,
            weekData,
            weekRange: {
                start: this.formatDate(weekStart),
                end: this.formatDate(weekEnd),
            },
        };
    }
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }
    getWeekEnd(date) {
        const weekStart = this.getWeekStart(date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return weekEnd;
    }
    calculateTodayHours(punchInTime, now) {
        const diffMs = now.getTime() - punchInTime.getTime();
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return { hours, minutes, totalMinutes };
    }
    formatWeekData(weeklyHours, weekStart) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(currentDate.getDate() + i);
            const dateStr = this.formatDate(currentDate);
            const dayData = weeklyHours.find((h) => this.formatDate(new Date(h.date)) === dateStr);
            weekData.push({
                date: dateStr,
                day: days[i],
                hours: dayData?.hours || 0,
                minutes: dayData?.minutes || 0,
            });
        }
        return weekData;
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}
exports.TimeAtWorkService = TimeAtWorkService;
//# sourceMappingURL=time-at-work.service.js.map