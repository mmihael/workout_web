Vue.use(VueResource);
Vue.use(VueRouter);
Vue.http.interceptors.push(function (request, next) { request.credentials = true; next(); });
Vue.filter('ms-to-sec', function (value) {
    var seconds = (value / 1000).toFixed(2);
    return seconds < 10 ? ('0' + seconds) : seconds;
});


Vue.http.get('/configuration.json').then(
function (res) {

var AppConfigPlugin = {
    install: function (Vue, options) {
        Vue.prototype.appConfig = res.data;
    }
};

Vue.use(AppConfigPlugin);

var ApiCommunicationPlugin = {
    install: function (Vue, options) {
        Vue.prototype.authProtectedRequestSuccess = function (handler) {
            return function (res) {
                app.loggedIn = true;
                handler(res);
            };
        };

        Vue.prototype.authProtectedRequestFailed = function (handler) {
            return function (res) {
                if (res.status === 401 && app.$route != null && ['/', '/register'].indexOf(app.$route.path) == -1) {
                    router.push('/');
                    return;
                }
                handler(res);
            };
        };
    }
};

Vue.use(ApiCommunicationPlugin);

var router = new VueRouter({

    routes: [
        { path: '/', component: require('./vue-component/login.js') },
        { path: '/register', component: require('./vue-component/register.js') },
        { path: '/home', component: require('./vue-component/home.js') },
        { path: '/create/workout', component: require('./vue-component/workout-form.js') },
        { path: '/list/workouts', component: require('./vue-component/workout-list.js') },
        { path: '/create/exercise', component: require('./vue-component/exercise-form.js') },
        { path: '/workout/pick', component: require('./vue-component/workout-pick.js') },
        { path: '/users/workout/:id', component: require('./vue-component/users-workout.js') },
        { path: '/list/user/workouts', component: require('./vue-component/users-workout-list.js') },
    ]

});

/*router.beforeEach(function (to, form, next) {
    if (to.path != '/' && (app == null || !app.loggedIn)) {
        return router.push('/');
    }
    next();
});*/

var app = new Vue({

    el: '#app',

    router: router,

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/auth-status').then(
            this.authProtectedRequestSuccess(function (res) { this.status = res.data.status; }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: {
        loggedIn: false,
    },

    methods: {

        __loggedIn: function () { this.loggedIn = true; router.push('/home'); },

        _logOut: function () {
            this.$http.get(this.appConfig.baseUrl + '/logout').then(
                function (res) { if (res.status === 200) { this.loggedIn = false; router.push('/'); } },
                function (res) { console.log(res); }
            );
        },
    }

});

},
function (res) {
console.log("Can't find config json");
console.log(res);
}
);