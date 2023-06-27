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
        <br>
        <audio id="stream_data" autoplay controls></audio>
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
  },
  data() {
    return {
        peerConnection: new RTCPeerConnection(),
        dataChannel: new Object() as RTCDataChannel,
        localConnectString: "",
        remoteConnectString: "",
        ready: false,
        user: 0, // 1, -1
    }
  },
  watch: {
  },
  computed:{
  },
  updated(){
    
  },
  methods: {
    refresh(){
    },
    // player 1
    createRoom(){
        this.user = 1;
        this.peerConnection.onicecandidate = this.handleicecandidate(this.lasticecandidate_offer);
        this.peerConnection.onconnectionstatechange = this.handleconnectionstatechange;
        this.peerConnection.oniceconnectionstatechange = this.handleiceconnectionstatechange;

        this.dataChannel = this.peerConnection.createDataChannel('speech');
        this.dataChannel.onopen = this.datachannelopen;
        this.dataChannel.onmessage = this.datachannelmessage;
        
        var createOfferPromise = this.peerConnection.createOffer();
        createOfferPromise.then(this.createOfferDone, this.createOfferFailed);

        //stream data
        this.peerConnection.ontrack = this.gotRemoteStream;
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        .then(this.gotStream)
        .catch(e => {
            alert(`getUserMedia() error: ${e.name}`);
        });
        console.log(this.peerConnection)
    },

    gotRemoteStream(e: RTCTrackEvent){
        var audio = document.getElementById("stream_data") as HTMLMediaElement;
        audio.srcObject = e.streams[0];
    },
    gotStream(stream: MediaStream) {
        console.log('Received local stream');
        let localStream = stream;
        const audioTracks = localStream.getAudioTracks();
        if (audioTracks.length > 0) {
            console.log(`Using Audio device: ${audioTracks[0].label}`);
        }
        localStream.getTracks().forEach((track: any) => 
        {
            this.peerConnection.addTrack(track, localStream);
        });
        console.log(this.peerConnection);
        console.log('Adding Local Stream to peer connection');
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

        //stream data
        debugger
        this.peerConnection.ontrack = this.gotRemoteStream;
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        .then(this.gotStream)
        .catch(e => {
            alert(`getUserMedia() error: ${e.name}`);
        });
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
        }
        else if(sendData["type"] == "start"){

        }
    }
  },
  created() {
  },
};
</script>