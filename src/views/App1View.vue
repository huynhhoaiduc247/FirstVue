<script setup lang="ts">
import { stringifyQuery } from 'vue-router';

</script>
<template>
    <main>
        <button v-bind:disabled="user == 1" v-if="user == 0 || user == 1" style="margin: 10px;" class="btn btn-primary" v-on:click="createRoom()">
            Create room
        </button>
        <button v-bind:disabled="user == -1" v-if="user == 0 || user == -1" style="margin: 10px;" class="btn btn-primary" v-on:click="joinRoom()">
            Join room
        </button>
        <!-- offer -->
        <div v-if="user == 1"> 
            <div class="form-group">
                <label for="localConnectString">Player 1 ID</label>
                <textarea class="form-control" id="localConnectString" rows="3"
                disabled
                placeholder="Wait for a second to init room id"
                v-model="localConnectString"></textarea>
            </div>
            <div class="form-group">
                <label for="remoteConnectString">Player 2 ID</label>
                <textarea class="form-control" id="remoteFormControlTextarea1" rows="3"
                placeholder="Paste player 2 id here"
                v-model="remoteConnectString"></textarea><br>
                <button class="btn btn-primary" v-on:click="accept()">Accept</button>
            </div>
        </div>
        <!-- answer -->
        <div v-else-if="user == -1"> 
            <div class="form-group">
                <label for="remoteConnectString">Player 1 ID</label>
                <textarea class="form-control" id="remoteFormControlTextarea1" rows="3"
                placeholder="Paste Player 1 ID here"
                v-model="remoteConnectString"></textarea><br>
                <button class="btn btn-primary" v-on:click="request()">Request</button>
            </div>
            <div class="form-group">
                <label for="localConnectString">Player 2 ID</label>
                <textarea class="form-control" id="localConnectString" rows="3"
                disabled
                v-model="localConnectString"></textarea>
            </div>
        </div>
        <div v-if="turn == 1" ><span class="header-app" style="color: green;">Player 1 </span><span class="header-app">turn</span></div>
        <div v-if="turn == -1" ><span class="header-app" style="color: red;">Player 2 </span><span class="header-app">turn</span></div>
        <table :class="userWin != 0 ? 'disabled': 'actived'">
            <tr v-for="(r, rIndex) in table" :key="rIndex">
                <td v-for="(c, cIndex) in r" 
                :key="rIndex + '_' + cIndex"
                :style="arr_move.some((e)=> {return rIndex == e[0] && cIndex == e[1]}) ? 'background: yellow' : ''"
                style="width: 25px; height: 25px; min-width: 25px;min-height: 25px;" v-on:click="check(rIndex, cIndex, user)">
                    <i v-show="c == 1" class="bi bi-check" style="color:green; font-weight: bold;"></i>
                    <i v-show="c == -1" class="bi bi-x" style="color:red; font-weight: bold;"></i>
                </td>
            </tr>
        </table>
        <br>
    </main>
</template>
<style>
    .disabled{
        background: #dddddd;
        cursor: not-allowed;
    }
    .actived{
        cursor: pointer;
    }
    table, th, td {
    text-align: center;
    vertical-align: middle;
    border: 1px solid black;
    padding: 0;
    margin: 0;
    }
    .header-app{
        font-size: 18px;
        font-weight: bold;
    }
</style>
<script lang="ts">



export default {
  beforeMount(){
    this.refresh();
    this.userWin = 9;
    this.turn = 1;
  },
  data() {
    return {
        turn: 1, // 1, -1
        table: new Array<Array<number>>(),
        userWin: 9,
        arr_move: new Array<Array<number>>(),
        
        // web RTC
        // peerConnection: new RTCPeerConnection({
        //     iceServers: 
        //     [{
        //         urls: "stun:stunserver.stunprotocol.org"
        //     }]
        // }),
        peerConnection: new RTCPeerConnection(),
        dataChannel: new Object() as RTCDataChannel,
        localConnectString: "",
        remoteConnectString: "",
        ready: false,
        user: 0, // 1, -1
    }
  },
  watch: {
    userWin(newVal, oldVal){
        if(newVal == 0){
            return;
        }
        else{
            setTimeout(()=>{
                if(newVal == 1){
                    alert("Player 1 win")
                }
                else{
                    alert("Player 2 win")
                }
                this.refresh();
            }, 2000)
        }
    }
  },
  computed:{
  },
  updated(){
    
  },
  methods: {
    check(row: number, col: number, value: number){
        //debugger;
        console.log("check");
        if(this.turn == 0){
            return;
        }
        if(this.userWin != 0){
            return;
        }
        if(this.user != this.turn && value != this.turn){
            return;
        }
        else if(this.table[row][col] != 0){
            return;
        }
        else{
            this.table[row][col] = value;
        }

        if(this.result(row, col)){
            this.userWin = value;
        }
        // change turn
        else{
            if(this.turn < 0) {
                this.turn = 1
            }
            else{
                this.turn = -1
            }
        }

        var sendData = {
            type: "move",
            row: row,
            col: col,
            value: value
        };
        if(value == this.user){
            this.dataChannel.send(JSON.stringify(sendData));
        }
    },
    result(row: number, col: number){
        // ngang
        var current_value = this.table[row][col]
        var arr_move = [[row, col]]
        var next_row = -1;
        var next_col = -1;
        var flow = "up"// "up", "down"
        for(var i = 0; i < 5; i++){
            next_row = row;
            if(next_col == -1){
                next_col = col + 1
            }
            else{
                if(flow == "up"){
                    next_col = next_col + 1
                }
                else if(flow == "down"){
                    next_col = next_col - 1
                    if(next_col < 0){
                        return false
                    }
                }
            }
            // nếu giá trị ô đang kiểm tra != this.turn thì gán next_col = col và gán flow
            if(this.table[next_row][next_col] != current_value){
                next_col = col;
                if(flow == "up"){
                    flow = "down"
                }
                else{
                    break;
                }
            }
            else{
                arr_move.push([next_row, next_col])
            }
        }
        if(arr_move.length == 5){
            this.arr_move = arr_move;
            return true;
        }

        // dọc
        arr_move = [[row, col]]
        next_row = -1;
        next_col = -1;
        flow = "up"// "up", "down"
        for(var i = 0; i < 5; i++){
            next_col = col;
            if(next_row == -1){
                next_row = row + 1
            }
            else{
                if(flow == "up"){
                    next_row = next_row + 1
                }
                else if(flow == "down"){
                    next_row = next_row - 1
                    if(next_row < 0){
                        return false
                    }
                }
            }
            // nếu giá trị ô đang kiểm tra != this.turn thì gán next_col = col và gán flow
            if(this.table[next_row][next_col] != current_value){
                next_row = row;
                if(flow == "up"){
                    flow = "down"
                }
                else{
                    break;
                }
            }
            else{
                arr_move.push([next_row, next_col])
            }
        }
        if(arr_move.length == 5){
            this.arr_move = arr_move;
            return true;
        }

        // chéo 1 (/) (-+)up   (+-)down
        arr_move = [[row, col]]
        next_row = row;
        next_col = col;
        flow = "up"// "up", "down"
        for(var i = 0; i < 5; i++){
            if(flow == "up"){
                next_row = next_row - 1
                next_col = next_col + 1
            }
            else if(flow == "down"){
                next_row = next_row + 1
                next_col = next_col - 1
            }
            // nếu giá trị ô đang kiểm tra != this.turn thì gán next_col = col và gán flow
            if(next_row < 0 || next_col < 0 || this.table[next_row][next_col] != current_value){
                next_row = row;
                next_col = col;
                if(flow == "up"){
                    flow = "down"
                }
                else{
                    break;
                }
            }
            else{
                arr_move.push([next_row, next_col])
            }
        }
        if(arr_move.length == 5){
            this.arr_move = arr_move;
            return true;
        }

        // chéo 2 (\) (--)up   (++)down
        arr_move = [[row, col]]
        next_row = row;
        next_col = col;
        flow = "up"// "up", "down"
        for(var i = 0; i < 5; i++){
            if(flow == "up"){
                next_row = next_row - 1
                next_col = next_col - 1
            }
            else if(flow == "down"){
                next_row = next_row + 1
                next_col = next_col + 1
            }
            // nếu giá trị ô đang kiểm tra != this.turn thì gán next_col = col và gán flow
            if(next_row < 0 || next_col < 0 || this.table[next_row][next_col] != current_value){
                next_row = row;
                next_col = col;
                if(flow == "up"){
                    flow = "down"
                }
                else{
                    break;
                }
            }
            else{
                arr_move.push([next_row, next_col])
            }
        }
        if(arr_move.length == 5){
            this.arr_move = arr_move;
            return true;
        }

        return false;
    },
    refresh(){
        this.turn = this.userWin;
        this.arr_move = [];
        this.userWin = 0;
        this.table = [];
        for(var i = 0;i<25;i++){
            var item = new Array<number>();
            for(var j = 0;j<60;j++){
                item.push(0);
            }
            this.table.push(item);
        }
    },
    // player 1
    createRoom(){
        this.user = 1;
        this.peerConnection.onicecandidate = this.handleicecandidate(this.lasticecandidate_offer);
        this.peerConnection.onconnectionstatechange = this.handleconnectionstatechange;
        this.peerConnection.oniceconnectionstatechange = this.handleiceconnectionstatechange;

        this.dataChannel = this.peerConnection.createDataChannel('caro');
        this.dataChannel.onopen = this.datachannelopen;
        this.dataChannel.onmessage = this.datachannelmessage;
        
        var createOfferPromise = this.peerConnection.createOffer();
        createOfferPromise.then(this.createOfferDone, this.createOfferFailed);
        console.log(this.peerConnection)
    },

    createOfferDone(offer: any) {
        console.log('createOfferDone');
        var setLocalPromise = this.peerConnection.setLocalDescription(offer);
    },

    createOfferFailed(reason: any) {
        console.log('createOfferFailed');
        console.log(reason);
    },

    lasticecandidate_offer() {
        console.log('lasticecandidate');
        this.localConnectString = JSON.stringify(this.peerConnection.localDescription)
    },
    accept(){
        try {
            this.peerConnection.ondatachannel = this.handledatachannel;
            var partner_json = JSON.parse(this.remoteConnectString);
            var setRemotePromise = this.peerConnection.setRemoteDescription(partner_json);
            setRemotePromise.then(this.setRemoteDoneOffer, this.setRemoteFailedOffer);
        }
        catch(err) {
            console.log('error: ' + err);
        }
    },
    
    setRemoteDoneOffer() {
        console.log('setRemoteDone ' + JSON.stringify(this.peerConnection));
        var func = setTimeout(()=>{
            debugger
            this.userWin = 0
            var sendData = {
                type: "start"
            }
            this.dataChannel.send(JSON.stringify(sendData));
        }, 1000);
    },

    setRemoteFailedOffer(reason: any) {
        console.log('setRemoteFailed');
        console.log(reason);
    },
    //

    // player 2
    joinRoom(){
        this.user = -1;
        this.peerConnection.onicecandidate = this.handleicecandidate(this.lasticecandidate_answer);
        this.peerConnection.onconnectionstatechange = this.handleconnectionstatechange;
        this.peerConnection.oniceconnectionstatechange = this.handleiceconnectionstatechange;
        this.peerConnection.ondatachannel = this.handledatachannel;
    },
    createAnswerDone(answer:any) {
        console.log('createAnswerDone');
        var setLocalPromise = this.peerConnection.setLocalDescription(answer);
        setLocalPromise.then(this.setLocalDone, this.setLocalFailed);
    },

    createAnswerFailed(reason: any) {
        console.log('createAnswerFailed');
        console.log(reason);
    },

    setRemoteDoneAnswer() {
        console.log('setRemoteDone');
        var createAnswerPromise = this.peerConnection.createAnswer();
        createAnswerPromise.then(this.createAnswerDone, this.createAnswerFailed);
    },

    setRemoteFailedAnswer(reason: any) {
        console.log('setRemoteFailed');
        console.log(reason);
    },

    setLocalDone() {
        console.log('setLocalDone ' + JSON.stringify(this.peerConnection));
    },

    setLocalFailed(reason: any) {
        console.log('setLocalFailed');
        console.log(reason);
    },

    lasticecandidate_answer() {
        console.log('lasticecandidate');
        var answer = this.peerConnection.localDescription
        this.localConnectString = JSON.stringify(answer);
    },

    request(){
        try {
            var partner_json = JSON.parse(this.remoteConnectString);
            var setRemotePromise = this.peerConnection.setRemoteDescription(partner_json);
            setRemotePromise.then(this.setRemoteDoneAnswer, this.setRemoteFailedAnswer);
        }
        catch(err) {
            console.log('error: ' + err);
        }
    },

    //


    //common
    handleicecandidate(lasticecandidate: any) {
        return (event: any) => {
            if (event.candidate != null) {
                console.log('new ice candidate');
            } 
            else {
                console.log('all ice candidates');
                lasticecandidate();
            }
            console.log(this.peerConnection)
        }
    },
    handleconnectionstatechange(event:any) {
        console.log('handleconnectionstatechange');
        console.log(event);
    },

    handleiceconnectionstatechange(event:any) {
        console.log('ice connection state: ' + event.target.iceConnectionState);
    },
    handledatachannel(event:any) {
        console.log('handledatachannel');
        this.dataChannel = event.channel;
        this.dataChannel.onopen = this.datachannelopen;
        this.dataChannel.onmessage = this.datachannelmessage;
    },
    datachannelopen() {
        console.log('datachannelopen');
    },

    datachannelmessage(message:any) {  
        debugger
        console.log('datachannelmessage');
        console.log(message);
        var sendData = JSON.parse(message.data);
        if(sendData["type"] == "move"){
            var row : number = + sendData["row"];
            var col : number = + sendData["col"];
            var value : number = + sendData["value"];
            this.check(row, col, value)
        }
        else if(sendData["type"] == "start"){
            this.userWin = 0;
        }
        else if(sendData["type"] == "start"){

        }
    }
  },
  created() {
  },
};
</script>