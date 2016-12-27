import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ItemModel } from './item.model';
import { UserModel } from '../../shared/user/user.model';
import { ItemBoughtModel } from './item-bought.model';
import { UserService } from '../../shared/user/user-service';

@Injectable()
export class ItemService {

  private refItemsList: firebase.database.Reference;
  private refItemsBought: firebase.database.Reference;

  constructor(public userService: UserService) {
    this.refItemsList = firebase.database().ref('itemsList');
    this.refItemsBought = firebase.database().ref('itemsBought');
  }

  getAll() {
    return this.refItemsList.once('value')
      .then((data) => {
        let items = data.val();
        return items ? Object.keys(items).map(index => items[index]) : [];
      });
  }

  add(newItem: ItemModel) {
    let newItenId = this.refItemsList.push().key;
    newItem.id = newItenId;
    return this.refItemsList.child(newItenId).update(newItem);
  }

  buy(user: UserModel, item: ItemModel) {
    let newBoughtItemId = this.refItemsBought.child(user.uid).push().key;
    let itemToBuy = <ItemBoughtModel>{
      id: newBoughtItemId,
      userUid: user.uid,
      itemId: item.id,
      isActivated: false
    };
    return this.refItemsBought.child(user.uid).child(newBoughtItemId).set(itemToBuy)
      .then(() => {
        user.nuuBits = user.nuuBits - item.price;
        return this.userService.updateUserInfo(user);
      });
  }

  getItemsBought(user: UserModel) {
    return this.refItemsBought.child(user.uid).once('value')
      .then(data => {
        let itemsBought = data.val();
        return itemsBought ? Object.keys(itemsBought).map(index => itemsBought[index]) : [];
      });
  }

  getActiveItemsBought(user: UserModel): any {
    return this.refItemsBought.child(user.uid).once('value')
      .then(dataItemsBought => {
        let itemsBought = dataItemsBought.val();
        let itemsBoughtActivated = itemsBought ? Object.keys(itemsBought)
          .map(itemBoughtId => itemsBought[itemBoughtId])
          .filter(itemBought => itemBought.isActivated) : [];

        return Promise.all(itemsBoughtActivated.map(itemsBought => {
          return this.refItemsList.child(itemsBought.itemId).once('value')
            .then(data => data.val());
        }));
      });
  }

  activate(itemToActivate: ItemBoughtModel, itemsBought: Array<ItemBoughtModel>, items: Array<ItemModel>) {
    let activationDate = itemToActivate.activationDate ? itemToActivate.activationDate : new Date().getTime();
    itemToActivate.isActivated = true;
    itemToActivate.activationDate = activationDate;
    let updates = {};
    updates[itemToActivate.id] = itemToActivate;
    itemsBought
      .filter(itemBought => this.getItemCategory(itemBought, items) === this.getItemCategory(itemToActivate, items))
      .filter(itemBought => itemBought.id !== itemToActivate.id)
      .map(itemBought => {
        itemBought.isActivated = false;
        updates[itemBought.id] = itemBought;
      });

    return this.refItemsBought.child(itemToActivate.userUid)
      .update(updates);
  }

  private getItemCategory(itemToActivate: ItemBoughtModel, items: Array<ItemModel>) {
    return items.filter(item => itemToActivate.itemId === item.id)[0].category;
  }

}
