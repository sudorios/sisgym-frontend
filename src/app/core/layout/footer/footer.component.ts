import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-dark text-light py-3 mt-auto" style="width: 100%; position: relative; z-index: 999;">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-12 text-center">
            <small>© 2024 Sisgym.org.pe. Todos los derechos reservados.</small>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
