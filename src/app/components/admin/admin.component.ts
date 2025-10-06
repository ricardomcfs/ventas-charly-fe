import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';

interface ImagenItem {
  file: File;
  precioPublico: number;
  precioMayoreo: number;
  tienda: string;
  codigo: string;
  activo: boolean;
  categoria_id: number;
  preview?: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,
    FormsModule,           // <<---- para ngModel
    ReactiveFormsModule,   // <<---- para FormGroup
],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  form: FormGroup;
  imagenes: ImagenItem[] = [];
  categorias = [
    { id: 1, nombre: 'Bolsas y Mochilas' },
    { id: 2, nombre: 'Zapatos' },
    { id: 3, nombre: 'Mascotas' }
  ];
  progress = 0;
  uploadFinished = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      tienda: [''],
      codigo: [''],
      categoria_id: [1],
      precioPublico: [0],
      precioMayoreo: [0],
      activo: [true],
      files: [null]
    });
  }

  // Al seleccionar archivos
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imagenes.push({
        file,
        precioPublico: 0,
        precioMayoreo: 0,
        tienda: this.form.value.tienda,
        codigo: this.form.value.codigo,
        activo: true,
        categoria_id: this.form.value.categoria_id,
        preview: URL.createObjectURL(file)
      });
    }
  }

  // Subida de imágenes
  async uploadAll() {
    if (this.imagenes.length === 0) return alert('Seleccione al menos una imagen');

    const formData = new FormData();

    // ⚠️ Importante: el backend espera un único categoria_id y un array de precios en JSON
    formData.append('categoria_id', this.form.value.categoria_id);
    formData.append('codigo', this.form.value.codigo || '');

    const precios = this.imagenes.map(img => ({
      precioPublico: img.precioPublico,
      precioMayoreo: img.precioMayoreo
    }));

    formData.append('precios', JSON.stringify(precios));

    this.imagenes.forEach(img => {
      formData.append('imagenes', img.file);
    });

    try {
      this.progress = 0;
      this.uploadFinished = false;

      const response = await this.api.uploadImagenes(
        formData,
        (progressEvent: ProgressEvent) => {
          if (progressEvent.lengthComputable) {
            this.progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        }
      );

      console.log('Respuesta backend:', response);
      this.uploadFinished = true;
      this.imagenes = [];
    } catch (error) {
      console.error('Error al subir imágenes:');
      console.error(error);
    }
  }
}
