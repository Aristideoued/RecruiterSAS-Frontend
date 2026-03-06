import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'warn' | 'primary';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div style="padding:8px">
      <h2 mat-dialog-title style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <mat-icon style="color:#ef4444">warning</mat-icon>
        {{ data.title }}
      </h2>
      <mat-dialog-content>
        <p style="color:#6b7280;font-size:.95rem;line-height:1.5">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" style="gap:10px;padding-top:16px">
        <button mat-stroked-button mat-dialog-close>Annuler</button>
        <button mat-flat-button [color]="data.confirmColor || 'warn'" [mat-dialog-close]="true">
          {{ data.confirmLabel || 'Supprimer' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}
}
