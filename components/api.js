import * as request from "superagent"
import {EventEmitter} from "events"

export default class Api extends EventEmitter{

    constructor(params,wsUri=""){
        super();
        this.que = [];
        this.attempt = 1;
        this.requests = {};
        this.ready = false;
        this.usingWs = false;
        let defaultConfig = {
            webUri: "",
            wsUri: "",
            useWs: true,
            autoReconnect: true
        };
        if(typeof params == "string"){
            defaultConfig.webUri = params;
            this.config = defaultConfig;
            defaultConfig.wsUri = wsUri;
        }else{
            this.config = params;
        }

        if(this.config.useWs){
            this.connect();
            this.emit("connecting");
            this.usingWs = true;
        }else{
            this.ready = true;
            this.supportsUpdates = false;

        }
    }

    request(ns,action,params,callback,onDone){
        let requestId = this.generateRequestId();

        let request = {
            messageType: "request",
            requestId: requestId,
            params: {
                params,
                namespace: ns,
                action
            }
        };

        if(this.usingWs){


            this.sendWs(request);

            let cancel = () => {
                this.sendWs({
                    messageType: "cancelRequest",
                    requestId: requestId
                })
            };
            this.requests[requestId] = {
                onDone: onDone != null ? onDone : () => {},
                callback: callback,
                cancel: cancel
            };

            return this.requests[requestId];

        }else{
            this.requestHTTP(ns,action,params,callback);
        }

    }

    generateRequestId(){
        return Date.now()*Math.random()*Math.random().toString();
    }

    getUrl(ns,action,ws=false){


        return this.config.webUri+"/"+ns+"/"+action;


    }

    sendWs(data){
        if(this.ready){
            this.connection.send(JSON.stringify(data));
        }else{
            this.que.push(data);
        }
    }

    upload(namespace,action,file,params,callback){
        let req = request
            .post(this.getUrl(namespace,action))
            .withCredentials()
            .attach("file",file);

        Object.keys(params).map((key) => {
            req = req.field(key,params[key]);
        });

        req.end(callback);
    }

    connect(){
        this.requestHTTP("main","about",{},(err,res) => {
            if (err == null) {
                this.connection = new WebSocket(this.config.wsUri);

                this.connection.onclose = () => {
                    this.emit("closed");
                    this.reConnect();
                };

                this.connection.onerror = () => {
                    this.emit("closed");
                    this.reConnect();
                };

                this.connection.onopen = () => {
                    this.attempt = 0;
                    this.ready = true;
                    this.emit("ready");
                    for(let item of this.que){
                        this.connection.send(JSON.stringify(item));
                    }
                    this.que = [];
                };

                try{
                    clearTimeout(this.reConnectTimeout);
                }catch(e){

                }

                this.connection.onmessage = (data) => {
                    let message;
                    try {
                        message = JSON.parse(data.data);
                    } catch (e) {
                        console.error("Error while parsing message", e);
                    }


                    switch (message.messageType) {

                        case "response":

                            if (this.requests[message.requestId] != null) {
                                this.requests[message.requestId].callback(null, message.params);
                            }
                            break;

                        case "error":
                            this.emit("requestError",message.params);
                            if (this.requests[message.requestId] != null) {
                                console.log("found error");
                                this.requests[message.requestId].callback(message.params, null);
                            }

                            break;

                        case "done":

                            if (this.requests[message.requestId] != null) {
                                this.requests[message.requestId].onDone();
                                delete this.requests[message.requestId];
                            }

                            break;


                    }
                };

            }else{
                this.emit("connnectionError",err);
                this.reConnect();
            }
        })
    }

    reConnect(){
        this.reConnectTimeout = setTimeout( () => {

            this.attempt++;
            this.connect();


        },Math.pow(this.attempt,2)*1000);
    }


    requestHTTP(namespace,action,params,callback){
        request.post(this.getUrl(namespace,action)).withCredentials().send(params).end(
            (err,res) => {
                if(err != null){
                    callback({
                        errorCode: "httpError",
                        description: "Could not connect to Http Server",
                        additionalData: err
                    })
                }else{
                    res = res.text;
                    let data = null;
                    try{
                        data = JSON.parse(res);
                    }catch(e){
                        console.log(e);
                        callback({
                            errorCode: "parseError",
                            description: "Could not decode the response",
                            additionalData: e
                        })
                    }
                    if(data.messageType == "response"){
                        callback(null,data.params);
                    }else{
                        callback(data.error);
                    }
                }
            }
        )
    }

}


