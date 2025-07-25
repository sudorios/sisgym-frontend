import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private currentDate: Date = new Date();
  currentDateChanged = new Subject<Date>();

  constructor() {}

  getCurrentDate(): Date {
    return this.currentDate;
  }

  setCurrentDate(date: Date): void {
    this.currentDate = date;
    this.currentDateChanged.next(this.currentDate);
  }

  incrementMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDateChanged.next(this.currentDate);
  }

  decrementMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDateChanged.next(this.currentDate);
  }

  getDaysOfMonth(): { day: number; status: 'inactive' | 'active' | 'next' }[] {
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    ).getDay();
    const lastDateofMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();
    const today = new Date().getDate();

    const days: { day: number; status: 'inactive' | 'active' | 'next' }[] = [];

    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({ day: lastDateofMonth - i + 1, status: 'inactive' });
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const status: 'inactive' | 'active' | 'next' =
        i === today && this.currentDate.getMonth() === new Date().getMonth()
          ? 'active'
          : 'next';
      days.push({ day: i, status });
    }

    const remainingDays = 35 - days.length; // 5 filas x 7 columnas
    if (remainingDays > 0) {
      const daysOfNextMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 2,
        0
      ).getDate();
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i <= daysOfNextMonth ? i : i - daysOfNextMonth,
          status: 'inactive',
        });
      }
    }

    if (days.length > 35) {
      const remainingDays = 42 - days.length; // 6 filas x 7 columnas
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, status: 'inactive' });
      }
    }
    return days;
  }
}
