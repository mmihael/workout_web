Vue.http.get('/configuration.json').then(
function (res) {

var config = res.data;

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
        if (res.status === 401 && app.$route != null && ['/', '/register'].indexOf(app.$route.path) == -1) {
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

        _goToRegister: function () {
            router.push('/register');
        },

        _login: function () {
            this.$http.post(
                config.baseUrl + '/login',
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

var register = Vue.component('register', {

    template: document.getElementById('register').innerHTML,

    data: function () { return {
        req: {
            username: '',
            email: '',
            password: '',
            passwordRepeat: ''
        },
        errors: {
            username: ''
        },
        message: ''
    }; },

    methods: {

        _goToLogin: function () {
            router.push('/');
        },

        _register: function () {

            Object.keys(this.errors).forEach(function (key) {
                this.errors[key] = '';
            }.bind(this));

            this.$http.post(config.baseUrl + '/api/register', this.req, { headers: { 'Content-Type': 'application/json'}}).then(
                function (res) {
                    if (res.status === 201) {
                        this.message = res.data.message;
                        console.log(res.data.user);
                    }
                },
                function (res) {
                    if (res.status === 400) {
                    console.log(res.data)
                        Object.keys(res.data.errors).forEach(function (key) {
                            this.$set(this.errors, key, res.data.errors[key]);
                        }.bind(this));
                    }
                }
            );
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
        this.$http.get(config.baseUrl + '/api/exercise').then(
            authProtectedRequestSuccess(function (res) { this.formOptions.exercises = res.data; }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {

        _submit: function () {
            this.$http.post(config.baseUrl + '/api/workout', this.workout, { headers: { 'Content-Type': 'application/json'}}).then(
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
            this.workout.workoutExerciseOrder.push({
                exercise: exercise.id,
                name: exercise.name,
                order: this.workout.workoutExerciseOrder.length + 1
            });
        }

    },

    data: function () { return {
        workout: {
            name: '',
            workoutExerciseOrder: [],
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
        this.$http.get(config.baseUrl + '/api/workout').then(
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
            this.$http.post(config.baseUrl + '/api/exercise', this.exercise, { headers: { 'Content-Type': 'application/json'}}).then(
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
        exercise: { name: '', bodyWeight: false },
        message: '',
        errors: { name: '' }
    }; }

});

var workoutPick = Vue.component('workoutPick', {

    template: document.getElementById('workout-pick').innerHTML,

    beforeMount: function () {
        this.$http.get(config.baseUrl + '/api/workout').then(
            authProtectedRequestSuccess(function (res) { this.workouts = res.data; }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {
        _startWorkout: function (workoutId) {
            this.$http.post(config.baseUrl + '/api/user/workout', { workout: workoutId }, { headers: { 'Content-Type': 'application/json'}}).then(
                authProtectedRequestSuccess(function (res) {
                    console.log(res);
                    console.log(res.body.usersWorkout.id);
                    router.push('/users/workout/' + res.body.usersWorkout.id);
                }.bind(this)),
                authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        }
    },

    data: function () { return {
        workouts: []
    }; }

});

var usersWorkout = Vue.component('usersWorkout', {

    template: document.getElementById('users-workout').innerHTML,

    beforeMount: function () {
        this.$http.get(config.baseUrl + '/api/user/workout/' + this.$route.params.id).then(
            authProtectedRequestSuccess(function (res) { this.usersWorkout = res.data; console.log(this.usersWorkout); }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {

        _updateUsersWorkoutStatistic: function (usersWorkoutStatistic) {
            console.log(usersWorkoutStatistic);
            this.$http.patch(config.baseUrl + '/api/user/workout/statistic/' + usersWorkoutStatistic.id, usersWorkoutStatistic, { headers: { 'Content-Type': 'application/json'}}).then(
                authProtectedRequestSuccess(function (res) {
                    console.log(res);
                }.bind(this)),
                authProtectedRequestFailed(function (res) { console.log("error"); })
            );
        }

    },

    data: function () { return {
        usersWorkout: {
            workout: {},
            usersWorkout: {},
            exercises: {},
            workoutExerciseOrder: {},
            usersWorkoutStatistics: {},
        }
    }; }
});

var usersWorkoutList = Vue.component('usersWorkoutList', {

    template: document.getElementById('users-workout-list').innerHTML,

    beforeMount: function () {
        this.$http.get(config.baseUrl + '/api/user/workout').then(
            authProtectedRequestSuccess(function (res) { this.usersWorkouts = res.data; console.log(this.usersWorkouts); }.bind(this)),
            authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    data: function () { return {
        usersWorkouts: []
    }; }

});

var router = new VueRouter({

    routes: [
        { path: '/', component: login },
        { path: '/register', component: register },
        { path: '/home', component: home },
        { path: '/create/workout', component: workoutForm },
        { path: '/list/workouts', component: workoutList },
        { path: '/create/exercise', component: exerciseForm },
        { path: '/workout/pick', component: workoutPick },
        { path: '/users/workout/:id', component: usersWorkout },
        { path: '/list/user/workouts', component: usersWorkoutList },
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
        this.$http.get(config.baseUrl + '/api/auth-status').then(
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
            this.$http.get(config.baseUrl + '/logout').then(
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