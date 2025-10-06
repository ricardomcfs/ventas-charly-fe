import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { ApiService } from '../../services/api.service';

interface Categoria {
  id: number;
  nombre: string;
}

@Component({
  selector: 'categoria-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria-menu.component.html',
  styleUrls: ['./categoria-menu.component.scss']
})
export class CategoriaMenuComponent {
  categorias: any[] = [];
  categoriaActiva: number | null = null;
  collapsed = false; // para responsive

  @Output() categoriaSeleccionada = new EventEmitter<number | null>();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  async cargarCategorias() {
    try {
      const api_response = await this.api.getCategorias();
      this.categorias = api_response.categorias;
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaActiva = id;
    this.categoriaSeleccionada.emit(id);
    // en mobile cerramos el menú
    if (window.innerWidth < 900) this.collapsed = true;
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}

