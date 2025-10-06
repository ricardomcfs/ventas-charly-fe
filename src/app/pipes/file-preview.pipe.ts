import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'file-preview'
})
export class FilePreviewPipe implements PipeTransform {

  transform(file: File): string | null {
    if (!file) return null;
    return URL.createObjectURL(file);
  }

}
