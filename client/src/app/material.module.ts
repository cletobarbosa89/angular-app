import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  exports: [
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectFilterModule,
    MatDialogModule
  ]
})

export class MaterialModule {}
