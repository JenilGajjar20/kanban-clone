import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SwimlanesService } from '../../../shared/services/swimlanes.service';
import { Subject, switchMap } from 'rxjs';
import { Swimlane } from '../../../shared/models/swimlane.model';
import { Card } from '../../../shared/models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../components/add-card/add-card.component';
import { CardService } from '../../../shared/services/card.service';

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
  private readonly cardService = inject(CardService);
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly matDialog = inject(MatDialog);

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
    const _board = this.board();
    if (!_board) return;

    moveItemInArray(
      _board.swimlanes || [],
      $event.previousIndex,
      $event.currentIndex
    );

    this.boardService
      .updateSwimlaneOrder({
        boardId: _board.id,
        items:
          _board.swimlanes?.map((swimlane, index) => ({
            id: swimlane.id,
            order: index,
          })) || [],
      })
      .subscribe(() => {
        this.refetch$.next();
      });

    console.log('==>', this.board()?.swimlanes);
  }

  onCardChange($event: CdkDragDrop<any>, swimlane: Swimlane) {
    console.log($event, swimlane);

    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        swimlane.cards || [],
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );
    }

    const _board = this.board();
    if (!_board) return;

    const cards: Card[] =
      _board.swimlanes?.reduce((prev: Card[], current: Swimlane) => {
        const cards =
          current.cards?.map((card, index) => ({
            ...card,
            swimlaneId: current.id,
            order: index,
          })) || [];
        return [...prev, ...cards];
      }, []) || [];

    this.cardService
      .updateCardOrdersAndSwimlanes(_board.id, cards)
      .subscribe(() => {
        this.refetch$.next();
      });
  }

  addCard(swimlane: Swimlane, card?: Card) {
    this.matDialog
      .open(AddCardComponent, {
        width: '600px',
        data: { swimlane: swimlane, boardId: swimlane.boardId, card },
      })
      .afterClosed()
      .subscribe((card?: Card) => {
        card && this.refetch$.next();
      });
  }
}
