import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { MessagePayload } from './notification-interfaces';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  messagingFirebase: firebase.messaging.Messaging;

  constructor() {
    firebase.initializeApp({
        apiKey: "AIzaSyCNr7nAJOZJW0YDBTanTXnH_xVnlnMDAPI",
        authDomain: "dawem-5361a.firebaseapp.com",
        projectId: "dawem-5361a",
        storageBucket: "dawem-5361a.appspot.com",
        messagingSenderId: "920034014025",
        appId: "1:920034014025:web:18bb00d19266b668b1a098",
        measurementId: "G-VE6JQS06RC"
      });
    this.messagingFirebase = firebase.messaging();

  }

  requestPermission = () => {
    return new Promise(async (resolve, reject) => {
      const permsis = await Notification.requestPermission();
      debugger;

      if (permsis === "granted") {
        debugger;

        const tokenFirebase = await this.messagingFirebase.getToken();
        debugger;

        resolve(tokenFirebase);
      } else {
        reject(new Error("No se otorgaron los permisos"))
      }
    })
  }

  private messaginObservable = new Observable<MessagePayload>(observe => {
    debugger;

    this.messagingFirebase.onMessage(payload => {
        debugger;
      observe.next(payload)
    })
  })
  receiveMessageTwo() {
    this.messagingFirebase.onMessage(payload => {
        debugger;
      console.log(payload)
    });
  }
  receiveMessage() {
    return this.messaginObservable;
  }

}