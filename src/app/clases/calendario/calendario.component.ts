import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CalendarioService } from '../../core/services/calendario.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent implements OnInit {
  //modal
  mostrarModal: boolean = false;

  fechaActual: string = 'Calendario de clases';
  private currentDate?: Date;
  daysOfMonth: Array<{ day: number; status: 'inactive' | 'active' | 'next' }> =
    [];
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private calendarioService: CalendarioService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentDate = this.calendarioService.getCurrentDate();
    this.fechaActual = this.formatDate(this.currentDate);
    this.updateDaysOfMonth();
    this.calendarioService.currentDateChanged.subscribe((newDate: Date) => {
      this.currentDate = newDate;
      this.fechaActual = this.formatDate(newDate);
      this.updateDaysOfMonth();
    });
  }

  //evento click
  handleNextClick(): void {
    this.calendarioService.incrementMonth();
  }

  handlePrevClick(): void {
    this.calendarioService.decrementMonth();
  }

  //formatear el titulo
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric',
    };
    const monthAndYear = new Intl.DateTimeFormat('es-ES', options).format(date);
    const formattedDate = monthAndYear
      .replace(/\b\w+\b/g, (word) => word.toUpperCase())
      .replace(' DE', '');
    return formattedDate;
  }

  private updateDaysOfMonth(): void {
    this.daysOfMonth = this.calendarioService.getDaysOfMonth();
  }

  private formatDateForModal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  
  abrirModal(day: {
    day: number;
    status: 'inactive' | 'active' | 'next';
  }): void {
    if (this.currentDate) {
      const fechaSeleccionada = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day.day);
      this.cookieService.set('fecha', this.formatDateForModal(fechaSeleccionada));
      this.mostrarModal = true;      
    }
  }

  verHorario(): void {
    this.router.navigate(['home/calendario/clases']);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
