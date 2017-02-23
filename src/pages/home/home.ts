import { Component, NgZone } from '@angular/core';
import {BLE} from 'ionic-native';
import { NavController } from 'ionic-angular';
import { SingleDevicePage } from '../singleDevice/singleDevice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  devices: any;
  //a device looks like this... {"name":"ButtonLE","id":"84:68:3E:00:70:FB","advertising":{},"rssi":-82}

  constructor(public navCtrl: NavController, private zone: NgZone) {
    this.devices = [];
  }

  scanDevices() {
    if (BLE.isEnabled) {
      BLE.enable();
    }
    //subscribe doesn't have anything to do with the bluetooth... (scan return an observable and .subscribe() is the way to get notified when the observable changes)
    //every time it finds a new device it adds it to the array
    BLE.scan([], 20).subscribe((device) => {
      console.log(JSON.stringify(device));
      this.zone.run(() => { //running inside the zone because otherwise the view is not updated
        this.devices.push(device)
      });
    }, function(error) {
      console.log(error);
    });

    console.log(this.devices);
  }

  goToSecondPage(){
    this.navCtrl.push(SingleDevicePage, {
      device: {id:'gino'}
    });
  }

  openDevicePage(id) {
      this.navCtrl.push(SingleDevicePage, {
        deviceID: id
      });
  }
}
