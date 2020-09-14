import { Component, Input, OnInit } from '@angular/core';

import { timeDifferenceForDate } from '../../utils/util';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: any;
  constructor() { }

  ngOnInit() {}

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
