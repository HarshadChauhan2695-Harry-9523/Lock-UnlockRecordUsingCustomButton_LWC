public class LockLeadRecord {
    @AuraEnabled
    public static String lockRecord(String recId, Boolean isLock) {
        String status;
        List<Lead> AccList = [SELECT Id,IsLocked__c From Lead where Id=:recId];
        if(isLock){
            //system.debug('LOCKED');
            status= 'LOCKED';
            List<Approval.LockResult> lrList = Approval.lock(AccList, false);
            AccList[0].IsLocked__c=true;
        }else if (!isLock){
            //system.debug('Un LOCKED');
            status= 'UnLOCKED';
            List<Approval.UnlockResult> lrList = Approval.unlock(AccList, false);
            AccList[0].IsLocked__c=false;
        }else{
            system.debug('NOTHING');
            status= 'NOTHING';
        }
        //update AccList;
        return status;
    }
    
    /*@AuraEnabled(cacheable=true)
    public static Map<String,Boolean> getUserData(String userId , String recId) {
        system.debug('userId >> '+ userId);
        Map<String,Boolean> initData = new Map<String,Boolean>();
        Boolean isLockedRecord =Approval.isLocked(recId);
        String userData = [Select ID ,Name, Username, Profile.Name, Profile.Id  From user where Id =: userId].Profile.Name;
        if(userData == 'System Administrator'){
            initData.put('IsAdministrator', true);
        }else{
            initData.put('IsAdministrator', false);
        }        
        initData.put('isLockedRecord', isLockedRecord);
        return initData;
    }*/
    
    @AuraEnabled
    public static Map<String,Boolean> getRecordData(String userId ,String recId) {
        //boolean isRecordLocked = [SELECT Id,IsLocked__c From Lead where Id=:recId].IsLocked__c;
        Map<String,Boolean> initData = new Map<String,Boolean>();
        Boolean isLockedRecord =Approval.isLocked(recId);
        String userData = [Select ID ,Name, Username, Profile.Name, Profile.Id  From user where Id =: userId].Profile.Name;
        if(userData == 'System Administrator'){
            initData.put('IsAdministrator', true);
        }else{
            initData.put('IsAdministrator', false);
        }        
        initData.put('isLockedRecord', isLockedRecord);
        //initData.put('isRecordLocked', isRecordLocked);
        return initData;
    }
}