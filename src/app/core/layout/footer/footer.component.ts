import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-dark text-light py-3 mt-auto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <small>© 2024 Sisgym.org.pe. Todos los derechos reservados.</small>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
