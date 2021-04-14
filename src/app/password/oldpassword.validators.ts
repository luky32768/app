import { AbstractControl, ValidationErrors } from "@angular/forms";
import { resolve } from "dns";
import { promise } from "protractor";

export class OldPasswordValidators {
    static isInvalid(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject)=>{
            setTimeout(()=> {
                if ((control.value as string) !== "1234") 
                    resolve({isInvalid: true});
                
                else resolve(null);
                
            }, 200);
        });
    }
}
