export default {
    getCookie: function (name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[ i ];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    },
    setCookie: function (name, value, option) {
        let expires = '';
        let domain = '';
        if (option) {
            if (option.days) {
                const date = new Date();
                date.setTime(date.getTime() + (option.days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }
            if (option.domain) {
                domain = option.domain;
            }
        }
        document.cookie = name + '=' + value + expires + '; domain=' + domain + '; path=/';
    }
};
