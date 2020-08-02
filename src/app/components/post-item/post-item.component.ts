import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { timeDifferenceForDate } from 'src/app/utils/util';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {

  @Input() post: any;
  @Output() onPostClick = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onClick(id: string) {
    this.onPostClick.emit(id);
  }

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
