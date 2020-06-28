import { Component, OnInit, Input } from '@angular/core';

import { timeDifferenceForDate } from 'src/app/utils/util';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {

  @Input() post: any;

  constructor() { }

  ngOnInit() {}

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
