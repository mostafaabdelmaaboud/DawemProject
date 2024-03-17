import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs'
@Injectable()
export class MessagingService {
currentMessage = new BehaviorSubject(null);
constructor() {
// this.angularFireMessaging.messaging.subscribe(
// (_messaging) => {
// _messaging.onMessage = _messaging.onMessage.bind(_messaging);
// _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
// }
// )
}
requestPermission() {
  // this.angularFireMessaging.requestToken.subscribe({
  //   next:token => {
  //     console.log(token);
  //   },
  //   error:err => {
  //     console.error('Unable to get permission to notify.', err);

  //   }
  // })
// this.angularFireMessaging.requestToken.subscribe(
// (data) => {
// console.log(data);
// },
// (err) => {
// console.error('Unable to get permission to notify.', err);
// }
// );
}
receiveMessage() {
  // this.angularFireMessaging.messages.subscribe({
  //   next:(payload:any) => {
  //     console.log("new message received. ", payload);
  //     this.currentMessage.next(payload);
  //   },
  //   error:err => {

  //   }})
  }
}