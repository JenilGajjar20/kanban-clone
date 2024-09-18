import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SwimlanesService } from '../../../../shared/services/swimlanes.service';
import {
  Swimlane,
  UpdateSwimlane,
} from '../../../../shared/models/swimlane.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from '../../../../ui/confirm/confirm.component';
import { filter, mergeMap } from 'rxjs';

@Component({
  selector: 'app-edit-swimlane',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './edit-swimlane.component.html',
  styleUrl: './edit-swimlane.component.scss',
})
export class EditSwimlaneComponent {
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly matDialog = inject(MatDialog);
  private readonly fb = inject(NonNullableFormBuilder);
  data = inject(MAT_DIALOG_DATA);

  swimlaneForm = this.fb.group({
    id: this.fb.control(this.data.swimlane?.id),
    name: this.fb.control(this.data.swimlane?.name, [Validators.required]),
  });

  updateSwimlane() {
    if (this.swimlaneForm.invalid) {
      return;
    }

    this.swimlaneService
      .updateSwimlane(this.swimlaneForm.value as UpdateSwimlane)
      .subscribe((swimlane: Swimlane) => {
        this.dialogRef.close(swimlane);
      });
  }

  deleteSwimlane() {
    this.matDialog
      .open(ConfirmComponent, {
        data: {
          title: 'Delete Swimlane',
          message: 'Are you sure you want to delete this swimlane?',
        },
      })
      .afterClosed()
      .pipe(
        filter((confirm) => confirm),
        mergeMap(() =>
          this.swimlaneService.deleteSwimlane(this.data.swimlane.id)
        )
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
