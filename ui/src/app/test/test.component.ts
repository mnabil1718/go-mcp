import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'test',
  imports: [DragDropModule, MatExpansionModule],
  templateUrl: 'test.template.html',
  host: {
    class: 'flex flex-col flex-1 border-2',
  },
})
export class TestComponent {
  list: string[][] = [
    ['a', 'b', 'c', 'd'],
    ['e', 'f', 'h', 'i'],
    ['j', 'k', 'l', 'm'],
  ];

  a() {
    console.log('entered');
  }

  drop(event: CdkDragDrop<string[][]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  cdrop(event: CdkDragDrop<string[]>) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
    }
  }
}
