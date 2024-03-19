import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }
  requestPermission() {
  this.angularFireMessaging.requestToken.subscribe({
    next: (token) => {
      debugger;
      console.log(token);
      },
      error: (err) => {
        debugger;
      console.error('Unable to get permission to notify.', err);
      }
  }

  );
  }
  receiveMessage() {
    debugger;
  this.angularFireMessaging.messages.subscribe({
    next: (payload:any) => {
      debugger;
    console.log("new message received. ", payload);
    this.currentMessage.next(payload);
    },
    error:err => {
      debugger;
    }
  });
 

  }
}