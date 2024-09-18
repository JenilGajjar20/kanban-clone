import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBoardComponent } from '../components/add-board/add-board.component';
import { filter, mergeMap, Subject, switchMap } from 'rxjs';
import { Board } from '../../../shared/models/board.model';
import { ConfirmComponent } from '../../../ui/confirm/confirm.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private readonly matDialog = inject(MatDialog);
  private readonly boardService = inject(BoardService);
  refetch$ = new Subject<void>();
  boards = toSignal(
    this.refetch$
      .asObservable()
      .pipe(switchMap(() => this.boardService.getBoards()))
  );

  ngOnInit(): void {
    this.refetch$.next();
  }

  openNewBoardFlow($event: Event, board?: Board) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.matDialog
      .open(AddBoardComponent, { width: '400px', data: { board } })
      .afterClosed()
      .subscribe((board: Board) => {
        board && this.refetch$.next();
      });
  }

  deleteBoard($event: Event, board: Board) {
    $event.stopImmediatePropagation();
    $event.preventDefault();

    this.matDialog
      .open(ConfirmComponent, {
        data: {
          title: 'Delete Board',
          message: 'Are you sure you want to delete this board?',
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        mergeMap(() => this.boardService.deleteBoard(board.id))
      )
      .subscribe(() => this.refetch$.next());
  }
}
