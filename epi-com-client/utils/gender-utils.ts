import {IDropdownItem} from "@/components/Dropdown";
import {EGender} from "@shared/types";

export const genderOptions: IDropdownItem[] = Object.values(EGender).map((gender) => {
    let label = '';
    switch (gender) {
        case EGender.MALE:
            label = 'זכר';
            break;
        case EGender.FEMALE:
            label = 'נקבה';
            break;
        case EGender.OTHER:
            label = 'אחר';
            break;
    }
    return { label, value: gender };
});
