import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';

interface ImagenItem {
  file: File;
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

  private readonly USER = 'charly';
  private readonly PASS = 'leticia';

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

    this.checkLogin();
  }

  private checkLogin() {
    const logged = sessionStorage.getItem('loggedIn');
    if (logged === 'true') return;

    const user = prompt('Usuario:');
    const pass = prompt('Contraseña:');

    if (user === this.USER && pass === this.PASS) {
      sessionStorage.setItem('loggedIn', 'true');
    } else {
      alert('Usuario o contraseña incorrectos');
      // Redirige al inicio si falla login
      window.location.href = '/';
    }
  }

  // Al seleccionar archivos
  onFileChange(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imagenes.push({
        file,
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

    const precioPublicoGlobal = this.form.value.precioPublico;
    const precioMayoreoGlobal = this.form.value.precioMayoreo;

    this.imagenes.forEach((img, index) => {
      formData.append('imagenes', img.file);
      formData.append(`precioPublico`, precioPublicoGlobal.toString());
      formData.append(`precioMayoreo`, precioMayoreoGlobal.toString());
      formData.append(`tienda`, img.tienda);
      formData.append(`codigo`, img.codigo);
      formData.append(`activo`, '1');
      formData.append(`categoria_id`, img.categoria_id.toString());
    });

    try {
      this.progress = 0;
      this.uploadFinished = false;

      const response = await this.api.uploadImagenes(formData, (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable) {
          this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        }
      });

      console.log('Respuesta backend:', response);
      this.uploadFinished = true;
      this.imagenes = [];
    } catch (error) {
      console.error('Error al subir imágenes:');
      console.error(error);
    }
  }
}
