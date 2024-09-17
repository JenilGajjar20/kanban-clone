export class ReorderSwimlaneDto {
  boardId: number;
  items: ReorderSwimlaneItemDto[];
}

export class ReorderSwimlaneItemDto {
  id: number;
  order: number;
}
