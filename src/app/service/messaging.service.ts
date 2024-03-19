import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor() {

  }
  requestPermission() {

  }
  receiveMessage() {
    debugger;


  }
}