const $USER_PROVIDER = $USER_PROVIDER_FACTORY();

function $USER_PROVIDER_FACTORY() {
    /**
     * Requests and returns user info
     *
     * @returns {Promise<any>} user info
     */
    function getUserInfo(data) {
        try {
            // fetch
        } catch (error) {
            $$DEBUG &&
                console.log('[n01.RCU.spy.user][error] getUserInfo', error?.message ?? error);
        }
    }

    return {
        get: getUserInfo,
    };
}
