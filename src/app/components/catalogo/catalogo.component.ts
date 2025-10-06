import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { ImagenComponent } from '../imagen/imagen.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ImagenComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  imagenes: any[] = [];
  imagenesFiltradas: any[] = [];

  paginaActual = 1;
  itemsPorPagina = 8;
  totalPaginas = 1;
  categoriaSeleccionada: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarImagenes();
  }

  async cargarImagenes() {
    try {
      const resp = await this.api.getImagenes();
      this.imagenes = resp.data; // solo las activas
      this.aplicarFiltros();
    } catch (err) {
      console.error('Error cargando imágenes', err);
    }
  }

  filtrarPorCategoria(categoriaId: number | null) {
    this.categoriaSeleccionada = categoriaId;
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let lista = [...this.imagenes];
    if (this.categoriaSeleccionada) {
      lista = lista.filter(img => img.categoria_id === this.categoriaSeleccionada);
    }
    this.totalPaginas = Math.ceil(lista.length / this.itemsPorPagina);
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    this.imagenesFiltradas = lista.slice(start, start + this.itemsPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.aplicarFiltros();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.aplicarFiltros();
    }
  }
}
