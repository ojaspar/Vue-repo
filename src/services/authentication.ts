import SessionStorageService from '@/services/sessionStorage';

export default class AuthenticationService {
    static authUser = SessionStorageService.decodeToken();

    static events: string[] = ['mousemove', 'click', 'keydown', 'load'];

    // the interval for checking if user should be logged out due to inactivity
    static checkInterval: number = Number(process.env.VUE_APP_AUTO_LOGOUT_CHECK_INTERVAL) || 1;

    // the time to elapse before users are logged out due to inactivity
    static timeUntilAutoLogout: number = Number(process.env.VUE_APP_MINUTES_UNITL_AUTO_LOGOUT) || 5;

    // reset the interval to default time when the user interacts with the application
    static resetInterval() {
        setInterval(
            () => AuthenticationService.checkIfUserShouldBeLoggedOut(),
            AuthenticationService.checkInterval * 60 * 1000,
        );
    }

    private static setLastActivityTime() {
        SessionStorageService.setItem('LAST_ACTIVITY_TIME', Date.now());
    }

    private static attachEventListeners() {
        AuthenticationService.events.forEach(event =>
            window.addEventListener(event, AuthenticationService.setLastActivityTime),
        );
    }

    private static detatchEventListeners() {
        AuthenticationService.events.forEach(event =>
            document.body.removeEventListener(event, AuthenticationService.resetInterval),
        );
    }

    private static checkIfUserShouldBeLoggedOut() {
        const now: number = parseInt(`${Date.now()}`);
        const theLastTimeAnActionOccured =
            parseInt(SessionStorageService.getItem('LAST_ACTIVITY_TIME')) +
            AuthenticationService.timeUntilAutoLogout * 60 * 1000;
        const diff = theLastTimeAnActionOccured - now;
        const timeoutHasElapsed = diff < 0;

        if (timeoutHasElapsed && AuthenticationService.authUser) {
            // TODO we need to provide a better user experience here.
            // Instead of logging users out, we could lock the screen and make them provide their passwords again
            AuthenticationService.logoutUser();
        }
    }

    public static startAutologoutService() {
        AuthenticationService.resetInterval();
        AuthenticationService.attachEventListeners();
        AuthenticationService.setLastActivityTime();
        AuthenticationService.checkIfUserShouldBeLoggedOut();
    }

    public static logoutUser() {
        SessionStorageService.clear();
        AuthenticationService.detatchEventListeners();
        window.location.href = '/login';
    }
}
