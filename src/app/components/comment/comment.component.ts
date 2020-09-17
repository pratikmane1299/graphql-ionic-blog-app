import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { timeDifferenceForDate } from '../../utils/util';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: any;
  @Output() optionsClick: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  options(commentId: string) {
    this.optionsClick.emit(commentId);
  }

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
