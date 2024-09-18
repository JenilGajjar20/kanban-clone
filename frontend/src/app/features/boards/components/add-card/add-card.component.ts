import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Card } from '../../../../shared/models/card.model';
import { CardService } from '../../../../shared/services/card.service';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmComponent } from '../../../../ui/confirm/confirm.component';
import { filter, mergeMap } from 'rxjs';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss',
})
export class AddCardComponent {
  private readonly matDialog = inject(MatDialog);
  private readonly cardService = inject(CardService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);
  data = inject(MAT_DIALOG_DATA);

  addCardForm = this.fb.group({
    order: this.fb.control(this.data.swimlane.cards.length),
    boardId: this.fb.control(this.data.boardId),
    swimlaneId: this.fb.control(this.data.swimlane.id),
    name: this.fb.control(this.data.card?.name, [Validators.required]),
    content: this.fb.control(this.data.card?.content, [Validators.required]),
  });

  createEditCard() {
    if (this.addCardForm.invalid) {
      return;
    }

    this.data.card?.id ? this._updateCard() : this._createCard();
  }

  private _createCard() {
    this.cardService
      .createCard(this.addCardForm.value as Partial<Card>)
      .subscribe((card: Card) => {
        this.dialogRef.close(card);
      });
  }

  private _updateCard() {
    this.cardService
      .updateCard(this.data.card?.id, this.addCardForm.value as Partial<Card>)
      .subscribe((card: Card) => {
        this.dialogRef.close(card);
      });
  }

  deleteCard() {
    if (!this.data.card?.id) return;

    this.matDialog
      .open(ConfirmComponent, {
        data: {
          title: 'Delete Card',
          message: 'Are you sure you want to delete this card?',
        },
      })
      .afterClosed()
      .pipe(
        filter((confirm) => confirm),
        mergeMap(() => this.cardService.deleteCard(this.data.card.id))
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  closeCard() {
    this.dialogRef.close();
  }
}
