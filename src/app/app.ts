import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CategoriaMenuComponent } from './components/categoria-menu/categoria-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CategoriaMenuComponent, CommonModule],
  template: `
      <div class="app-container">
        <!-- HEADER -->
        <header class="app-header">
          <div class="logo">
            <img src="https://res.cloudinary.com/dwwanttjq/image/upload/v1760075105/bolsas_charly_u2mw6l.jpg" alt="Bolsas Charly Logo">
            <span>Bolsas Charly</span>
          </div>

          <!-- Botón flotante menú -->
          <button class="menu-toggle" (click)="menuOpen = !menuOpen">☰</button>
        </header>

        <!-- Sidebar -->
        <div class="sidebar" [class.open]="menuOpen">
          <categoria-menu
            (categoriaSeleccionada)="onCategoriaSeleccionada($event)"
          ></categoria-menu>
        </div>

        <!-- Overlay para cerrar menú en móvil -->
        <div class="overlay" *ngIf="menuOpen" (click)="menuOpen = false"></div>

        <!-- Contenido principal -->
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>

  `,
  styleUrls: ['./app.scss']
})
export class AppComponent {
  menuOpen = false;
  selectedCategory: string | null = null;

  onCategoriaSeleccionada(categoria: any) {
    this.selectedCategory = categoria;
    console.log('Categoría seleccionada:', categoria);
    if (window.innerWidth < 900) this.menuOpen = false; // cerrar menú en mobile
  }
}
