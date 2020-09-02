
namespace cw01_att
{

    class cw01_int_var123 {
        res: string
        NEWLINE: string
        DEVICE_ID: string
        TOKEN: string
        asset_name: string
        constructor() {
            this.res = ""
            this.NEWLINE = "\u000D\u000A"
            this.DEVICE_ID = ""
            this.TOKEN = ""
            this.asset_name = ""
        }
    }

    class button_class {
        sending_data: boolean

        constructor() {
            this.sending_data = false
        }
    }

    let cw01_button_object = new button_class()
    let cw01_vars = new cw01_int_var123()
    let en_Feedback: boolean = true

    /**
    * Connect to W-Fi 
    */
    //% weight=91 color=#ad0303
    //% group="Common"
    //% blockId="connectToWifi" block="CW01 connect to WiFi SSID %SSID password %PSK"
    export function connectToWifi(SSID: string, PSK: string): void {
        serial.writeString("AT+CWMODE=1" + cw01_vars.NEWLINE)
        basic.pause(100)
        serial.readString()
        serial.writeString("AT+CWJAP=\"" + SSID + "\",\"" + PSK + "\"" + cw01_vars.NEWLINE)
        basic.pause(200)
        serial.readString()

        let loop_count = 0

        do {
            cw01_vars.res = serial.readString()
            basic.pause(1000)
            loop_count++

            if(loop_count == 20)
                break
        } while (!cw01_vars.res.includes("WIFI CONNECTED"));

        if (cw01_vars.res.includes("WIFI CONNECTED")) {
            basic.showString("C")
            basic.pause(2000)
            basic.showString("")
            cw01_vars.res = ""
        }

        if(loop_count == 20)
        {
            basic.showString("D")
            basic.pause(2000)
            basic.showString("")
        }
    }

    /**
    * Enable feedback through microbit Matrix LEDs
    */
    //% weight=91 color=#ad0303
    //% group="Common"
    //% blockId="enableFeedback" block="CW01 enable feedback LEDs %u"
    export function enableFeedback(u: boolean): void
    {
        en_Feedback = u
    }

    /**
    * Connect to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="connectToATT" block="CW01 connect to ATT with token %TKN and device-id %ID"
    export function connectToATT(TKN: string, ID: string): void {
        cw01_vars.DEVICE_ID = ID
        cw01_vars.TOKEN = TKN
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.allthingstalk.io\",80" + cw01_vars.NEWLINE)
        basic.pause(500)
    }


    /**
    * Send string data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStringToATT" block="CW01 send string %value to ATT asset %asset"
    export function IoTSendStringToATT(value: string, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + value + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false

    }

    /**
    * Send numerical data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendValueToATT" block="CW01 send value %value to ATT asset %asset"
    export function IoTSendValueToATT(value: number, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + value.toString() + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false
    }

    /**
    * Send boolean data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendStateToATT" block="CW01 send state %state to ATT asset %asset_name"
    export function IoTSendStateToATT(state: boolean, asset: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }


        cw01_button_object.sending_data = true

        do {

            let stateStr: string

            if (state == true) {
                stateStr = "true"
            } else {
                stateStr = "false"
            }

            cw01_vars.asset_name = asset
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": " + stateStr + "}"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false


    }

    /**
    * Send boolean data to AllThingsTalk IoT platform
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTSendGPSToATT" block="CW01 send GPS latitude %lat and lonitude %lon to ATT asset %asset_name"
    export function IoTSendGPSToATT(lat: string, lon: string, asset_name: string): void {

        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }


        cw01_button_object.sending_data = true

        do {

            cw01_vars.asset_name = asset_name
            serial.writeString("AT+CIPMODE=0" + cw01_vars.NEWLINE)
            basic.pause(100)
            let payload: string = "{\"value\": {\"latitude\":" + lat +", \"longitude\":" + lon + "} }"
            let request: string = "PUT /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE +
                "Content-Type:application/json" + cw01_vars.NEWLINE +
                "Content-Length: " + (payload.length).toString() + cw01_vars.NEWLINE + cw01_vars.NEWLINE + payload + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1000)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            get_status()

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false


    }

    /**
    * Get latest value of asset from AllThingsTalk IoT platform. Asset can be string, numerical and boolean
    */
    //% weight=91
    //% group="ATT"
    //% blockId="IoTgetATTAssetValue" block="CW01 get ATT asset %asset state"
    export function IoTgetATTAssetValue(asset: string): string {
        let att_connected: string = ""

        while (cw01_button_object.sending_data) {
            basic.pause(100)
        }

        cw01_button_object.sending_data = true


        cw01_vars.res = ""
        let index1: number
        let index2: number
        let value: string

        do {

            cw01_vars.asset_name = asset
            basic.pause(100)
            let request: string = "GET /device/" + cw01_vars.DEVICE_ID + "/asset/" + cw01_vars.asset_name + "/state" + " HTTP/1.1" + cw01_vars.NEWLINE +
                "Host: api.allthingstalk.io" + cw01_vars.NEWLINE +
                "User-Agent: CW01/1.0" + cw01_vars.NEWLINE +
                "Accept: */*" + cw01_vars.NEWLINE +
                "Authorization: Bearer " + cw01_vars.TOKEN + cw01_vars.NEWLINE + cw01_vars.NEWLINE


            serial.writeString("AT+CIPSEND=" + (request.length + 2).toString() + cw01_vars.NEWLINE)
            basic.pause(50)
            serial.writeString(request + cw01_vars.NEWLINE)
            basic.pause(1200)

            att_connected = serial.readString()

            if (att_connected.includes("link is not valid")) {
                connectToATT(cw01_vars.TOKEN, cw01_vars.DEVICE_ID)
            } else {
                att_connected = ""
            }

            if (!att_connected.includes("link is not valid")) {
                serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
                basic.pause(100)
                serial.readString()
                basic.pause(400)
                serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
                basic.pause(400)
                cw01_vars.res += serial.readString()
                index1 = cw01_vars.res.indexOf("\"value\":") + "\"value\":".length
                index2 = cw01_vars.res.indexOf("}", index1)
                value = cw01_vars.res.substr(index1, index2 - index1)
            }

        } while (att_connected.includes("link is not valid"))

        cw01_button_object.sending_data = false

        return value

    }

    function get_status(): boolean {

        basic.pause(400)
        serial.writeString("AT+CIPRECVDATA=200" + cw01_vars.NEWLINE)
        basic.pause(300)
        cw01_vars.res = serial.readString()

        if(en_Feedback)
        {
            if (cw01_vars.res.includes("HTTP/1.1 200") || cw01_vars.res.includes("HTTP/1.0 200") || cw01_vars.res.includes("HTTP/1.1 201") || cw01_vars.res.includes("HTTP/1.0 202")) {
                basic.showIcon(IconNames.Yes, 50)
                basic.showString("", 50)
                return true
            } else {
                basic.showIcon(IconNames.No, 50)
                basic.showString("", 50)
                return false
            }
        }else {
            if (cw01_vars.res.includes("HTTP/1.1 200") || cw01_vars.res.includes("HTTP/1.0 200") || cw01_vars.res.includes("HTTP/1.1 201") || cw01_vars.res.includes("HTTP/1.0 202"))
            {
                basic.pause(200)
                return true
            }else{
                basic.pause(200)
                return false
            }
        }
    }
}