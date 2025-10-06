import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CategoriaMenuComponent } from './components/categoria-menu/categoria-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CategoriaMenuComponent],
  template: `
    <div class="app-container">
      <categoria-menu (categoriaSeleccionada)="onCategoriaSeleccionada($event)"></categoria-menu>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.scss']
})
export class AppComponent {
  selectedCategory: string | null = null;

  onCategoriaSeleccionada(categoria: any) {
    this.selectedCategory = categoria;
    console.log('Categoría seleccionada:', categoria);
  }
}
