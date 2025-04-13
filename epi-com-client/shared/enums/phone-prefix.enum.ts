import {EGender} from "@/utils/gender-utils";
import {IDropdownItem} from "@/components/Dropdown";

export enum EPhonePrefix {
    PARTNER = '054',
    CELLCOM = '052',
    PELEPHONE = '050',
    HOT_MOBILE = '053',
    GOLAN_TELECOM = '058',
    WE4G = '055',
    RAMI_LEVI = '051'
}

export const phonePrefixOptions: IDropdownItem[] = Object.values(EPhonePrefix).map((prefix: EPhonePrefix) => {
    return { label: prefix, value: prefix };
});
