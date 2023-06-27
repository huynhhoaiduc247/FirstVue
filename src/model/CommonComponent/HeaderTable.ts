class keyPairValue{
    value: any
    name: string=""
}
export class HeaderTable{
    classHeader?: string="";
    classComponent?: string="";
    idComponent?:string="";
    name: string="";
    label: string="";
    dataType: string=""; //number/text/datetime/checkbox/droplist/radio/button
    inputType: string="";
    isEdit: boolean=false; // hiển thị input trên table
    width?: string="";
    placeHolder?: string="";
    /////////////common input
    //#region string

    //#endregion

    //#region datetime

    //#endregion

    //#region number
    min?: number=0;
    max?: number=0;
    isDecimal?: boolean=false
    //#endregion





    ////////////////select
    dataSource?:Array<keyPairValue>=new Array<keyPairValue>()
    //#region checkbox

    //#endregion
    //#region droplist
    isMulti?: boolean=false
    //#endregion
    //#region radio

    //#endregion




    ////////////////button
    //#region button
    onAdd?: Function = ()=>{} // on header
    //feature button on each row
    onUpdate?: Function = ()=>{} // on data row
    onDelete?: Function = ()=>{} // on data row
    onDetail?: Function = ()=>{} // on data row
    //#endregion
}