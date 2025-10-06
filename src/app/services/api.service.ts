import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL = 'https://ventas-charly-be-production.up.railway.app'; // reemplaza con tu URL

  constructor(private http: HttpClient) {}

  /** GET /categorias */
  async getCategorias(): Promise<any> {
    // return this.http.get<any[]>(`${this.BASE_URL}/categorias`).toPromise();
    return firstValueFrom(this.http.get<any[]>(`${this.BASE_URL}/api/categorias`));
  }

  /**
   * GET /imagenes
   * Query params: page, limit, categoria (opcional)
   */
  getImagenes(categoriaId?: number | null, page: number = 1, limit: number = 12): Promise<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (categoriaId !== null && categoriaId !== undefined) {
      params = params.set('categoria', String(categoriaId));
    }

    return firstValueFrom(this.http.get(`${this.BASE_URL}/api/imagenes`, { params }));
  }

  /**
   * POST /imagenes/admin/imagenes
   * Subida de múltiples imágenes + campos: precioPublico_i, precioMayoreo_i, activo_i
   * Devuelve Observable<HttpEvent<any>> para poder controlar el progreso
   */
  uploadImagenes(formData: FormData, onProgress?: (event: ProgressEvent) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.BASE_URL}/api/imagenes/admin/imagenes`, formData, {
        reportProgress: true,
        observe: 'events',
      }).subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && onProgress) {
            onProgress({
              loaded: event.loaded,
              total: event.total || 0,
            } as ProgressEvent);
          } else if (event.type === HttpEventType.Response) {
            resolve(event.body);
          }
        },
        error: err => reject(err)
      });
    });
  }

  /**
   * PUT /imagenes/admin/imagen/:id
   * Actualizar datos de imagen (si implementas backend)
   */
  updateImagen(id: number | string, payload: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/imagenes/admin/imagen/${id}`, payload);
  }

  /**
   * DELETE /imagenes/admin/imagen/:id
   * Borrar imagen (si implementas backend)
   */
  deleteImagen(id: number | string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/imagenes/admin/imagen/${id}`);
  }
}
