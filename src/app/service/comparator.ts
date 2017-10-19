import {Profile} from '../model/profile';
import {isNullOrUndefined} from '../util/helper';

export function profileComparator(pr1: Profile, pr2: Profile): boolean {
    if (isNullOrUndefined(pr1) || isNullOrUndefined(pr2)) {
        return false;
    }
    return pr1.id === pr2.id;
}
