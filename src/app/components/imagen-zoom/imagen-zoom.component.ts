import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-imagen-zoom',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" 
         [class.closing]="cerrando" 
         (click)="cerrarImagen()">
      <img class="zoom-img" 
           [src]="imagen" 
           (click)="$event.stopPropagation()"
           [class.closing]="cerrando">
      <button class="close-btn" 
              (click)="cerrarImagen()" 
              [class.closing]="cerrando">×</button>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    }

    .overlay.closing {
      animation: fadeOut 0.3s forwards;
    }

    .zoom-img {
      max-width: 90%;
      max-height: 90%;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      transform: scale(0.8);
      animation: scaleIn 0.3s forwards;
    }

    .zoom-img.closing {
      animation: scaleOut 0.3s forwards;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 2rem;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      opacity: 0;
      animation: fadeIn 0.3s 0.2s forwards;
    }

    .close-btn.closing {
      animation: fadeOut 0.3s forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }

    @keyframes scaleOut {
      from { transform: scale(1); }
      to { transform: scale(0.8); }
    }
  `]
})
export class ImagenZoomComponent {
  @Input() imagen: string = '';
  @Output() cerrar = new EventEmitter<void>();

  cerrando: boolean = false;

  cerrarImagen() {
    this.cerrando = true;
    // esperar a que termine la animación de cierre antes de emitir
    setTimeout(() => {
      this.cerrar.emit();
      this.cerrando = false; // reset para siguiente uso
    }, 300);
  }
}
