import { MEETUP_API_KEY } from './config';
import * as qs from 'qs';

import * as moment from 'moment';

const LINK_REGEX = /<(.*)>; rel="next"/i;

export default class Meetup {
    async findUntil() {
        const nextWeek = moment().add(1, 'week');
        let pastDate = false;

        const options = {
            key: MEETUP_API_KEY,
            omit: 'description',
            radius: 'smart',
        };
        let nextURL = `https://api.meetup.com/find/events?${qs.stringify(options)}`;

        do {


            const response = await fetch(nextURL);
            console.log(response.headers);

            const data = await response.json();
            pastDate = data.some(item => {
                const pastDate = moment(item.time).isAfter(nextWeek);

                return pastDate;
            });

            const link = response.headers.get('link') || '';

            const m = link.match(LINK_REGEX);
            if (!m) {
                break;
            }

            nextURL = m[1];
        } while (false);
    }
}
