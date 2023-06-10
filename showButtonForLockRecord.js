import {
    LightningElement,
    api,
    wire,
    track
} from 'lwc';
import LockRecordMethod from '@salesforce/apex/LockLeadRecord.lockRecord';
import getRecordData from '@salesforce/apex/LockLeadRecord.getRecordData';
import USER_Id from '@salesforce/user/Id';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';


export default class ShowButtonForLockRecord extends LightningElement {
    @api recordId;
    USER_Id = USER_Id;
    idAdmin = false;
    isLockButton;
    isUnlock;
    isLocked;
    badgeColor;
    @api isLoading = false;
    showBadge = false;

    connectedCallback() {
        getRecordData({
                userId: USER_Id,
                recId: this.recordId
            })
            .then(data => {
                console.log('connectedCallback getRecordData>> ', data);
                this.showBadge = true;
                if (data) {
                    this.idAdmin = data.IsAdministrator;
                    if (data.isLockedRecord == true) {
                        this.isLocked = 'Lock'
                        this.isLockButton = false;
                        this.badgeColor = "slds-align_absolute-center slds-badge slds-theme_error";
                        if (!this.idAdmin) {
                            const evt = new ShowToastEvent({
                                title: 'This Record Is Locked',
                                message: 'This record has been locked by Admin, Please contact admin for edit this record',
                                variant: 'error',
                                mode: 'dismissable'
                            });
                            this.dispatchEvent(evt);
                        }
                    } else {
                        this.isLocked = 'Unlock'
                        this.isLockButton = true;
                        this.badgeColor = "slds-align_absolute-center slds-badge slds-theme_success";
                    }
                }
            })
            .catch(error => {
                console.log('connectedCallback getRecordData error >> ', error);
            });
    }

    handleLockButtonClick(event) {
        // this.isLoading = true;
        //console.log('Lock Button >>> ',this.recordId);
        LockRecordMethod({
                recId: this.recordId,
                isLock: true
            })
            .then(result => {
                // console.log('Lock Button result>>> ',result);
                if (result == 'LOCKED') {
                    this.isLockButton = false;
                    this.isLocked = 'Lock';
                    this.badgeColor = "slds-align_absolute-center slds-badge slds-theme_error";
                    // this.isLoading = false;
                }
            })
            .catch(error => {
                console.log('Lock Button error>>> ', error);
            });
    }

    handleUnlockButtonClick(event) {
        //this.isLoading = true;
        //console.log('Lock Button >>> ',this.recordId);
        LockRecordMethod({
                recId: this.recordId,
                isLock: false
            })
            .then(result => {
                //console.log('Lock Button result>>> ',result);
                if (result == 'UnLOCKED') {
                    this.isLockButton = true;
                    this.isLocked = 'Unlock';
                    this.badgeColor = "slds-align_absolute-center slds-badge slds-theme_success";
                    //this.isLoading = false;
                }
            })
            .catch(error => {
                console.log('UnLock Button error>>> ', error);
            });
    }

}