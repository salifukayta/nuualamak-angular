import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ValidationMessageService {

  public maxLengthEmail = 40;
  public minLengthUsername = 3;
  public maxLengthUsername = 20;
  public minLengthPassword = 6;
  public maxLengthPassword = 20;
  public minLengthRoomName = 5;
  public maxLengthRoomName = 20;
  public maxAge = 149;
  public maxLengthCountry = 50;
  public maxLengthLocation = 50;
  public maxLengthHobbies = 50;


  validationMessages = {
    'email': {
      'required': this.required('Email'),
      'maxlength': this.maxLength('Email', this.maxLengthEmail),
      'incorrectMailFormat': this.incorrectFormat('Email')
    },
    'username': {
      'required': this.required('Username'),
      'minlength': this.minLength('Username', this.minLengthUsername),
      'maxlength': this.maxLength('Username', this.maxLengthUsername)
    },
    'password': {
      'required': this.required('Password'),
      'minlength': this.minLength('Password', this.minLengthPassword),
      'maxlength': this.maxLength('Password', this.maxLengthPassword)
    },
    'confirmPassword': {
      'required': this.required('Confirm Password'),
      'notMatch': this.match('Confirm Password', 'Password')
    },
    'roomName': {
      'required': this.required('Room Name'),
      'minlength': this.minLength('Room Name', this.minLengthRoomName),
      'maxlength': this.maxLength('Room Name', this.maxLengthRoomName)
    },
    'age': {
      'pattern': this.maxValue('Age', this.maxAge)
    },
    'country': {
      'maxlength': this.maxLength('Country', this.maxLengthCountry)
    },
    'location': {
      'maxlength': this.maxLength('Location', this.maxLengthLocation)
    },
    'hobbies': {
      'maxlength': this.maxLength('Hobbies', this.maxLengthHobbies)
    },
    'itemName': {
      'required': this.required('Item Name')
    },
    'itemFontName': {
      'required': this.required('Font Name')
    },
    'itemFontColor': {
      'required': this.required('Font Name')
    },
    'itemDaysToExpire': {
      'pattern': this.required('Number of days to expire')
    },
    'itemPrice': {
      'pattern': this.required('Item Price')
    },
    'itemCategory': {}
  };

  onValueChanged(currentForm: FormGroup, formErrors: any) {
    if (!currentForm) {
      return;
    }
    for (const field in formErrors) {
      // clear previous error messageService (if any)
      formErrors[field] = '';
      const control = currentForm.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          formErrors[field] += messages[key] + '\n';
        }
      }
    }
  }

  private minLength(field, minLength): string {
    return `The ${field} must be at least ${minLength} characters long.`;
  }

  private maxLength(field: string, maxLength: number): string {
    return `The ${field} cannot be more than ${maxLength} characters long.`;
  }

  private maxValue(field: string, maxValue: number) {
    return `The ${field} cannot be more than ${maxValue}.`;
  }

  private required(field: string): string {
    return `The ${field} is required.`;
  }

  private match(field1: string, field2: string) {
    return `${field1} doesn\'t match ${field2}.`;
  }

  private incorrectFormat(field: string) {
    return `The ${field} format is not correct.`
  }
}
