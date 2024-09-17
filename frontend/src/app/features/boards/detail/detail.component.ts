import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SwimlanesService } from '../../../shared/services/swimlanes.service';
import { Subject, switchMap } from 'rxjs';
import {
  CreateSwimlane,
  Swimlane,
} from '../../../shared/models/swimlane.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule,
    DragDropModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly activatedRoute = inject(ActivatedRoute);

  refetch$ = new Subject<void>();
  board = toSignal(
    this.refetch$
      .asObservable()
      .pipe(
        switchMap(() =>
          this.boardService.getBoardById(
            this.activatedRoute.snapshot.params['id']
          )
        )
      )
  );

  ngOnInit(): void {
    this.refetch$.next();
  }

  private readonly fb = inject(NonNullableFormBuilder);
  swimlaneForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
  });

  cardForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
  });

  addSwimlane() {
    if (this.swimlaneForm.invalid) {
      return;
    }

    const _board = this.board();
    if (!_board) return;

    this.swimlaneService
      .createSwimlane({
        name: this.swimlaneForm.value.name as string,
        boardId: _board.id,
        order: _board.swimlanes?.length || 0,
      })
      .subscribe(() => {
        this.swimlaneForm.reset();
        this.refetch$.next();
      });
  }

  deleteSwimlane(swimlane: Swimlane) {
    this.swimlaneService.deleteSwimlane(swimlane.id).subscribe(() => {
      this.refetch$.next();
    });
  }

  onSwimlaneChange($event: CdkDragDrop<any>): void {
    console.log($event);
    moveItemInArray(
      this.board()?.swimlanes || [],
      $event.previousIndex,
      $event.currentIndex
    );
  }
}
