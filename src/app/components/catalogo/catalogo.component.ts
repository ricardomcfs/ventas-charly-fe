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
  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 1;
  categoriaSeleccionada: number | null = null;
  cargando = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarImagenes();
  }

  async cargarImagenes() {
    this.cargando = true;
    try {
      const resp = await this.api.getImagenes(
        this.categoriaSeleccionada,
        this.paginaActual,
        this.itemsPorPagina
      );
      this.imagenes = resp.data;
      this.totalPaginas = Math.ceil(resp.total / this.itemsPorPagina);
    } catch (err) {
      console.error('Error cargando imágenes', err);
    } finally {
      this.cargando = false;
    }
  }

  async filtrarPorCategoria(categoriaId: number | null) {
    this.categoriaSeleccionada = categoriaId;
    this.paginaActual = 1;
    await this.cargarImagenes();
  }

  async paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      await this.cargarImagenes();
    }
  }

  async paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      await this.cargarImagenes();
    }
  }
}
