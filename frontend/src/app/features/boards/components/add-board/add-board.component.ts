import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BoardService } from '../../../../shared/services/board.service';
import { Board, CreateBoard } from '../../../../shared/models/board.model';

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.scss',
})
export class AddBoardComponent {
  private readonly boardService = inject(BoardService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);
  data = inject(MAT_DIALOG_DATA);

  addBoardForm = this.fb.group({
    id: this.fb.control(this.data.board?.id),
    name: this.fb.control(this.data.board?.name, [Validators.required]),
  });

  createEditBoard() {
    if (this.addBoardForm.invalid) {
      return;
    }

    this.data.board?.id ? this._updateBoard() : this._createBoard();
  }

  private _createBoard() {
    this.boardService
      .createBoard(this.addBoardForm.value as CreateBoard)
      .subscribe((board: Board) => {
        this.dialogRef.close(board);
      });
  }

  private _updateBoard() {
    this.boardService
      .updateBoard(this.data.board?.id, this.addBoardForm.value as CreateBoard)
      .subscribe((board: Board) => {
        this.dialogRef.close(board);
      });
  }

  closeBoard() {
    this.dialogRef.close();
  }
}
