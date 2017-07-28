module.exports = Vue.component('workoutPick', {

    template: require('raw-loader!./templates/workout-pick.html'),

    beforeMount: function () {
        this.$http.get(this.appConfig.baseUrl + '/api/workout').then(
            this.authProtectedRequestSuccess(function (res) { this.workouts = res.data; }.bind(this)),
            this.authProtectedRequestFailed(function (res) { console.log("error"); })
        );
    },

    methods: {
        _resetRequest: function () {
            this.request.copyLast = false;
        },
        _startWorkout: function () {
            this.$http.post(this.appConfig.baseUrl + '/api/user/workout', this.request, { headers: { 'Content-Type': 'application/json'}}).then(
                this.authProtectedRequestSuccess(function (res) {
                    console.log(res);
                    console.log(res.body.usersWorkout.id);
                    this.$router.push('/users/workout/' + res.body.usersWorkout.id);
                }.bind(this)),
                this.authProtectedRequestFailed(function (res) { this._resetRequest(); console.log("error"); }.bind(this))
            );
        },
        _startBlankWorkout: function () { this._startWorkout(); },
        _startWithLastWorkoutSetup: function () {
            this.request.copyLast = true;
            this._startWorkout();
        },
        _modalToggle: function (workoutId) {
            this.modalShow = !this.modalShow;
            this.request.workout = workoutId;
        }
    },
    data: function () { return {
        workouts: [],
        modalShow: false,
        request: {
            workout: null,
            copyLast: false
        }
    }; }

});