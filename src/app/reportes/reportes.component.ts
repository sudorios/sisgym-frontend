import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FacturaService } from '../services/factura.service';
import { MatriculaService } from '../services/matricula.service';
import { AsistenciaService } from '../services/asistencia.service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements AfterViewInit {
  /*Modal */

  mostrarModal: boolean = false;
  tituloModal: string = 'Exportar reporte';
  mostrarDivExportar: boolean = false;
  selectReporte: string = '1';
  selectTipo: string = '1';
  botonEnviar: boolean = false;
  loading: boolean = false;

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  exportar(): void {
    if (this.selectReporte === '1' && this.selectTipo === '1') {
      this.generarExcelIngresos();
    } else if (this.selectReporte === '1' && this.selectTipo === '2') {
      this.generarPDFIngresos();
    } else if (this.selectReporte === '2' && this.selectTipo === '1') {
      this.excelMembresias();
    } else if (this.selectReporte === '2' && this.selectTipo === '2') {
      this.PDFMembresias();
    } else if (this.selectReporte === '3' && this.selectTipo === '1') {
      this.excelAsistencia();
    } else if (this.selectReporte === '3' && this.selectTipo === '2') {
      this.PDFAsistencia();
    }
  }

  private generarExcelIngresos(): void {
    const timestamp = new Date().getTime();
    const url = `http://localhost:8080/Sis_Gym/factura/ingresos.xlsx?timestamp=${timestamp}`;

    this.facturaService.generarExcel().subscribe(
      () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ingresos.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el Excel', error);
      }
    );
  }
  private excelAsistencia(): void {
    const timestamp = new Date().getTime();
    const url = `http://localhost:8080/Sis_Gym/factura/asistencia.xlsx?timestamp=${timestamp}`;

    this.asistenciaService.generarExcel().subscribe(
      () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'asistencia.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el Excel', error);
      }
    );
  }

  private excelMembresias(): void {
    const timestamp = new Date().getTime();
    const url = `http://localhost:8080/Sis_Gym/factura/membresias.xlsx?timestamp=${timestamp}`;
    this.matriculaService.generarExcel().subscribe(
      () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'membresias.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el Excel', error);
      }
    );
  }

  private generarPDFIngresos(): void {
    const timestamp = new Date().getTime();
    const randomValue = Math.random();
    const url = `http://localhost:8080/Sis_Gym/factura/ingresos.pdf?timestamp=${timestamp}&random=${randomValue}`;
    this.facturaService.generarPDF().subscribe(
      (pdfContent: Blob) => {
        const fileSize = pdfContent ? pdfContent.size : 0;
        const uniqueUrl = `${url}&size=${fileSize}`;

        window.open(uniqueUrl);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el PDF', error);
      }
    );
  }
  private PDFMembresias(): void {
    const timestamp = new Date().getTime();
    const randomValue = Math.random();
    const url = `http://localhost:8080/Sis_Gym/factura/membresias.pdf?timestamp=${timestamp}&random=${randomValue}`;
    this.matriculaService.generarPDF().subscribe(
      (pdfContent: Blob) => {
        const fileSize = pdfContent ? pdfContent.size : 0;
        const uniqueUrl = `${url}&size=${fileSize}`;
        window.open(uniqueUrl);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el PDF', error);
      }
    );
  }

  private PDFAsistencia(): void {
    const timestamp = new Date().getTime();
    const randomValue = Math.random();
    const url = `http://localhost:8080/Sis_Gym/factura/asistencia.pdf?timestamp=${timestamp}&random=${randomValue}`;
    this.asistenciaService.generarPDF().subscribe(
      (pdfContent: Blob) => {
        const fileSize = pdfContent ? pdfContent.size : 0;
        const uniqueUrl = `${url}&size=${fileSize}`;
        window.open(uniqueUrl);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al generar el PDF', error);
      }
    );
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.mostrarDivExportar = true;
    this.botonEnviar = true;
  }

  ingresos: any[] = [];
  membresiasCount: any[] = [];
  asistenciaCount: any[] = [];

  barChartLabels: string[] = [];
  barChartLegend = true;
  barChartData: any[] = [];

  doughnutChartLabels: string[] = [];
  doughnutChartData: number[] = [];

  lineChartLabels: string[] = [];
  lineChartData: any[] = [];

  @ViewChild('myChart') myChart!: ElementRef;
  @ViewChild('myChart2') doughnutChart!: ElementRef;
  @ViewChild('myLineChart') myLineChart!: ElementRef;

  constructor(
    private facturaService: FacturaService,
    private matriculaService: MatriculaService,
    private asistenciaService: AsistenciaService
  ) {}

  ngAfterViewInit(): void {
    this.obtenerIngresos();
    this.obtenerMembresiasCount();
    this.obtenerAsistenciaCount();
  }

  obtenerIngresos() {
    this.loading = true;
    this.facturaService.getIngresos().subscribe(
      (data) => {
        this.ingresos = data;
        this.procesarIngresosParaGrafico();
      },
      (error) => {
        console.error('Error al obtener ingresos:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  obtenerAsistenciaCount() {
    this.loading = true;
    this.asistenciaService.contarAsistencias().subscribe(
      (data) => {
        this.asistenciaCount = data;
        this.procesarAsistenciasParaGraficoLineal();
      },
      (error) => {
        console.error('Error al obtener asistencias:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  obtenerMembresiasCount() {
    this.loading = true;
    this.matriculaService.contarMembresias().subscribe(
      (data) => {
        this.membresiasCount = data;
        this.generarGraficoTorta();
      },
      (error) => {
        console.error('Error al obtener conteo de membresías:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  procesarIngresosParaGrafico() {
    const ultimos5Ingresos = this.ingresos.slice(-5);

    this.barChartLabels = ultimos5Ingresos.map(
      (ingreso) => `${ingreso.year}-${ingreso.month}`
    );

    this.barChartData = [
      {
        data: ultimos5Ingresos.map((ingreso) => ingreso.ingresos),
        label: 'Ingresos por mes',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'rgba(0, 255, 0, 1)',
        borderWidth: 1,
      },
    ];

    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.barChartLabels,
        datasets: this.barChartData,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: string | number) => `S/.${value}`,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Ingresos mensuales',
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 10,
            },
            color: 'rgba(0, 0, 0, 1)',
          },
        },
      },
    });
  }

  generarGraficoTorta() {
    this.doughnutChartLabels = this.membresiasCount.map(
      (membresia) => membresia.tipoMembresia
    );

    this.doughnutChartData = this.membresiasCount.map(
      (membresia) => membresia.cantidad
    );

    const ctxDoughnut = this.doughnutChart.nativeElement.getContext('2d');
    new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
        labels: this.doughnutChartLabels,
        datasets: [
          {
            data: this.doughnutChartData,
            backgroundColor: this.doughnutChartLabels.map((tipo) => {
              if (tipo === 'Gold') return 'rgba(255, 215, 0, 0.2)';
              if (tipo === 'Basico') return 'rgba(255, 0, 0, 0.2)';
              if (tipo === 'Platino') return 'rgba(0, 0, 255, 0.2)';
              return 'rgba(0, 0, 0, 0.2)';
            }),
            borderColor: this.doughnutChartLabels.map((tipo) => {
              if (tipo === 'Gold') return 'rgba(255, 215, 0, 1)';
              if (tipo === 'Basico') return 'rgba(255, 0, 0, 1)';
              if (tipo === 'Platino') return 'rgba(0, 0, 255, 1)';
              return 'rgba(0, 0, 0, 1)'; // Puedes cambiar esto a otro color por defecto
            }),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Proporción de Membresías',
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 10,
            },
            color: 'rgba(0, 0, 0, 1)',
          },
        },
      },
    });
  }

  procesarAsistenciasParaGraficoLineal = (): void => {
    const asistenciaData: any[] = this.asistenciaCount
      .slice(-6)
      .map((asistencia) => ({
        date: new Date(asistencia.fecha),
        count: asistencia.cantidad,
      }));

    this.lineChartLabels = asistenciaData.map((item) =>
      this.formatoFecha(item.date)
    );
    this.lineChartData = [
      {
        data: asistenciaData.map((item) => item.count),
        label: 'Asistencias diarias',
        fill: false,
        borderColor: 'rgba(255, 165, 0, 1)', // Color naranja amarillento
        borderWidth: 2,
      },
    ];

    const ctxLine = this.myLineChart.nativeElement.getContext('2d');
    new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: this.lineChartLabels,
        datasets: this.lineChartData,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Asistencias diarias - Año ${asistenciaData[0]?.date.getFullYear()}`,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 10,
            },
            color: 'rgba(0, 0, 0, 1)',
          },
        },
      },
    });
  };

  formatoFecha = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
  };
}
