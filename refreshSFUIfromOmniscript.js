import { LightningElement,api, track } from 'lwc';
import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi'; 

export default class RefreshSFUIfromOmniscript extends OmniscriptBaseMixin(LightningElement) {
    @api omniJsonData;
    @track processingIP = false;
    @api ipName;
    SaveDataEvent(){
        console.log('IP Name: '+this.ipName);  
        const params = {
             input: this.omniJsonData,
            //Incase of Standard Omnistudio Package please use omnistudio namespace
             sClassName: "vlocity_ins.IntegrationProcedureService",
            //This IP name can be passed from the Omniscript via custom lightning web component properties 
             sMethodName: this.ipName,
             options: "{}",
          };
          this.processingIP = true;
          this.omniRemoteCall(params, true).then((response) => {
             let statusResponse = response.result.IPResult;
             if (statusResponse.success == false) {  
             } else {
                var jsonData = JSON.parse(JSON.stringify(this.omniJsonData));
                var cont = jsonData?.ContextId;
                //Multiple Record Ids will passed refer to the usage document https://salesforce.quip.com/OziSAdpj5HdZ
                notifyRecordUpdateAvailable([{recordId: cont}]);
             }
             this.processingIP = false;
          });
    }
}