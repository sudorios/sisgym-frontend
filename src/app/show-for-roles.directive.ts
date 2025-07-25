import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoginService } from './core/services/login.service';


@Directive({
  selector: '[appShowForRoles]',
  standalone: true
})

export class ShowForRolesDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private loginService: LoginService
  ) {}

  @Input() set appShowForRoles(roles: string[]) {
    const userRole = this.loginService.getUserRole();
    if (this.verificarRoles(roles, userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private verificarRoles(rolesNecesarios: string[], userRole: string): boolean {
    return rolesNecesarios.includes(userRole.toLowerCase()); 
  }
}