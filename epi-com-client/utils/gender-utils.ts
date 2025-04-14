import {IDropdownItem} from "@/components/Dropdown";
import {EGender} from "@shared/types";
import i18n from "@/i18n";

export const genderOptions: IDropdownItem[] = Object.values(EGender).map((gender) => {
    let translationKey = '';
    switch (gender) {
        case EGender.MALE:
            translationKey = 'gender.male';
            break;
        case EGender.FEMALE:
            translationKey = 'gender.female';
            break;
        case EGender.OTHER:
            translationKey = 'gender.other';
            break;
    }
    return { label: i18n.t(translationKey), value: gender };
});
