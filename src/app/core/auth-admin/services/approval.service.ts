import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  // d kda lw ana 3aiz ab3t mesg w lazem ta5od inital value ayn kan htb3t eah
  public approvalStageMessage = new BehaviorSubject('');


  // for msg
  currentApprovalStageMessage1 = this.approvalStageMessage.asObservable();



  constructor() {
  }


  // el fuction d ana ele bt7km hya bta5od eah momken ta5od msg lw 3aiz abasy msg mn el ts aw list aw object.
  updateApprovalMessage(message: string) {
    //d kda lw 3aiz ab3t msg
  this.approvalStageMessage.next(message);
  }

}


