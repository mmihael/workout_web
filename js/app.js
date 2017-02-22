var config = {
    apiUrl: 'http://localhost:8080'
};

Vue.http.interceptors.push(function (request, next) {
    request.credentials = true;
    next();
});

var authProtectedRequestSuccess = function (handler) {
    return function (res) {
        app.loggedIn = true;
        handler(res);
    };
};

var authProtectedRequestFailed = function (handler) {
    return function (res) {
        if (res.status === 401) {
            router.push('/');
            return;
        }
        handler(res);
    };
};

var login = Vue.component('login', {

    template: document.getElementById('login').innerHTML,

    data: function () { return {
        username: '',
        password: ''
    }; },

    methods: {
        _login: function () {
            this.$http.post(
                config.apiUrl + '/login',
                "username=" + encodeURIComponent(this.username) + "&password=" + encodeURIComponent(this.password),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
            ).then(function (res) {
                if (res.status === 200) {
                    this.$emit('logged-in');
                } else {
                    alert("Invalid login");
                }
            }, function (res) {
                console.log(0);
                console.log(res);
            });
        },
    }

});


var home = Vue.component('home', {

    template: document.getElementById('home').innerHTML,

    data: function () { return {}; }

});

var workoutForm = Vue.component('workoutForm', {

    template: document.getElementById('workout-form').innerHTML,

    beforeMount: function () {
        this.$http.get(config.apiUrl + '/api/exercise').then(
            authProtectedRequestSuccess(function (res) { this.formOptions.exercises = res.data; }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {

        _submit: function () {
            this.$http.post(config.apiUrl + '/api/workout', this.workout, { headers: { 'Content-Type': 'application/json'}}).then(
                authProtectedRequestSuccess(function (res) {
                    if (res.status === 201) {
                        this.message = res.data.message;
                    }
                }.bind(this)),
                authProtectedRequestFailed(function (res) {
                    if (res.status === 400) {
                    console.log(res.data)
                        Object.keys(res.data.errors).forEach(function (key) {
                            this.errors[key] = res.data.errors[key];
                        }.bind(this));
                    }
                    console.log(res);
                    console.log("error");
                }.bind(this))
            );
        },

        _addExercise: function (exercise) {
            this.workout.exercises.push(exercise);
        }

    },

    data: function () { return {
        workout: {
            name: '',
            exercises: [],
        },
        formOptions: {
            exercises: []
        },
        message: '',
        errors: { name: '' }
    }; }

});

var workoutList = Vue.component('workoutList', {

    template: document.getElementById('workout-list').innerHTML,

    beforeMount: function () {
        this.$http.get(config.apiUrl + '/api/workout').then(
            authProtectedRequestSuccess(function (res) { this.workouts = res.data; }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: function () { return {
        workouts: []
    }; }

});

var exerciseForm = Vue.component('exerciseForm', {

    template: document.getElementById('exercise-form').innerHTML,

    methods: {

        _submit: function () {
            this.$http.post(config.apiUrl + '/api/exercise', this.exercise, { headers: { 'Content-Type': 'application/json'}}).then(
                authProtectedRequestSuccess(function (res) {
                    if (res.status === 201) {
                        this.message = res.data.message;
                    }
                }.bind(this)),
                authProtectedRequestFailed(function (res) {
                    if (res.status === 400) {
                    console.log(res.data)
                        Object.keys(res.data.errors).forEach(function (key) {
                            this.errors[key] = res.data.errors[key];
                        }.bind(this));
                    }
                    console.log(res);
                    console.log("error");
                }.bind(this))
            );
        }

    },

    data: function () { return {
        exercise: { name: '' },
        message: '',
        errors: { name: '' }
    }; }

});


var router = new VueRouter({

    routes: [
        { path: '/', component: login },
        { path: '/home', component: home },
        { path: '/create/workout', component: workoutForm },
        { path: '/list/workouts', component: workoutList },
        { path: '/create/exercise', component: exerciseForm },
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
        this.$http.get(config.apiUrl + '/api/auth-status').then(
            authProtectedRequestSuccess(function (res) { this.status = res.data.status; }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: {
        loggedIn: false,
    },

    methods: {

        __loggedIn: function () { this.loggedIn = true; router.push('/home'); },

        _logOut: function () {
            this.$http.get(config.apiUrl + '/logout').then(
                function (res) { if (res.status === 200) { this.loggedIn = false; router.push('/'); } },
                function (res) { console.log(res); }
            );
        },
    }

});