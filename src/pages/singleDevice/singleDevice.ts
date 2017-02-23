import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BLE} from 'ionic-native';

/*
  Generated class for the SingleDevice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-singleDevice',
  templateUrl: 'singleDevice.html'
})
export class SingleDevicePage {

  deviceID:any;
  deviceName:null;
  isConnected:boolean;

  red:number;
  green:number;
  blue:number;
  hexcolor:string;

  service_UUID="19B10010-E8F2-537E-4F6C-D104768A1214";
  color_UUID="19B10011-E8F2-537E-4F6C-D104768A1214";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.deviceID = navParams.get("deviceID");
    this.connect(this.deviceID);

    this.isConnected=false;
    this.red=20;
    this.green=20;
    this.blue=20;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleDevicePage');
  }

  connect(id) {
    BLE.connect(id).subscribe((device) => {
      console.log(JSON.stringify(device));
      this.deviceName=device.name;
      this.checkConnection();
    })
  }

  checkConnection(){
    BLE.isConnected(this.deviceID)
    .then(()=>{
      console.log("connected")
      this.isConnected=true;
    },()=>{
      console.log("disconnected")
      this.isConnected=false;
    });
  }

  updateColors(){
    this.hexcolor="#"+this.red.toString(8)+this.green.toString(8)+this.blue.toString(8);

    var colorData = new Uint8Array(3);
    colorData[0] = this.red;
    colorData[1] = this.green;
    colorData[2] = this.blue;

    BLE.write(this.deviceID, this.service_UUID, this.color_UUID, colorData.buffer)
    .then((response)=>{
      console.log(response);
    },(error)=>{
      console.log(error);
    });
  }
}
