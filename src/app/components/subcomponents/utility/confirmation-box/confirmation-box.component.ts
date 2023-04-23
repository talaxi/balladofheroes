import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent {
  @Input() confirmationText = "";
  @Input() cancelOptionAvailable = true;
  constructor(public dialogRef: MatDialogRef<ConfirmationBoxComponent>) {
    
  }

  continue(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  cancel(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
